from autobahn.asyncio.wamp import ApplicationSession
from autobahn.wamp.types import SubscribeOptions, RegisterOptions, CallDetails
from question_service.question_transformer import recognize_events_from_str
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
        if type(details) == CallDetails:
            arr = details.procedure.split(".")
        else:
            arr = details.topic.split(".")
        indexOfMessage = arr.index("channel")
        return arr[indexOfMessage+1]

    def convert_to_intent(self, sentence):

        if sentence == "Wo ist Klasse xyz?":

            return {
                    "eventName": "SEARCH_FOR_CLASS",
                    "className": "xyz"
                    }


    def send_text(self,text,channel_id):
        print("Send text {0}".format(text))
        self.publish(u'sofia.channel.{0}.messages.OutgoingSentence'.format(channel_id), {
            "text": text,
            "channel": channel_id})

    def ask_string(self, msg, details):
        print("Ask for string")
        self.pendingQuestion = True
        channel_id = self.get_channel_from_details(details)
        self.send_text(msg['question'], channel_id)
        while (self.pendingQuestion):
            yield from asyncio.sleep(1)
        user_input = self.last_message
        print("Got response... {0}".format(user_input))
        return user_input['text']


    def onIncommingMessage(self,message, details):

        self.last_message = message
        print(self.pendingQuestion)
        if(self.pendingQuestion):
            self.pendingQuestion = False
            print("Pending question skip all other")
            return


        print("{0}".format(message))
        channel_id = self.get_channel_from_details(details)
        message_text = message["text"].strip()

        events = recognize_events_from_str(message_text, channel_id)

        print(events)
        for event in events:
            self.publish(event['channel'],event['data'])

    async def onJoin(self, details):

        await self.subscribe(self.onIncommingMessage,"sofia.channel..messages.IncomingSentence",options=SubscribeOptions(match='wildcard',details_arg='details'))
        await self.register(self.ask_string, u'sofia.channel..rpc.service-question.askString',options=RegisterOptions(match='wildcard', details_arg='details'))
        print("Registered methods; ready for actions. Give me some... ")
