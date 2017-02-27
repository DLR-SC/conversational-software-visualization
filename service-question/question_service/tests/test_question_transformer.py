from unittest import TestCase
from question_service.question_transformer import recognize_events_from_str,recognize_project_request, recognize_namepsace, recognize_class_name,recognize_more_info
class QuestionTransformer (TestCase):

    def test_recognizeProjectRequest(self):


        result = recognize_project_request("setup git", 1000)
        self.assertIsNotNone(result)
        self.assertIsInstance(result,object)
        self.assertIsNotNone(result['channel'])
        self.assertIsNotNone(result['data'])
        self.assertEqual(result['channel'], 'sofia.channel.1000.messages.RequestProjectConfig')


        result = recognize_project_request("setup project", 1000)
        self.assertIsNotNone(result)
        self.assertIsInstance(result,object)

        result = recognize_project_request("project setup", 1000)
        self.assertIsNotNone(result)
        self.assertIsInstance(result,object)

    def test_recognizeEventsFromStr(self):

        result = recognize_events_from_str("project setup", 1000)
        self.assertIsNotNone(result)
        self.assertIsInstance(result, list)
        first = result.pop()
        self.assertIsNotNone(first['channel'])
        self.assertIsNotNone(first['data'])

        result = recognize_events_from_str("Adsassdasdssdsd", 1000)
        self.assertIsNotNone(result)
        self.assertIsInstance(result, list)
        self.assertEqual(len(result),0)



    def test_recognize_namepsace(self):
        result = recognize_namepsace("Show me the namespace com.de.hh and test.test", 1000)

        self.assertIsNotNone(result)
        self.assertIsInstance(result,list)
        self.assertEqual(len(result),2)
        first = result.pop()
        self.assertIsNotNone(first['channel'])
        self.assertIsNotNone(first['data'])
        self.assertIsInstance(first["data"]["namespace"],str)
        self.assertEqual(first["data"]["namespace"],"test.test")


        result = recognize_namepsace("Show me all about the namespace gui", 1000)

        self.assertIsNotNone(result)
        self.assertIsInstance(result,list)
        self.assertEqual(len(result),1)
        first = result.pop()
        self.assertIsNotNone(first['channel'])
        self.assertIsNotNone(first['data'])
        self.assertIsInstance(first["data"]["namespace"],str)
        self.assertEqual(first["data"]["namespace"],"gui")



    def test_recognize_class_name(self):
        result = recognize_class_name("I have a problem with LoginImplementation", 1000)

        self.assertIsNotNone(result)
        self.assertIsInstance(result,list)
        self.assertEqual(len(result),1)
        first= result.pop()
        self.assertIsNotNone(first['channel'])
        self.assertIsNotNone(first['data'])
        self.assertIsInstance(first["data"]["className"],str)
        self.assertEqual(first["data"]["className"],"LoginImplementation")

        result = recognize_class_name("I have a problem with LoginImplementation in the package com.test.gui", 1000)

        self.assertIsNotNone(result)
        self.assertIsInstance(result, list)
        self.assertEqual(len(result), 1)
        first = result.pop()
        self.assertIsNotNone(first['channel'])
        self.assertIsNotNone(first['data'])
        self.assertIsInstance(first["data"]["className"], str)
        self.assertEqual(first["data"]["className"], "LoginImplementation")


    def test_more_info(self):
        result = recognize_more_info("Tell me more", "test", True)
        self.assertIsNotNone(result)
        self.assertIsInstance(result,object)

        result = recognize_more_info("Tell me more about namespace gui ", "test", True)
        self.assertIsNotNone(result)
        self.assertIsInstance(result, object)
        self.assertEqual(result["data"]["type"], "namespace")