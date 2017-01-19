#!/usr/bin/env python
try:
    from setuptools import setup, find_packages
except ImportError:
    from distutils.core import setup, find_packages

tests_require = [
    'coverage',
    'coveralls'
]

docs_require = [
    'Sphinx>=1.3.5',
    'recommonmark>=0.4.0',
    'sphinx-rtd-theme>=0.1.9',
    'sphinxcontrib-napoleon>=0.4.4',
    'sphinxcontrib-httpdomain>=1.5.0',
    'mock',
]

setup(
    name='sofia-question-service',
    version='0.1',
    description='A service to convert a sentence into an intent',
    keywords=[
        'wamp', 'service'
    ],
    author='Stefan Bieliauskas',
    author_email='sb@conts.de',
    url='https://github.com/B-Stefan/sofia',
    classifiers=[
        'Development Status :: 1 - Planning',
        'License :: OSI Approved :: Apache Software License',
        'Programming Language :: Python :: 3.5'
    ],
    license="Apache License 2.0",

    packages=find_packages(),
    package_dir={
        'question_service': 'question_service'
    },
    include_package_data=True,
    zip_safe=False,
    install_requires=[
        "autobahn==0.17.1"
        "autobahn-autoreconnect==0.0.1"
    ],
    extras_require={
        'test': tests_require,
        'dev': tests_require + docs_require,
        'docs': docs_require,
    },

    test_suite='question_service.tests',
)
