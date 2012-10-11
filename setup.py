# -*- coding: utf-8 -*-

from setuptools import setup, find_packages


with open('README.markdown') as f:
    readme = f.read()

with open('LICENSE') as f:
    license = f.read()

setup(
    name='sample',
    version='0.0.1',
    description='blockd3 build systems',
    long_description=readme,
    author='Nicholas Bollweg',
    author_email='nick.bollweg@gmail.com',
    url='https://github.com/bollwyvl/blockd3',
    license=license,
    install_requires=['minify'],
    packages=find_packages(exclude=('tests', 'docs'))
)
