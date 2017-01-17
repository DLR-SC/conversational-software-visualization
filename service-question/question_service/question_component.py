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

        def got_message(args):
            if len(args) != 1:
                raise Exception("Invalid arguemnt")
            incoming_msg = args[0]
            self.publish(u'sofia.messages.OUTGOING_MESSAGE', u'The force will be with you always')


        await self.subscribe(got_message, u'sofia.messages.INCOMING_MESSAGE')
        print("Registered methods; ready for actions.")
