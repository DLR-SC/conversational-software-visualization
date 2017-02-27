from autobahn.asyncio.wamp import ApplicationSession
from autobahn.wamp.types import SubscribeOptions, RegisterOptions, PublishOptions
from answer_service.answer_module import AnswerModule
from answer_service.utils import get_channel_from_details
import asyncio
base_url = 'http://osgi-api.cloud.conts.de'
class AnswerComponent(ApplicationSession):
    """
    An application component providing procedures with different kinds
    of arguments.
    """
    def __init__(self, *kwargs):
        super().__init__(*kwargs)


    def on_more_info(self, type,  details):
        """
        Hook for the incoming more info event
        :param message:
        :param details:
        :return:
        """

        channel_id = get_channel_from_details(details)

        def ask_str(question,channel_id):
            return self.call(u'sofia.channel.{0}.rpc.askString'.format(channel_id), question)

        instance = AnswerModule(base_url,channel_id,ask_str)
        result = instance.more_info(type)

        self.publish(result['channel'], result['data'],options=PublishOptions(retain=True))


    async def onJoin(self, details):
        """
        Get called if the component successful connected to the wamp router
        :param details:
        :return:
        """

        await self.subscribe(self.on_more_info, "sofia.channel..messages.MoreInfo", options=SubscribeOptions(match='wildcard', details_arg='details'))
        print("Registered methods; ready for actions. Give me some... ")
