import txaio
txaio.use_asyncio()

from os import environ
from answer_service.answer_component import AnswerComponent
from autobahn_autoreconnect import ApplicationRunner



if __name__ == '__main__':
    runner = ApplicationRunner(
        environ.get("WAMP_ROUTER_URL", u"ws://wamp_router:8080/ws"),
        environ.get("WAMP_RELAM", u"realm1"),
    )
    runner.run(AnswerComponent)

else:
    raise Exception("This module is only to start the server, use the environment variables: WAMP_ROUTER_URL and \
     WAMP_RELAM to start the server ")