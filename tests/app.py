# -*- coding: utf-8 -*-
import os

from flask import (
    Flask,
    render_template_string,
    url_for,
    redirect,
    jsonify,
    )
from flask import (
    request,
    abort,
    Response,
    flash,
    make_response,
    )

from werkzeug import Headers

app = Flask(__name__, static_folder="../dist")
app.config['CSRF_ENABLED'] = False
app.config['SECRET_KEY'] = "totally-insecure"
app.config['DEBUG'] = True


@app.route("/dist/")
def home():
    return fix_static("index.html")


@app.route("/dist/frame.html")
def frame():
    return fix_static("frame.html")


def fix_static(file_name):
    new_source =  open(os.path.join("../dist/", file_name)).read()
    return make_response(new_source)

if __name__ == "__main__":
    app.run()