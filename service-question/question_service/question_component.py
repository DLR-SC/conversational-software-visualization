from autobahn.asyncio.wamp import ApplicationSession
from autobahn.wamp.types import SubscribeOptions
import functools

class QuestionComponent(ApplicationSession):
    """
    An application component providing procedures with different kinds
    of arguments.
    """
    def get_channel_from_details(self,details):
        arr = details.topic.split(".")
        indexOfMessage = arr.index("channel")
        return arr[indexOfMessage+1]

    def convert_to_intent(self, sentence):

        if sentence == "Wo ist Klasse xyz?":

            return {
                    "eventName": "SEARCH_FOR_CLASS",
                    "className": "xyz"
                    }


    def onIncommingMessage(self,message, details):
        print("{0}".format(message))
        channel_id = self.get_channel_from_details(details)

        print("got message {0}".format(channel_id))
        self.publish(u'sofia.channel.{0}.messages.OUTGOING_MESSAGE'.format(channel_id), {
            "text": u'The force will be with you always',
            "channel": channel_id})


    async def onJoin(self, details):

        await self.subscribe(self.onIncommingMessage,"sofia.channel..messages.INCOMING_MESSAGE",options=SubscribeOptions(match='wildcard',details_arg='details'))
        print("Registered methods; ready for actions. Give me some... ")
