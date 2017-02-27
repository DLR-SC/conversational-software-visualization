

import re
import urllib.request
import json


class AnswerModule:
    """
    Testable class to get the events from a request
    """
    def __init__(self, base_url,channel_id, askstringFunc):
        """
        Set up the class
        :param base_url: url for osgi service
        :param channel_id: the channel id
        :param askstringFunc: the function to ask the user for feedback (must be async)
        """
        self.base_url = base_url
        self.channel_id = channel_id
        self.last_namespace = None
        self.last_class = None
        self.askString = askstringFunc

    def get_bundles(self):
        """
        Return the bundes as list
        :return: bundle list
        """
        req = urllib.request.Request("{0}/bundles?size=1000".format(self.base_url))
        response = urllib.request.urlopen(req)
        the_page = response.read()
        data = json.loads(the_page.decode('utf-8'))
        return data['_embedded']['bundles']

    def get_classes(self):
        """
        Returns the classes
        :return: classes as list
        """
        req = urllib.request.Request("{0}/classes".format(self.base_url))
        response = urllib.request.urlopen(req)
        the_page = response.read()
        data = json.loads(the_page.decode('utf-8'))
        return data['_embedded']['classes']


    def _prepare_msg_event(self, msg):
        """
        Returns a event that is a direct msg to the user
        :param msg: The text the user sees
        :return: The event
        """
        return {'channel': u'sofia.channel.{0}.messages.OutgoingSentence'.format(self.channel_id),
                                'data': {"text": msg}
                               }
    async def more_info(self, type, deep=0):
        """
        Trys to find the namespace in the namespace list and give you more information about the namespace
        :param type: namespace | class
        :param deep: maximum 3, because auf recursive call
        :return: a result event
        """
        if (type ==  'namespace'):
            #If last namespace not set ask the user
            if self.last_namespace is None:
                #use wamp RPC method to ask the user
                self.last_namespace = await self.askString("Okay I just forgot the namespace your are talking about, please tell me for witch namespace you want more information", self.channel_id)

            #Get bundles an return the event
            bundles = self.get_bundles()
            bundles = filter(lambda x: x['symbolicName'].index(self.last_namespace) >=0,bundles)
            first_bundle = list(bundles).pop()
            return self._prepare_msg_event("Okay picked first bundle form your namespace... {0} it has {1} packages and import | exports {2} | {3}".format(first_bundle['symbolicName'], first_bundle['packages'], first_bundle['imports'], first_bundle['exports']))

        if (type == 'class'):
            #If last class never been set ask user for it
            if self.last_class is None:
                self.last_class = await self.askString("Okay I just forgot the class your are talking about, please tell me for witch class you want more information",self.channel_id)

            #get classes and return the event
            classes = self.get_classes()
            classes = filter(lambda x:x['name'].index(self.last_class)>=0,classes)
            cls = list(classes).pop()

            return self._prepare_msg_event("Okay got your summary for the class {0} \n  * {1} Constructors \n {2} Methods ".format(cls['qualifiedName'], cls['methods'], cls['constructors']))

        else:
            #To avoid that the user is in a infinity loop
            if deep >= 3:
                return self._prepare_msg_event("I cant understand your requests, I give up")

            #If we got no correct type, we should ask the user for this.
            type_new = self.last_class = await self.askString("Can't help you, please tell me a little bit more. \n Do you wish information about a namespace or class ?",self.channel_id)
            #And return the result of the more_info method (recusive call)
            return self.more_info(type_new,deep=deep+1)

