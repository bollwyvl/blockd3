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

from bs4 import BeautifulSoup

import sh
        
PROJECT_ROOT = sh.git("rev-parse", **{"show-toplevel": True})

CFG_TEMPLATE = """# do not modify this file. generated automatically
[minify_%(src)s]
sources = %(assets)s
output = dist/blockd3-min.%(src)s

"""


@task
def build():
    copy_patterns = {
        "dist/lib/blockly": ["lib/blockly/blockly.css"],
        "dist/lib/blockly/media":  sh.glob("lib/blockly/media/*") or [],
        "dist/font": sh.glob("lib/awesome/font/fontawesome-webfont.*") or []
    }
    
    for dst, copy_files in copy_patterns.items():
        os.path.exists(dst) or sh.mkdir("-p", dst)
        for c_file in copy_files:
            print "\tcopied", c_file, dst
            sh.cp("-r", c_file, dst)
    
    html = ["index.html", "frame.html"]

    sources = dict(js=[],css=[])
    
    for html_file in sh.glob("*.html"):
        html = open(html_file).read()
        soup = BeautifulSoup(html)
        
        for link in soup.find_all('link'):
            sources["css"] += [link["href"]]
            
        for script in soup.find_all("script"):
            if script.get("src", None):
                sources["js"] += [script["src"]]
                
        new_file = open(os.path.join("dist", html_file), "w")
        
        def _html_replace(html, THING, new_thing):
            tmpl = "<!--%s%s-->"
            t_start = html.find(tmpl % ("###", THING))
            t_end = html.find(tmpl % (THING, "###"))
            return "%s%s%s" % (
                html[0:t_start],
                new_thing,
                html[t_end:]
            )
        
        replacements = dict(
            STYLES='<link rel="stylesheet" href="./blockd3-min.css">',
            SCRIPTS='<script type="text/javascript" src="./blockd3-min.js"></script>'
        )
        
        for THING, new_thing in replacements.items():
            html = _html_replace(html, THING, new_thing)
        
        new_file.write(html)
        new_file.close()
        
    
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