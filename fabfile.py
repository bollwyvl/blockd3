#!/usr/bin/env python
"""
fabric tasks for repetitive blockd3 tasks

while grunt.js or something would have been potentially more appropriate,
I feel more comfortable in python for system automation tasks, and want to
learn the fabric way of doing things.

also, the dependency on node.js is more exotic to me than python. ymmv.
"""

import os
import sys
from pprint import pprint
import json
import re

from fabric.api import task

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
def flake():
    print(". running PyFlakes on test equipment")
    proj()
    sh.pyflakes("setup.py", "fabfile.py", "app/")


@task
def pep8():
    sh.pep8("fabfile.py")


@task
def build():
    proj()
    flake()
    clean()
    copy_assets()
    html()
    minify()
    favicon()
    sh.cd("dist")
    print sh.git("status")


@task
def dev():
    sh.git("submodule", "init")
    sh.git("submodule", "update")


@task
def clean():
    proj()
    print ". cleaning up build and dist"
    try:
        sh.rm("-r", sh.glob("dist/*"), sh.glob("build/*"))
    except:
        print ".. already clean"
@task
def deploy():
    build()
    proj()

    root_sha = sh.git("rev-parse", "HEAD")

    sh.cd("dist")

    sh.git.commit("-am", "'Automatic build from %s'" % root_sha)

    sh.git.push("origin", "gh-pages")

    proj()
    sh.git.add("dist")
    sh.git.status()


@task
def swatch():
    proj()

    print(". rocking the bootswatch plunder")
    
    themes = json.loads(str(sh.curl("http://api.bootswatch.com")))["themes"]
    for theme in themes:
        print(".. getting %s" % theme["name"])
        open(
            "lib/swatch/bootswatch.%s.min.css" % theme["name"], "w"
        ).write(
            re.sub(
                r'background.*glyphicons[^;]*;',
                "",
                str(sh.curl(theme["css-min"])))
        )


@task
def favicon():
    proj()
    print(". generating favicons...")
    sizes = [16, 32, 64, 128]

    tmp_file = lambda size: "/tmp/favicon-%s.png" % size

    for size in sizes:
        print("... %sx%s" % (size, size))
        sh.convert(
            "svg/logo.svg",
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
def copy_assets():
    proj()
    print(". copying assets ...")
    copy_patterns = {
        "dist/lib/blockly": ["lib/blockly/blockly.css"],
        "dist/lib/blockly/media":  sh.glob("lib/blockly/media/*") or [],
        "dist/font": sh.glob("lib/awesome/font/fontawesome-webfont.*") or [],
        "dist/lib/swatch": sh.glob("lib/swatch/*.css"),
        "dist/lib/cm/theme": sh.glob("lib/cm/theme/*.css"),
        "dist/css": [],
        "dist/js": [],
        "dist/blockml": sh.glob("blockml/*.xml") or [],
        "dist/svg": sh.glob("svg/*.svg") or [],
    }

    for dst, copy_files in copy_patterns.items():

        os.path.exists(dst) or sh.mkdir("-p", dst)
        for c_file in copy_files:
            print "... copying", c_file, dst
            sh.cp("-r", c_file, dst)
            
@task
def html():
    proj()
    print ". generating production html"
    sh.mkdir("-p", "dist/frame")
    
    blockd3_path = os.path.abspath(os.path.dirname(__file__))
    sys.path.append(blockd3_path)

    from app.app import make_app
    app = make_app("prod")
    
    prod_files = {
        "dist/index.html": "/dist/",
        "dist/frame/index.html": "/dist/frame/"
    }
    
    for prod_file, url in prod_files.items():
        print ".. writing ", prod_file
        open(prod_file, "w").write(
            app.test_client().get(url).data
        )

@task
def minify():
    proj()
    print(". minifying ...")

    sources = dict(js=[], css=[])
    
    for user in ["./frame", "."]:
        for min_id, asset_list in dict(js="scripts", css="styles").items(): 
            asset_list = os.path.join(user, asset_list+".txt")
            if os.path.exists(asset_list):
                [
                    sources[min_id].append(asset)
                    for asset
                    in [x.strip() for x in open(asset_list).read().split("\n")]
                    if asset
                        and not asset.startswith("#")
                        and asset not in sources[min_id]
                ]
    
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

def asset_links(asset_type):
    template = """
                <li><a href="#%(thing)s" data-blockd3-%(thing)s="%(file)s">
                    %(text)s
                </a></li>"""
    cfg = dict(
        THEMES=dict(
            path="lib/swatch/*.css",
            thing="theme",
            sub_data=lambda x: x.split(".")[1],
            sub_text=lambda x: x
        ),
        EXAMPLES=dict(
            path="blockml/*.xml",
            thing="example",
            sub_data=lambda x: os.path.basename(x)[0:-4],
            sub_text=lambda x: " ".join(x.split("_")).title()
        )
    )[asset_type]
    return "\n".join([
        template % {
            "file": cfg["sub_data"](path),
            "thing": cfg["thing"],
            "text": cfg["sub_text"](cfg["sub_data"](path))
        }
        for path in sh.glob(cfg["path"])
    ])
    
@task
def serve_dev():
    serve("dev")

@task
def serve_prod():
    serve("prod")
    
@task
def serve_test():
    serve("test")

    
def serve(env):
    blockd3_path = os.path.abspath(os.path.dirname(__file__))
    sys.path.append(blockd3_path)

    from app.app import make_app
    app = make_app(env)
    
    port = {
        "dev": 5000,
        "prod": 5001,
        "test": 5002
    }[env]
    
    app.run(port=port)