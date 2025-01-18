// Author: Austin C Arledge (austin.c.arledge@gmail.com) 5 Nov 21

// /////////
//
// Pen Class
//
// /////////


var pointCount = 0;

// A single canvas for the use to draw lines on by tapping the canvas.
class Pen extends Item {
    constructor() {
        super();
        
        this.isDrawing = false;
        this.scale = 3;
        this.opacity = 9;
        this.type = "pen";
        this.saveCategory = "markings";
        this.color = "custom-black";
        this.rgbColor = "rgb(35, 35, 35)";

        this.steps = [];

        this.element = document.createElement("canvas");
        this.element.height = 600;
        this.element.width = 600;
        this.element.style.zIndex = "900";                         // Place the canvas above the map but below the panels & other items

        this.element.classList.add("absolute");
        this.element.classList.add("top-0");
        this.element.classList.add("flex");

        // Append the canvas to the map
        map.append(this.element);

        this.ctx = this.element.getContext("2d");
        this.ctx.lineWidth = this.scale;
        this.ctx.beginPath();
        

        //
        // Methods
        //
        
        // Enable the object and move the canvas above all other objects
        this.activate = () => {
            this.glowOn();
            this.addSelfToActiveArray();
            this.activateGUI();
        }

        // Turns on and displays relavent information for specified holders
        this.activateGUI = () => {
            // Hide all holders
            GUIHolder.hideTheseHolders(toolRelatedHolders);

            // Show all needed holders
            colorHolderObj.showHolder();
            scaleHolderObj.showHolder();
            
            // Activate all needed holders
            colorHolderObj.activate(this);
            scaleHolderObj.activate(this);
        }
        
        // Add another point in the shape
        this.addPoint = (x, y) => {
            this.ctx.lineTo(x, y);
            this.ctx.stroke();
            this.steps.push({action: "add", x: x, y: y});
        }

        // Deactive object and move canvas back to normal position
        this.deactivate = () => {
            this.glowOff();
            this.resetState();
            this.deactivateGUI();
            this.element.style.zIndex = "900";                         // Place the canvas above the map but below the panels & other items
        }

        // Delete self properly (Actually just clears the canvas)
        this.deleteSelf = () => {
            this.ctx.clearRect(0, 0, this.element.width, this.element.height);
            pointCount = 0;
            this.step = [];

            this.ctx.beginPath();
        }

        // Generate self from step instructions
        this.generateSelf = (steps) => {
            steps.forEach(step => {
                if (step.action == "move") this.ctx.moveTo(step.x, step.y);
                if (step.action == "add") this.ctx.lineTo(step.x, step.y);
            });

            this.ctx.lineWidth = this.scale;
            this.ctx.strokeStyle = this.color;
            this.ctx.stroke();
        }

        // Set the color of the stroke
        this.setColor = (color) => {
            let targetClass = document.querySelector(`.${color}`);
            let style = getComputedStyle(targetClass);
            let rgbColor = style.backgroundColor;

            this.color = color;
            this.rgbColor = rgbColor;

            // Set the scale essentially redraws the whole line with the proper color. I'm being lazy.
            this.setScale(this.scale);
        }

        // Sets the opacity of the target element
        this.setOpacity = (opacity) => {
            this.opacity = opacity;
            this.element.style.opacity = `${opacity * 10}%`;
        }
        
        // Sets the size/scale of the target element (Height and Width)
        this.setScale = (scale) => {
            // Clear the canvas first
            this.ctx.clearRect(0, 0, this.element.width, this.element.height);

            // Then re-stroke the area
            this.scale = scale;
            this.ctx.lineWidth = this.scale;
            this.ctx.strokeStyle = this.rgbColor;
            this.ctx.stroke();
        }
        
        // Start off the first point to begin drawing
        this.startPath = (startX, startY) => {
            this.ctx.moveTo(startX, startY);
            this.ctx.arc(startX, startY, 2, 0, 2 * Math.PI);
            this.ctx.lineWidth = this.scale;
            this.ctx.strokeStyle = this.color;
            this.ctx.stroke();

            this.steps.push({action: "move", x: startX, y: startY});             // Store step for saveFile
        }


        //
        // Object Listeners
        //

        // Listen for clicks & taps to activate self
        this.element.addEventListener("mousedown", () => {
            this.activate();
        });
        
        this.element.addEventListener("touchstart", () => {
            this.activate();
        });
        
        // Listen for clicks & taps off of self to deactivate
        document.getElementById("map-green-padding").addEventListener("mousedown", (event) => {
            if (event.target == this.element) return;

            this.deactivate();
        });

        //
        // Post object creation actions
        //

        // Add self to saveObj.allObjs
        saveObj.allObjs.get("markings").get("pen").push(this);
    }

    static cancelPenTool() {
        penObj.isDrawing = false;
        map.style.cursor = "auto";
        document.body.removeEventListener("click", Pen.handlePenClick);
        activeItemsObj.clearActiveItems();
        pointCount = 0;
        penObj.deactivate();
        $("#pen-status-text").text("Off");                               // Set the display text to On while adding pen points
    }

    static createNewPenObj(x, y) {
        let obj = new Pen(x, y);

        return obj;
    }

    static handlePenClick(event) {
        // If event target is map place point
        let isOnMap = Draggable.hitTest("#map", event);

        let xOffset = mapPadding.offsetLeft + map.offsetLeft;
        let yOffset = mapPadding.offsetTop + map.offsetTop;

        if (isOnMap) {                                                                  // If the mouse is on the map, make a point
            // If this is the first click, make a new object
            if (pointCount == 0) {
                // Get x and y values from event to place object
                
                let obj = penObj;                                                       // Currently just draws on the same obj
                obj.startPath(event.clientX - xOffset, event.clientY - yOffset);
                pointCount++;
                
                activeItemsObj.addItem(obj);
            } else {
                activeItemsObj.items[0].addPoint(event.clientX - xOffset, event.clientY - yOffset);
                pointCount++;
            }
        }
        else if (event.target == document.getElementById("line-marking-btn")) {         // If the mouse initially clicked on the btn, ignore
            return;
        } 
        else if (event.target == document.getElementById("pen-status-text")) {
            return;
        } else {                                                                        // Otherwise, cancel
            Pen.cancelPenTool();
        }
    }

    static preparePenTool() {
        penObj.isDrawing = true;
        document.getElementById("pen-status-text").textContent = "On";                               // Set the display text to On while adding pen points
        map.style.cursor = "crosshair";
        document.body.addEventListener("click", Pen.handlePenClick);
        penObj.element.style.zIndex = "1200";                           // Place the canvas above everything
    }
}

const penObj = new Pen();
