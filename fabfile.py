#!/usr/bin/env python
"""
fabric tasks for repetitive blockd3 tasks

while grunt.js or something would have been potentially more appropriate,
I feel more comfortable in python for system automation tasks, and want to
learn the fabric way of doing things.

also, the dependency on node.js is more exotic to me than python. ymmv. 
"""

import os
from pprint import pprint

from fabric.api import task
from fabric.tasks import Task

import sh
        
PROJECT_ROOT = sh.git("rev-parse", **{"show-toplevel":True})

CFG_TEMPLATE = """# do not modify this file. generated automatically
[minify_%(src)s]
sources = %(assets)s
output = dist/blockd3-min.%(src)s

"""

@task
def build():
    sources = dict(
        js=sh.glob("js/*.js"),
        css=sh.glob("css/*.css")
    )
    
    cfg = open("setup.cfg", "w")
    
    cfg.writelines([
        CFG_TEMPLATE % {"src": src, "assets": " ".join(assets)}
        for src, assets in sources.items()
    ])

    cfg.close()
    
    pprint([
        sh.python("setup.py", "minify_" + src, verbose=True)
        for src in sources
    ])
    
    print sh.ls("-lathr", "dist")
    """
    Common commands: (see '--help-commands' for more)

      setup.py build      will build the package underneath 'build/'
      setup.py install    will install the package

    Global options:
      --verbose (-v)  run verbosely (default)
      --quiet (-q)    run quietly (turns verbosity off)
      --dry-run (-n)  don't actually do anything
      --help (-h)     show detailed help message
      --no-user-cfg   ignore pydistutils.cfg in your home directory

    Options for 'minify_js' command:
      --sources                sources files
      --output                 minified output filename. If you provide a template
                               output filename (e.g. "static/%s-min.ext"), the
                               source files will be minified individually
      --charset                Read the input file(s) using <charset>
      --line-break             Insert a line break after the specified column
                               number
      --nomunge                Minify only, do not obfuscate
      --preserve-semi          Preserve all semicolons
      --disable-optimizations  Disable all micro optimizations

    usage: setup.py [global_opts] cmd1 [cmd1_opts] [cmd2 [cmd2_opts] ...]
       or: setup.py --help [cmd1 cmd2 ...]
       or: setup.py --help-commands
       or: setup.py cmd --help
    """


def custom_task(*myarg):
    class CustomTask(Task):
        def __init__(self, func, myarg, *args, **kwargs):
            super(CustomTask, self).__init__(*args, **kwargs)
            self.func = funcs
            self.myarg = myarg

        def run(self, *args, **kwargs):
            return self.func(*args, **kwargs)
        
def serve():
    import SimpleHTTPServer
    import SocketServer

    PORT = 8000

    Handler = SimpleHTTPServer.SimpleHTTPRequestHandler

    httpd = SocketServer.TCPServer(("", PORT), Handler)

    print "serving at port", PORT
    httpd.serve_forever()