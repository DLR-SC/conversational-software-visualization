
from autobahn.wamp.types import CallDetails

def get_channel_from_details(details):
    if type(details) == CallDetails:
        arr = details.procedure.split(".")
    else:
        arr = details.topic.split(".")
    indexOfMessage = arr.index("channel")
    return arr[indexOfMessage + 1]