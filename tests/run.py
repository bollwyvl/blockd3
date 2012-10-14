#!/usr/bin/env python
# -*- coding: utf-8 -*-
import os
import unittest
import logging

from ghost import GhostTestCase, Ghost
from app import app


PORT = 5000

base_url = 'http://localhost:%s/' % PORT

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
        page, resources = self.ghost.open(base_url)
        self.assertEqual(page.url, base_url)
        result, resources = self.ghost.evaluate("""
            d3.select("svg")
                .selectAll("rect")
                .style("fill")
        """)
        self.assertEqual(result, "#ff0000")

if __name__ == '__main__':
    unittest.main()