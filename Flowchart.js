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

function PlottingOptions() {
    
}

function Flowchart() {
    this.components;
    this.onProcessingError;
    
    function reportProcessingError(errorMessage) {
        if (this.onProcessingError != null) {
            this.onProcessingError(errorMessage);
        }                    
    }
    
    function getComponentSymbol(component) {
        var symbol = null;
        
        var typeOfComponent  = component.constructor.name;
        
        if (typeOfComponent == "Terminal") {
            symbol = "t";
        } else if (typeOfComponent == "PreDefinedProcess") {
            symbol = "pp";
        } else if (typeOfComponent == "Process") {
            symbol = "p";
        } else if (typeOfComponent == "Connector") {
            symbol = "c";
        }
        
        return symbol;        
    }
    
    function findComponent(symbolAndId, components) {
        var component = null;
        
        if (components != null) {
            for (var i = 0; i < components.length; i++) {
                if (getComponentSymbol(components[i]) + components[i].id == symbolAndId) {
                    component = components[i];
                    break;
                }
            }            
        }
        
        return component;
    }
    
    function parseComponent(typeDescription, existingComponents) {
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
                    var fromComponent = findComponent(tokens[1], existingComponents);
                    var toComponent = findComponent(tokens[2], existingComponents);
                    
                    if (fromComponent == null) {
                        reportProcessingError("'" + tokens[1] +  "' in '" + typeDescription + "' is not a valid flowchart component description (connector 'from' element not found).");
                    } else if (toComponent == null) {
                        reportProcessingError("'" + tokens[2] +  "' in '" + typeDescription + "' is not a valid flowchart component description (connector 'to' element not found).");
                    } else {
                        component = new Connector(typeAndId[2], fromComponent, toComponent, tokens[3]);                    
                    } 
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
                var component = parseComponent(lines[i], components);
                
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
    
    this.plot = function() {
        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext('2d');

        for(var i = 0; i < this.components.length; i++) {
            ctx.fillRect(5, 5 + 50 * i, 50 + 10 * i, 20);            
        }

        return canvas;
    }
}