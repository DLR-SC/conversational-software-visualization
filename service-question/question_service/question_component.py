from autobahn.asyncio.wamp import ApplicationSession
from autobahn.wamp.types import SubscribeOptions, RegisterOptions
import asyncio

class QuestionComponent(ApplicationSession):
    """
    An application component providing procedures with different kinds
    of arguments.
    """
    def __init__(self, *kwargs):
        super().__init__(*kwargs)

        self.pendingQuestion = False
        self.last_input = ""

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

    async def wait_for_next_input(self):
        while(self.pendingQuestion):
            await asyncio.sleep(200)
        return self.last_input


    def ask_string(self, details, sentence):
        self.pendingQuestion = True
        channel_id = self.get_channel_from_details(details)
        yield self.publish(u'sofia.channel.{0}.messages.OUTGOING_MESSAGE'.format(channel_id), {"text": sentence})
        user_input = yield self.wait_for_next_input()
        print(user_input)
        return user_input


    def onIncommingMessage(self,message, details):
        self.last_message = message
        self.pendingQuestion = False
        print("{0}".format(message))
        channel_id = self.get_channel_from_details(details)
        message_text = message["text"].strip()

        project_setup = [
            "project setup"
            "setup"
            "setup project"
            "setup git"
            "setup repository"
            "repository setup"
            "git setup"
            "channel setup"
            "setup channel"
        ]
        if any(message_text in s for s in project_setup):
            #self.publish("sofia.channel.{0}.messages.RequestProjectConfig".format(channel_id), {"msh": "test"})
            self.publish(u'sofia.channel.{0}.messages.RequestProjectConfig'.format(channel_id), {
                "text": u'asdasd force will be with you always',
                "channel": channel_id})
            print("project setup send")

        else:
            self.publish(u'sofia.channel.{0}.messages.OutgoingSentence'.format(channel_id), {
                "text": u'The force will be with you always',
                "channel": channel_id})

    async def onJoin(self, details):

        await self.subscribe(self.onIncommingMessage,"sofia.channel..messages.IncomingSentence",options=SubscribeOptions(match='wildcard',details_arg='details'))
        await self.register(self.ask_string, u'sofia.channel..rpc.QuestionService.askString',options=RegisterOptions(match='wildcard', details_arg='details'))
        print("Registered methods; ready for actions. Give me some... ")
