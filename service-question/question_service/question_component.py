from autobahn.asyncio.wamp import ApplicationSession
from autobahn.wamp.types import SubscribeOptions, RegisterOptions, PublishOptions
from question_service.utils import get_channel_from_details
from question_service.question_transformer import recognize_events_from_str
import asyncio

class QuestionComponent(ApplicationSession):
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

    def ask_string(self, msg, details):
        """
        Ask the user a question and return if the user entered some text
        :param msg: The question
        :param details: The details from the rpc call
        :return: The user input
        """
        print("Ask for string")

        self.pendingQuestion = True

        channel_id = get_channel_from_details(details)

        self.send_text(msg['question'], channel_id)

        #Block the function as long as the user need for the input
        while (self.pendingQuestion):
            yield from asyncio.sleep(1)

        user_input = self.last_message
        print("Got response... {0}".format(user_input))
        return user_input['text']


    def on_incoming_sentence(self, incomming_sentence,  details):
        """
        Hook for the incoming sentence
        :param message:
        :param details:
        :return:
        """

        self.last_message = incomming_sentence["text"]

        if(self.pendingQuestion):
            self.pendingQuestion = False
            print("Pending question skip all other")
            return


        print("Got message: {0}".format(incomming_sentence))

        channel_id = get_channel_from_details(details)

        message_text = incomming_sentence["text"].strip()

        events = recognize_events_from_str(message_text, channel_id)

        for event in events:
            print(event)
            self.publish(event['channel'],event['data'], options=PublishOptions(retain=True))

    async def onJoin(self, details):
        """
        Get called if the component successful connected to the wamp router
        :param details:
        :return:
        """

        await self.subscribe(self.on_incoming_sentence, "sofia.channel..messages.IncomingSentence", options=SubscribeOptions(match='wildcard', details_arg='details'))
        await self.register(self.ask_string, u'sofia.channel..rpc.service-question.askString',options=RegisterOptions(match='wildcard', details_arg='details'))
        print("Registered methods; ready for actions. Give me some... ")
