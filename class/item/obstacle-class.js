// Author: Austin C Arledge (austin.c.arledge@gmail.com) 29 Oct 21

// //////////////
//
// Obstacle Class
//
// //////////////


class Obstacle extends Item {
    constructor(type, x, y) {
        super();
        var self = this;

        this.degrees = lastPanelDegrees;                                        // Current Rotation Angle
        this.opacity = 7;                                                       // The number (* 10) of the opacity percentage that this object has
        this.scale = 6;                                                         // The current size state of the obstacle
        this.objType = "obstacle";
        this.color = 'custom-red';                                              // Background color of the panel
        
        this.saveCategory = "obstacles";                                        // Define save object index
        this.type = type;                                                       // Define sub saveObj index (circle or square)
        
        saveObj.allObjs.get(this.saveCategory).get(`${this.type}`).push(this);  // Add self to all obstacles list
        
        // Set up the main holder element
        this.element.classList.add('absolute');
        this.element.classList.add('draggable');
        
        // Set up the actual div to hold the shape of the obstacle
        this.obstacleElement = document.createElement('div');

        this.obstacleElement.classList.add('custom-red');
        this.obstacleElement.classList.add('obstacle');

        this.obstacleElement.style.height = `${this.scale * 5}px`;
        this.obstacleElement.style.width = `${this.scale * 5}px`;
        
        // Set up the spinning knob
        this.spinKnobElement = document.createElement('div');
        this.spinKnobElement.classList.add('justify-center');
        this.spinKnobElement.classList.add('flex');
        this.spinKnobElement.classList.add('p-0');

        this.spinKnobObj = new SpinKnob();


        // Instead of making two classes, one square and another circle, I opted for this easier if else if logic.
        if (this.type == "circle") {
            this.obstacleElement.classList.add('rounded-full');
        }
        else if (this.type == "square") {                                           // If square, add the spinning knob (circles don't need to spin)
            this.obstacleElement.classList.add('rounded');
            this.spinKnobElement.append(this.spinKnobObj.element);                  // Append spin knob object to spin holder element
            this.element.append(this.spinKnobElement);                              // Append the spin knob holder element to the holder
        }
        
        // Append everything
        this.element.append(this.obstacleElement);                              // Append the obstacle shape to the holder
        map.append(this.element);                                               // Append holder to map


        // Rotatable object for rotation
        this.rotatable = Draggable.create(`#item-${this.uniqueID}`, {
            type: 'rotation',
            onPress: () => {
                self.setRotationCenter();
            },
            onRelease: () => {
                self.rotatable.disable();
                self.draggable.enable();
            },
            liveSnap: true,
            snap: (endValue) => {
                let degrees = clamp360Degree(endValue);
                let radians = degreeToRadian(degrees);
                lastPanelDegrees = degrees;
                lastPanelRadians = radians;
                self.degrees = degrees;
                self.radians = radians;

                self.activate();

                return degrees;
            }
        })[0].disable();


        // Draggable object for movement
        this.draggable = new Draggable.create(`#item-${this.uniqueID}`, {
            bounds: "#map-green-padding",
            onPress: (event) => {
                if (!areObjsEnabled) return;
                if (isControlHeldDown) return;

                if (event.target === self.spinKnobObj.element) {
                    self.draggable.disable();
                    self.rotatable.enable().startDrag(event);
                } else {
                    self.activate();
                    self.handleState();
                }
            },
            onDragStart: () => {
                if (isControlHeldDown) return;

                self.resetState();
                self.handleState();
            }
        })[0];

        this.updateCenterOfObj();                                       // Call right away to set the position


        //
        // Class Methods
        //

        // Hide all holders, turn on select holders, then populate the related holders
        this.activateGUI = () => {
            // Turn off all holders to cover all bases
            GUIHolder.hideTheseHolders(toolRelatedHolders);

            // Show all relevant holders
            snappingHolderObj.showHolder();
            colorHolderObj.showHolder();
            scaleHolderObj.showHolder();

            // Activate all relevant
            snappingHolderObj.activate(this);
            colorHolderObj.activate(this);
            scaleHolderObj.activate(this);
            
            if (this.type == "circle") {                                 // If self is a circle, hide additional elements
                snappingHolderObj.hideRotationButtons();
            }

            snappingHolderObj.hideSnapSection();
        }

        // Returns the element that displays color
        this.getColorElement = () => {
            return this.obstacleElement;
        }
        
        // Returns the element that scaling should be applied to
        this.getScaleElement = () => {
            return this.obstacleElement;
        }
        
        // Handle what happens on successive clicks
        this.handleState = () => {
            this.glowOn();

            // If 0, hide everything & ++
            if (this.stateNum == 0) {
                this.spinKnobObj.hideTool();
                this.stateNum++;
            }
            
            // If 1, show the spin knob and reset num
            else if (this.stateNum == 1) {
                this.spinKnobObj.showTool();
                this.stateNum = 0;
            }
        }
        
        // Reset the state back to 0 & hide spin tool
        this.resetState = () => {
            this.spinKnobObj.hideTool();
            this.stateNum = 0;
        }

        // Set the origin point for rotations
        this.setRotationCenter = () => {
            let total = 30 + this.scale * 5;                                // Spin Height: 25 + Padding: 5 + Self Height
            let halfSelf = (this.scale * 5) / 2;                            // Half of self's height (where the center point should be)
            let diff = total - halfSelf;                                    // The total amount of space above the center point
            let ratio = (diff / total) * 100;

            gsap.set(this.element, {transformOrigin: `50% ${ratio}%`});
        }

        // Set the opacity of the relavent element
        this.setOpacity = (opacity) => {
            this.opacity = opacity;
            this.obstacleElement.style.opacity = `${opacity * 10}%`;
        }


        //
        // Post Object Create Commands
        //

        // Set the physical location of the element
        this.moveObjTo(x, y);

        // If the object is a square, handle the turning and center point.
        if (this.type == "square") {
            // Set the center rotation point
            this.setRotationCenter();
            
            // Rotate the object to match the last degrees used
            this.rotateObject();
        }
    }


    //
    // Static Methods
    //

    static createNewObstacle = (type, event) => {
        let obstacle = new Obstacle(type, 0, -425);
        obstacle.draggable.startDrag(event);
    }

    static disableAllObstacles() {
        saveObj.allObjs.get("obstacles").get("circle").forEach(obstacle => {
            obstacle.draggable.disable();
        });

        saveObj.allObjs.get("obstacles").get("square").forEach(obstacle => {
            obstacle.draggable.disable();
        });
    }

    static enableAllObstacles() {
        saveObj.allObjs.get("obstacles").get("circle").forEach(obstacle => {
            obstacle.draggable.enable();
        });

        saveObj.allObjs.get("obstacles").get("square").forEach(obstacle => {
            obstacle.draggable.enable();
        });
    }
}