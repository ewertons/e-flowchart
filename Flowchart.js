function Terminal(id, text) {
    this.id = id;
    this.text = text;
}

function Process(id, text) {
    this.id = id;
    this.text = text;
}

function PreDefinedProcess(id, text) {
    this.id = id;
    this.text = text;
}
function Connector(id, from, to, text) {
    this.id = id;
    this.from = from;
    this.to = to;
    this.text = text;
}

function Flowchart() {
    this.components;
    this.onProcessingError;
    
    function reportProcessingError(errorMessage) {
        if (this.onProcessingError != null) {
            this.onProcessingError(errorMessage);
        }                    
    }
    
    function parseComponent(typeDescription) {
        var tokens = typeDescription.split(":", 2);
        
        var component = null;
        
        if (tokens.length != 2) {
            reportProcessingError("'" + typeDescription + "' is not a valid flowchart component description (not enough parameters).");                        
        } else {
            var typeAndId = tokens[0].match("^(t|io|pp|p|prep|onpc|offpc|c)([0-9]+)")
            if (typeAndId.length != 3) {
                reportProcessingError("'" + tokens[0] +  "' in '" + typeDescription + "' is not a valid flowchart component description (expected type and id).");
            } else if (typeAndId[1] == "t") {
                component = new Terminal(typeAndId[2], tokens[1]);
            } else if (typeAndId[1] == "io") {
                
            } else if (typeAndId[1] == "pp") {
                component = new PreDefinedProcess(typeAndId[2], tokens[1]);
            } else if (typeAndId[1] == "p") {
                component = new Process(typeAndId[2], tokens[1]);                            
            } else if (typeAndId[1] == "prep") {
                
            } else if (typeAndId[1] == "onpc") {
                
            } else if (typeAndId[1] == "offpc") {
                
            } else if (typeAndId[1] == "c") {
                tokens = typeDescription.split(":", 4);
                
                if (tokens.length != 4) {
                    reportProcessingError("'" + typeAndId[1] +  "' in '" + typeDescription + "' is not a valid flowchart component description (incomplete description).");
                } else {
                    component = new Connector(typeAndId[2], tokens[1], tokens[2], tokens[3]);
                }
            } else {
                reportProcessingError("'" + typeAndId[1] +  "' in '" + typeDescription + "' is not a valid flowchart component description (unexpected type).");
            }
        }
        
        return component;
    }
    
    this.parse = function(description) {
        var components = [];

        if (description == null) {
            reportProcessingError("The flowchart description is empty.");                        
        } else if(typeof description != "string") {
            reportProcessingError("The flowchart description must be a string.");
        } else {
            var lines = description.split("\n");

            for (var i = 0; i < lines.length; i++) {
                var component = parseComponent(lines[i]);
                
                if (component != null) {
                    components.push(component);
                } else {
                    components = null;
                    break;
                }
            }
        }
        
        var isFlowchartUpdated = false;
            
        if (components != null && components.length > 0) {
            this.components = components;
            isFlowchartUpdated = true;
        }
        
        return isFlowchartUpdated;
    }
}