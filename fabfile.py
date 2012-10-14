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
        
PROJECT_ROOT = str(sh.git("rev-parse", **{"show-toplevel": True})).strip()

CFG_TEMPLATE = """# do not modify this file. generated automatically
[minify_%(src)s]
sources = %(assets)s
output = dist/%(src)s/blockd3-min.%(src)s

"""
@task
def proj():
    sh.cd(PROJECT_ROOT)

@task
def build():
    proj()
    minify()
    favicon()
    sh.cd("dist")
    print sh.git("status")

@task
def favicon():
    print(". generating favicons...")
    sizes = [16, 32, 64, 128]
    
    tmp_file = lambda size: "/tmp/favicon-%s.png" % size
    
    for size in sizes:
        print("... %sx%s" % (size, size))
        sh.convert("svg/logo.svg",
            "-resize",
                "%sx%s" % (size, size),
            tmp_file(size))
    print(".. generating bundle")
    sh.convert(
        *[tmp_file(size) for size in sizes] + [
            "-colors", 256,
            "dist/favicon.ico"
        ]
    )
    print(".. cleaning up")
    sh.rm(sh.glob("/tmp/favicon-*.png"))

@task
def minify():

    print(". minifying ...")
    copy_patterns = {
        "dist/lib/blockly": ["lib/blockly/blockly.css"],
        "dist/lib/blockly/media":  sh.glob("lib/blockly/media/*") or [],
        "dist/font": sh.glob("lib/awesome/font/fontawesome-webfont.*") or [],
        "dist/css": [],
        "dist/js": [],
        "dist/svg": sh.glob("svg/*.svg") or [],
    }
    
    for dst, copy_files in copy_patterns.items():

        os.path.exists(dst) or sh.mkdir("-p", dst)
        for c_file in copy_files:
            print "... copying", c_file, dst
            sh.cp("-r", c_file, dst)
    
    html = ["index.html", "frame.html"]

    sources = dict(js=[],css=[])
    
    for html_file in sh.glob("*.html"):
        print ".. analyzing %s" % html_file
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
            STYLES='<link rel="stylesheet" href="./css/blockd3-min.css">',
            SCRIPTS='<script type="text/javascript" src="./js/blockd3-min.js"></script>'
        )
        
        for THING, new_thing in replacements.items():
            html = _html_replace(html, THING, new_thing)
        

        print ".. writing out production dist/%s" % html_file
        new_file.write(html)
        new_file.close()
        
    
    cfg = open("setup.cfg", "w")
    
    cfg.writelines([
        CFG_TEMPLATE % {"src": src, "assets": " ".join(assets)}
        for src, assets in sources.items()
    ])

    print ".. writing out production setup.cfg"
    cfg.close()
    
    [
        pprint(sh.python("setup.py", "minify_" + src, verbose=True))
        for src in sources
    ]

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