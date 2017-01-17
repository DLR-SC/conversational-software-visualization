from autobahn.asyncio.wamp import ApplicationSession


class QuestionComponent(ApplicationSession):
    """
    An application component providing procedures with different kinds
    of arguments.
    """

    def convert_to_intent(self, sentence):

        if sentence == "Wo ist Klasse xyz?":

            return {
                    "eventName": "SEARCH_FOR_CLASS",
                    "className": "xyz"
                    }


    async def onJoin(self, details):

        def got_message(incomming_msg):
            incoming_text = incomming_msg['text']
            print("incomming: {0}".format(incomming_msg))
            self.publish(u'sofia.messages.OUTGOING_MESSAGE', {
                "text": u'The force will be with you always',
                "channel": u'GENERAL'
                                                              })


        await self.subscribe(got_message, u'sofia.messages.INCOMING_MESSAGE')
        print("Registered methods; ready for actions. Give me some... ")
