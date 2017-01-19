from autobahn.asyncio.wamp import ApplicationSession


class QuestionComponent(ApplicationSession):
    """
    An application component providing procedures with different kinds
    of arguments.
    """
    def get_channel_from_event(self,event):
        return event.topic
    def convert_to_intent(self, sentence):

        if sentence == "Wo ist Klasse xyz?":

            return {
                    "eventName": "SEARCH_FOR_CLASS",
                    "className": "xyz"
                    }


    async def onJoin(self, details):

        def got_message(incomming_msg,obj,event):
            incoming_text = incomming_msg['text']
            channel = self.get_channel_from_event(event)
            print("incomming: {0}".format(incomming_msg))
            self.publish(u'sofia.channel.{0}.messages.OUTGOING_MESSAGE'.format(channel), {
                "text": u'The force will be with you always',
                "channel": u'GENERAL'
                                                              })


        await self.subscribe(got_message, u'sofia.channel..messages.INCOMING_MESSAGE',{'match': 'wildecard'})
        print("Registered methods; ready for actions. Give me some... ")
