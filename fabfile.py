#!/usr/bin/env python
"""
fabric tasks for repetitive blockd3 tasks

while grunt.js or something would have been potentially more appropriate,
I feel more comfortable in python for system automation tasks, and want to
learn the fabric way of doin things.

also, the dependency on node.js is more exotic to me than python. ymmv. 
"""

import os

from fabric.api import local

PROJECT_ROOT = local("echo $(git rev-parse --show-toplevel)")
DEMO_LIB = os.path.join(PROJECT_ROOT, "demo", "lib")


def build():
    pass

        
def serve():
    import SimpleHTTPServer
    import SocketServer

    PORT = 8000

    Handler = SimpleHTTPServer.SimpleHTTPRequestHandler

    httpd = SocketServer.TCPServer(("", PORT), Handler)

    print "serving at port", PORT
    httpd.serve_forever()