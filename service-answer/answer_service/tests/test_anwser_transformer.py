from unittest import TestCase
from answer_service.answer_module import AnswerModule
test_url = 'http://osgi-api.cloud.conts.de'
import asyncio
class AnswerModuleTest (TestCase):


    def test_get_bundles(self):


        instance =  AnswerModule(test_url, "", None)
        result = instance.get_bundles()
        self.assertIsNotNone(result )
        self.assertIsInstance(result ,list)
        self.assertGreater(len(result),10)


    def test_get_classes(self):
        instance = AnswerModule(test_url, "", None)
        result = instance.get_classes()
        self.assertIsNotNone(result)
        self.assertIsInstance(result, list)
        self.assertGreater(len(result), 10)


    def test_more_info(self):
        type = "namespace"
        def askStr():
           return "com.gui"
        instance = AnswerModule(test_url, "", askStr)

        result_event = yield from instance.more_info(type)
        self.assertIsNotNone(result_event)
        self.assertIsInstance(result_event,object)
        self.assertEqual(result_event['channel'],u'sofia.channel.{0}.messages.OutgoingSentence')
