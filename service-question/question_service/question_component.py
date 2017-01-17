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

        def ping():
            return

        def add2(a, b):
            return a + b

        def stars(nick="somebody", stars=0):
            return u"{} starred {}x".format(nick, stars)

        # noinspection PyUnusedLocal
        def orders(product, limit=5):
            return [u"Product {}".format(i) for i in range(50)][:limit]

        def arglen(*args, **kwargs):
            return [len(args), len(kwargs)]

        await self.register(ping, u'com.arguments.ping')
        await self.register(add2, u'com.arguments.add2')
        await self.register(stars, u'com.arguments.stars')
        await self.register(orders, u'com.arguments.orders')
        await self.register(arglen, u'com.arguments.arglen')
        print("Registered methods; ready for actions.")
