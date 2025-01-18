// Author: Austin C Arledge Sr (austin.c.arledge@gmail.com) 19 Jul 22

// ///////////////
//
// Free Text Class
//
// ///////////////


// The draggable item that allows an end user to type text and place it on the image.
class FreeText extends Item {
    constructor(x, y) {
        super();

        var self = this;
        
        this.scale = 4;                                                     // Size out of 10 on the slider bar
        this.opacity = 9;                                                   // Opacity * 10 = opacity %
        this.saveCategory = "markings";                                     // Define save object index
        this.type = "free-text";                                            // Define sub saveObj index
        this.degrees = 0;
        this.color = "custom-red";

        saveObj.allObjs.get(this.saveCategory).get(this.type).push(this);   // Add self to the saveObj.allObjs obj

        this.element.classList.add('absolute');
        this.element.classList.add('draggable');
        
        this.inputElement = document.createElement("div");
        this.inputElement.setAttribute("size", 4);
        this.inputElement.setAttribute("contenteditable", "True");
        this.inputElement.innerHTML = "Text";
        this.inputElement.style.fontFamily = "monospace";
        this.inputElement.classList.add("free-text");
        
        this.spinHolderElement = document.createElement('div');
        this.spinHolderElement.classList.add('flex');
        this.spinHolderElement.classList.add('justify-center');

        this.spinKnobObj = new SpinKnob();
        
        // Append the elements to the DOM and their respective parents
        this.spinHolderElement.append(this.spinKnobObj.element);
        this.element.append(this.spinHolderElement);
        this.element.append(this.inputElement);
        map.append(this.element);

        // Rotatble object and logic for this obj
        this.rotatable = Draggable.create(`#item-${this.uniqueID}`, {
            type: 'rotation',
            onPress: () => {
                self.setRotationCenter();
                self.inputElement.style.cursor = "grabbing";
            },
            onRelease: () => {
                self.rotatable.disable();
                self.draggable.enable();
                self.inputElement.style.cursor = "grab";
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

        // Draggable object and logic for this obj
        this.draggable = Draggable.create(`#item-${this.uniqueID}`, {
            bounds: '#map-green-padding',
            onPress: (event) => {
                if (!areObjsEnabled) return;
                if (isControlHeldDown) return;

                self.inputElement.style.cursor = "grabbing";

                if (event.target === self.spinKnobObj.element) {
                    self.draggable.disable();
                    self.rotatable.enable().startDrag(event);
                } else {
                    self.activate();
                    self.handleState();
                }
            },
            onRelease: () => {
                self.inputElement.style.cursor = "grab";
            },
            onDragStart: () => {
                if (isControlHeldDown) return;

                
                self.resetState();
                self.inputElement.style.cursor = "grabbing";
                self.handleState();
            }
        })[0];


        //
        // Methods
        //

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

            // Set the scale slider to the text scale range 5 - 8
            scaleHolderObj.setScaleRangeSmall();

            // Hide un-needed sub-holder sections
            snappingHolderObj.hideSnapSection();
            colorHolderObj.hideSlider();
        }

        // Get the div element that holds the draggable item for onClick() event.target's
        this.getMainDraggableElement = () => {
            return this.element;
        }

        // Returnts the element in which color, shading, and opacity is applied to
        this.getColorElement = () => {
            return this.inputElement;
        }

        // Returns the element that scaling should be applied to
        this.getScaleElement = () => {
            return this.inputElement;
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
                this.stateNum++;
            }

            // If 2, allow the user to type
            else if (this.stateNum == 2) {
                this.spinKnobObj.hideTool();
                this.inputElement.focus();
                this.selectText();
                this.draggable.disable();
                this.inputElement.style.cursor = "text";
                this.stateNum = 0;
            }
        }

        // Reset the state back to 0
        this.resetState = () => {
            this.spinKnobObj.hideTool();
            this.stateNum = 0;

            this.draggable.enable();
            this.inputElement.style.cursor = "grab";
            // this.inputElement.setAttribute("size", this.inputElement.value.length);
        }

        // Select the text content
        this.selectText = () => {
            let range = document.createRange();
            range.selectNodeContents(this.inputElement);

            let sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        }

        // Set the new color
        this.setColor = (color) => {
            this.color = color;
            this.inputElement.classList.remove("custom-black-text");
            this.inputElement.classList.remove("custom-blue-text");
            this.inputElement.classList.remove("custom-gray-text");
            this.inputElement.classList.remove("custom-green-text");
            this.inputElement.classList.remove("custom-orange-text");
            this.inputElement.classList.remove("custom-red-text");
            this.inputElement.classList.remove("custom-white-text");
            this.inputElement.classList.remove("custom-yellow-text");
            this.inputElement.classList.remove("custom-orange-text");

            this.inputElement.classList.add(color + "-text");
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
            this.getScaleElement().style.fontSize = `${scale * 3}px`;
        }

        // Set the current text value of the object
        this.setText = (text) => {
            this.inputElement.innerHTML = text;
        }


        //
        // Post Object Creation Commands
        //

        
        // Set the font size and color
        this.setScale(this.scale);
        this.setColor(this.color);

        // Set the rotation center point
        this.setRotationCenter();
        this.rotateObject();
        this.updateCenterOfObj();
        
        // Rotate the object to the current rotation degrees
        gsap.set(this.getMainDivElement(), {x: x, y: y});                    // Set the rotation value to the current degrees
    }

    //
    // Static Methods
    //


    // Creates a new free text object
    static createNewFreeText(event) {
        let obj = new FreeText(0, -185);
        obj.draggable.startDrag(event);
    }
}