from unittest import TestCase
from question_service.question_component import QuestionComponent
class QuestionComponentTest (TestCase):

    def test_ask_for_class(self):
        cls = QuestionComponent();

        result = cls.convert_to_intent("Wo ist Klasse xyz?")
        self.assertIsNotNone(result)
        self.assertIsInstance(result,dict)
        self.assertIsNotNone(result['eventName'])
        self.assertIsNotNone(result['className'])
        self.assertEqual(result['className'], "xyz")
