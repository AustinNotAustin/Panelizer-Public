// Author: Austin C Arledge (austin.c.arledge@gmail.com) 1 Mar 22

// ///////////
//
// Meter Class
//
// ///////////


class Meter extends Item {
    constructor(x, y) {
        super();

        var self = this;
        
        this.scale = 8;                                                 // Size out of 10 on the slider bar (# * 12 = W, # * 6 = H)
        this.dir = 'right';                                             // Left or Right pointing arrow
        this.opacity = 9;                                               // Opacity * 10 = opacity %
        this.arrowColor = 'custom-red';                                 // Part of the URL string and denotes the color
        this.arrowReverse = '';                                         // Either '' or '-rev' to signify True or False respectively
        
        // This path must be prepended with "/panelizer/" if on KumuHub
        // If local, keep it "../"
        this.imgPath = "/panelizer/img/btns/straight-arrow-thick-";     // Base url path for each meter img
        this.saveCategory = "markings";                                 // Define save object index
        this.type = "meter";                                            // Define sub saveObj index

        saveObj.allObjs.get(this.saveCategory).get(this.type).push(this);   // Add self to the saveObj.allObjs obj

        this.element.classList.add('absolute');
        this.element.classList.add('draggable');

        this.arrowElement = document.createElement('img');
        this.arrowElement.src = this.imgPath + this.arrowReverse + this.arrowColor + '.png';
        this.arrowElement.classList.add('meter-obj');
        this.arrowElement.style.width = '96px';
        this.arrowElement.style.height = '48px';
        this.arrowElement.style.opacity = `${this.opacity * 10}%`;

        this.spinHolderElement = document.createElement('div');
        this.spinHolderElement.classList.add('flex');
        this.spinHolderElement.classList.add('justify-center');

        this.spinKnobObj = new SpinKnob();
        
        // Append the elements to the DOM and their respective parents
        this.spinHolderElement.append(this.spinKnobObj.element);
        this.element.append(this.spinHolderElement);
        this.element.append(this.arrowElement);
        map.append(this.element);

        // Rotatble object and logic for this obj
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
                self.checkRotation();

                return degrees;
            }
        })[0].disable();

        // Draggable object and logic for this obj
        this.draggable = Draggable.create(`#item-${this.uniqueID}`, {
            bounds: '#map-green-padding',
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
        // Methods
        //

        // Passes information to side tools and turns them on
        this.activateGUI = () => {
            // Hide all holders
            GUIHolder.hideTheseHolders(toolRelatedHolders);

            // Show all needed holders
            snappingHolderObj.showHolder();
            colorHolderObj.showHolder();
            scaleHolderObj.showHolder();

            // Activate all needed holders
            snappingHolderObj.activate(this);
            colorHolderObj.activate(this);
            scaleHolderObj.activate(this);

            // Hide un-needed sub-holder sections
            snappingHolderObj.hideSnapSection();
        }
        
        // Add degrees to self and set the new position
        this.addDegrees = (degrees) => {
            this.degrees += degrees;

            // Check 360 degree counds
            this.degrees = clamp360Degree(this.degrees);

            // Set new radians
            this.radians = this.degrees * (Math.PI / 180);

            // Set recent radians on global var
            lastPanelDegrees = this.degrees;
            lastPanelRadians = this.radians;

            // Apply changes to panel & display result
            snappingHolderObj.activate(this);

            gsap.set(this.getMainDivElement(), {rotation: this.degrees});               // Set the rotation value to the current degrees
            this.draggable.update();                                                    // Update the draggable object to apply the change
            this.checkRotation();                                                       // Checks the rotation angle and flips the text as needed
        }

        // Checker function to determine which direction the arrow should be pointing
        this.checkRotation = () => {
            // If the direction is pointing on the right half, aim right
            if ((this.degrees >= 270 && this.degrees < 360) || (this.degrees >= 0 && this.degrees < 90)) {
                if (this.dir = 'left') {
                    this.flipImage();
                }
            }
            else if (this.degrees >= 90 && this.degrees < 270) {
                if (this.dir = 'right') {
                    this.flipImage();
                }
            }
        }

        // Flip the background Image 
        this.flipImage = () => {
            if (this.dir == 'right') {
                this.dir = 'left';
                this.arrowReverse = 'rev-';
                this.arrowElement.src = this.imgPath + this.arrowReverse + this.arrowColor + '.png';
            } else {
                this.dir = 'right';
                this.arrowReverse = '';
                this.arrowElement.src = this.imgPath + this.arrowReverse + this.arrowColor + '.png';
            }
        }

        // Get the div element that holds the draggable item for onClick() event.target's
        this.getMainDraggableElement = () => {
            return this.element;
        }

        // Returnts the element in which color, shading, and opacity is applied to
        this.getColorElement = () => {
            return this.arrowElement;
        }

        // Returns the element that scaling should be applied to
        this.getScaleElement = () => {
            return this.arrowElement;
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

        // Reset the state back to 0
        this.resetState = () => {
            this.spinKnobObj.hideTool();
            this.stateNum = 0;
        }

        // This function sets the rotation of an object/panel and its tools
        this.rotateObject = () => { 
            gsap.set(this.getMainDivElement(), {rotation: this.degrees});         // Set the rotation value to the current degrees
            snappingHolderObj.activate(this);
            this.checkRotation();
        }

        // Set the new color
        this.setColor = (color) => {
            this.arrowColor = color;
            this.arrowElement.src = this.imgPath + this.arrowReverse + this.arrowColor + '.png';
        }

        // Set the degrees and new position of the object
        this.setDegrees = (degrees) => {
            this.degrees = degrees;

            // Check 360 degree counds
            this.degrees = clamp360Degree(this.degrees);

            // Set new radians
            this.radians = this.degrees * (Math.PI / 180);

            // Set recent radians on global var
            lastPanelDegrees = this.degrees;
            lastPanelRadians = this.radians;

            // Apply changes to panel & display result
            snappingHolderObj.activate(this);

            gsap.set(this.getMainDivElement(), {rotation: this.degrees});             // Set the rotation value to the current degrees
            this.draggable.update();                                                  // Update the draggable object to apply the change
            this.checkRotation();
        }

        // Set the origin point for rotations
        this.setRotationCenter = () => {
            let total = 30 + this.scale * 6;                                // Spin Height: 25 + Padding: 5 + Self Height
            let halfSelf = (this.scale * 6) / 2;                            // Half of self's height (where the center point should be)
            let diff = total - halfSelf;                                    // The total amount of space above the center point
            let ratio = (diff / total) * 100;

            gsap.set(this.element, {transformOrigin: `50% ${ratio}%`});
        }

        // Set the scale / size of the respective element
        this.setScale = (scale) => {
            this.scale = scale;

            this.getScaleElement().style.height = `${scale * 6}px`;
            this.getScaleElement().style.width = `${scale * 12}px`;
        }


        //
        // Post Object Create Commands
        //

        
        // Rotate object to match degrees
        this.setRotationCenter();
        this.rotateObject();

        // Set the center point of the object for rotation
        gsap.set(this.getMainDivElement(), {x: x, y: y});                    // Set the rotation value to the current degrees
    }

    //
    // Static Methods
    //


    // Creates a new meter obstacle
    static createNewMeter(event) {
        let meter = new Meter(0, -300);
        meter.draggable.startDrag(event);
    }
}
