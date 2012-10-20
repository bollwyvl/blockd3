# -*- coding: utf-8 -*-
import os
from os.path import join as opj
from os.path import abspath as opa

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
        "prod": "/dist/"
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
            )
    }[env]
    
    app = Flask(__name__, **cfg)
    app.config['CSRF_ENABLED'] = DEBUG
    app.config['SECRET_KEY'] = "totally-insecure"
    app.config['DEBUG'] = DEBUG

    @app.route(url_root)
    def home():
        return render_template("index.html",
            env=env,
            **assets())

    @app.route(url_root + "frame/")
    def frame():
        return render_template("frame/index.html",
            env=env,
            **assets("../frame"))
        
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
    return result

if __name__ == "__main__":
    app = make_app()
    app.run()