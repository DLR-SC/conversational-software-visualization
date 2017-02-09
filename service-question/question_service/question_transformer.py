

import re


def recognize_project_request(message_text,channel_id):
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
        # self.publish("sofia.channel.{0}.messages.RequestProjectConfig".format(channel_id), {"msh": "test"})
        return  {   'channel': u'sofia.channel.{0}.messages.RequestProjectConfig'.format(channel_id),
                    'data': {}
                }
    else:
        return None


def recognize_namepsace(message_text, channel_id):
    splits = message_text.split(" ")
    splits = map(lambda part: re.search("^([a-z_]{1}[a-z0-9_]*(\.[a-z_]{1}[a-z0-9_]*)+)$", part),splits)
    splits = filter(lambda x: x is not None, splits)

    namespaces  = map(lambda x: x.group(), splits)
    namespaces_events  = map(lambda x:
                              {'channel': u'sofia.channel.{0}.messages.Namespace'.format(channel_id),
                               'data': {"namespace": x}
                              }
                             , namespaces)

    return list(namespaces_events)

def recognize_class_name(message_text, channel_id):
    splits = message_text.split(" ")
    splits = map(lambda part: re.search("[A-Z]([A-Z0-9]*[a-z][a-z0-9]*[A-Z]|[a-z0-9]*[A-Z][A-Z0-9]*[a-z])[A-Za-z0-9]*", part),splits)
    splits = filter(lambda x: x is not None, splits)
    classNames = map(lambda x: x.group(), splits)
    events = map(lambda x:  {'channel': u'sofia.channel.{0}.messages.Namespace'.format(channel_id),
                               'data': {"className": x}
                              }, classNames)

    return list(events)


def recognize_events_from_str(message_text, channel_id):

    events = list()

    events.append(recognize_project_request(message_text,channel_id))

    flat_events = filter(lambda x: isinstance(x,list), events)
    flat_events = sum(flat_events,[])

    flat_events = flat_events + list(filter(lambda x: isinstance(x,object), events))


    return list(filter(lambda x:x is not None,flat_events))