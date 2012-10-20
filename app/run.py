#!/usr/bin/env python
# -*- coding: utf-8 -*-
import unittest
import logging

from ghost import GhostTestCase, Ghost
from app import make_app

app = make_app("test")

PORT = 5000

base_url = "http://localhost:%s/dist/" % PORT

class Blockd3GhostTest(GhostTestCase):
    port = PORT
    display = False
    log_level = logging.INFO

    def __new__(cls, *args, **kwargs):
        """Creates Ghost instance."""
        if not hasattr(cls, 'ghost'):
            cls.ghost = Ghost(display=cls.display,
                wait_timeout=10,
                viewport_size=cls.viewport_size,
                log_level=cls.log_level)
        return super(Blockd3GhostTest, cls).__new__(cls, *args, **kwargs)

    @classmethod
    def create_app(cls):
        return app

    def test_open(self):
        """
        Test that the page loads
        """
        page, resources = self.ghost.open(base_url)
        self.assertEqual(page.url, base_url)
        
        self.ghost.click("#run")

if __name__ == "__main__":
    unittest.main()