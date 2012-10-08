$(function(){
    var blockd3 = window.blockd3 = function(){};
    window.Blockly = blockly;
    
    var editors = blockd3.editors = {
        javascript: undefined,
        xml: undefined
    };
    
    var tabs = blockd3.tabs = $("#tabs li")
        .on("click", function(evt){
            var prev = $("#tabs li.active a").attr("href"),
                tab = $(this),
                href = tab.find("a").attr('href');
                switch(prev){
                    case "#javascript":
                    case "#blockly":
                        
                    case "#xml":
                        exit_xml(); break;
                    default:
                        
                }
                
            tabs.removeClass("active");
            tab.addClass("active");
            render_content();
        });
        
    var mode = blockd3.mode =function(){
        return $("#tabs li.active a").attr("href").slice(1);
    }
    
    var exit_xml = blockd3.exit_xml = function(){
        var xmlText = editors.xml.getValue(),
            xmlDom = null;
        try {
            xmlDom = Blockly.Xml.textToDom(xmlText);
        } catch (e) {
            var conf = window.confirm('Error parsing XML:\n' + e + '\n\nAbandon changes?');
            if (!conf) {
                // Leave the user on the XML tab.
                return;
            }
        }
        if (xmlDom) {
            Blockly.mainWorkspace.clear();
            Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, xmlDom);
        }
    };
    
    var render_content = blockd3.render_content = function(){
        var current_mode = mode(),
            content = $("#content_" + current_mode);
        
        // Initialize the pane.
        if (current_mode == 'blockly') {
            // If the workspace was changed by the XML tab, Firefox will have performed
            // an incomplete rendering due to Blockly being invisible.  Rerender.
            Blockly.mainWorkspace.render();
        } else if (current_mode == 'xml') {
            var xmlDom = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace),
                xmlText = Blockly.Xml.domToPrettyText(xmlDom);
                editors.xml.setValue(xmlText);
        } else if (current_mode == 'javascript') {
            editors.javascript.setValue(
                Blockly.Generator.workspaceToCode('JavaScript')
            );
        }
    };
    

    var initialize_editors = blockd3.initialize_editors = function(){
        _.map(editors, function(editor, language){
            if(!_.isUndefined(editor)){
               return;
            }
            editor = editors[language] = CodeMirror.fromTextArea(
                $("#textarea_"+language)[0],
                {
                    lineNumbers: true,
                    matchBrackets: true,
                    mode: language,
                    lineWrapping: true,
                    readOnly: true,
                    theme: "elegant"
                });
                
            editor.setSize("100%", "100%");
        });
    };
    
    initialize_editors();
});