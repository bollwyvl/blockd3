# -*- coding: utf-8 -*-
import os
from os.path import join as opj
from os.path import abspath as opa

import sh

from flask import (
    Flask,
    )
from flask import (
    render_template,
    )

def make_app(env="dev"):
    
    DEBUG = True #= env == "dev"
    
    url_root = {
        "dev": "/",
        "prod": "/dist/",
        "test": "/dist/"
    }[env]
    
    app_home = os.path.dirname(__file__)
    
    cfg = {
        "dev": dict(
            static_url_path="",
            template_folder="..",
            static_folder=opa(opj(app_home, ".."))
            ),
        "prod": dict(
            static_url_path="/dist",
            template_folder="..",
            static_folder=opa(opj(app_home, "..", "dist"))
            ),
        "test": dict(
            static_url_path="/dist",
            template_folder="../dist",
            static_folder=opa(opj(app_home, "..", "dist"))
            )
    }[env]
    
    app = Flask(__name__, **cfg)
    app.config['CSRF_ENABLED'] = DEBUG
    app.config['SECRET_KEY'] = "totally-insecure"
    app.config['DEBUG'] = DEBUG

    @app.route(url_root)
    def home():
        
        kwargs = {}
        if env != "test":
            kwargs.update(assets())
        
        return render_template("index.html", env=env, **kwargs)

    @app.route(url_root + "frame/")
    def frame():
        kwargs = {}
        if env != "test":
            kwargs.update(assets("../frame/"))
            
        return render_template("frame/index.html", env=env, **kwargs)
        
    return app

def assets(for_file="../"):
    result = dict(scripts=[], styles=[])
    for a_type in result.keys():
        a_list = opj(
            os.path.dirname(__file__),
            for_file,
            a_type + ".txt")
        if os.path.exists(a_list):
            result[a_type] = [
                asset.strip()
                for asset
                in open(a_list).read().split("\n")
                if asset.strip() and not asset.strip().startswith("#")
            ]

    if for_file == "../":
        result.update(runtime_assets())
    
    return result
    
def runtime_assets():
        rt_cfg = dict(
            themes=dict(
                path="lib/swatch/*.css",
                thing="theme",
                sub_data=lambda x: x.split(".")[1],
                sub_text=lambda x: x
            ),
            examples=dict(
                path="blockml/*.xml",
                thing="example",
                sub_data=lambda x: os.path.basename(x)[0:-4],
                sub_text=lambda x: " ".join(x.split("_")).title()
            )
        )
        
        result = {}
        
        for thing, cfg in rt_cfg.items():
            result[thing] = sorted([
                (cfg["sub_text"](cfg["sub_data"](path)), cfg["sub_data"](path))
                for path in sh.glob(cfg["path"])
            ], key=lambda x: x[0].upper())
        return result

if __name__ == "__main__":
    app = make_app()
    app.run()