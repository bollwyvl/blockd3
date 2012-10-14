#!/usr/bin/env python
# -*- coding: utf-8 -*-
import os
import unittest
import logging

from ghost import GhostTestCase, Ghost
from app import app


PORT = 5000

base_url = 'http://localhost:%s/' % PORT

class GhostTest(GhostTestCase):
    port = PORT
    display = False
    log_level = logging.INFO

    @classmethod
    def create_app(cls):
        return app

    def test_open(self):
        page, resources = self.ghost.open(base_url)
        self.assertEqual(page.url, base_url)
        self.assertTrue("Test page" in self.ghost.content)

if __name__ == '__main__':
    unittest.main()