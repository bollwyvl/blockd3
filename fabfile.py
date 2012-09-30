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

demo_deps = {
    "blockly": {
        "get": "svn export http://blockly.googlecode.com/svn/trunk/ %s"
    }
}

def update_demo_deps():
    """
    grab and document the newest version of the demo libs (blockly, d3)
    """
    for dep, cmds in demo_deps.items():
        local(cmds["get"] % os.path.join(DEMO_LIB, dep))