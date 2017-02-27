from autobahn.asyncio.wamp import ApplicationSession
from autobahn.wamp.types import SubscribeOptions, RegisterOptions, PublishOptions

import asyncio

class AnswerComponent(ApplicationSession):
    """
    An application component providing procedures with different kinds
    of arguments.
    """
    def __init__(self, *kwargs):
        super().__init__(*kwargs)

        # Used to store the information that a service requested information from the user
        self.pendingQuestion = False
        # The last input from the user.
        self.last_input = ""


    def send_text(self,text,channel_id):
        """
        Send a text msg to the channel
        :param text: The text
        :param channel_id: The channel id
        :return: result from publish function
        """

        print("Send text {0}".format(text))

        return self.publish(u'sofia.channel.{0}.messages.OutgoingSentence'.format(channel_id), {
            "text": text,
            "channel": channel_id})



    def on_more_info(self, type,  details):
        """
        Hook for the incoming more info event
        :param message:
        :param details:
        :return:
        """



    async def onJoin(self, details):
        """
        Get called if the component successful connected to the wamp router
        :param details:
        :return:
        """

        await self.subscribe(self.on_more_info, "sofia.channel..messages.MoreInfo", options=SubscribeOptions(match='wildcard', details_arg='details'))
        print("Registered methods; ready for actions. Give me some... ")
