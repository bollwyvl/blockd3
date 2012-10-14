# -*- coding: utf-8 -*-
from os.path import join as opj

from flask import (
    Flask,
    )
from flask import (
    render_template,
    )

app = Flask(__name__,
    static_folder=opj("..", "dist"),
    template_folder=opj("..", "dist"))
app.config['CSRF_ENABLED'] = False
app.config['SECRET_KEY'] = "totally-insecure"
app.config['DEBUG'] = True


@app.route("/dist/")
def home():
    return render_template("index.html")


@app.route("/dist/frame.html")
def frame():
    return render_template("frame.html")

if __name__ == "__main__":
    app.run()