(function(Blockly){
    Blockly.inject(document.body, {
        path: 'http://blockly-demo.appspot.com/blockly/'
    });

    if (window.parent.init) {
        // Let the top-level application know that Blockly is ready.
        window.parent.init(Blockly);
    } else {
        // Attempt to diagnose the problem.
        var msg = 'Error: Unable to communicate between frames.\n\n';
        if (window.parent == window) {
            msg += 'Try loading index.html instead of frame.html';
        } else if (window.location.protocol == 'file:') {
            msg += 'This may be due to a security restriction preventing\n' +
                    'access when using the file:// protocol.\n' +
                    'http://code.google.com/p/chromium/issues/detail?id=47416';
        }
        alert(msg);s
    }
})(Blockly);