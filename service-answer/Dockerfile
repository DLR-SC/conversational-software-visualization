FROM python:3.5.2

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY setup.py /usr/src/app/

# Bundle app source
COPY . /usr/src/app

RUN python setup.py install


CMD [ "python", "answer_service" ]

