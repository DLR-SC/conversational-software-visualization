from unittest import TestCase
from answer_service.answer_module import AnswerModule
test_url = 'http://osgi-api.cloud.conts.de'
class AnswerModuleTest (TestCase):


    def test_get_bundles(self):


        instance =  AnswerModule(test_url)
        result = instance.get_bundles()
        self.assertIsNotNone(result )
        self.assertIsInstance(result ,list)
        self.assertGreater(len(result),10)
