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
    name='sofia-service-answer',
    version='0.1',
    description='A service to answser to more info events ',
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
        'answer_service': 'answer_service'
    },
    include_package_data=True,
    zip_safe=False,
    install_requires=[
        "autobahn==0.17.1",
        "autobahn-autoreconnect==0.1.0"
    ],
    extras_require={
        'test': tests_require,
        'dev': tests_require + docs_require,
        'docs': docs_require,
    },

    test_suite='answer_service.tests',
)
