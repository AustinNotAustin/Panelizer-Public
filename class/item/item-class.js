// Author: Austin C Arledge Sr (austin.c.arledge@gmail.com) 19 Jul 22

// //////////
//
// Item Class 
//
// //////////     


class Item {
    constructor() {
        this.degrees = lastPanelDegrees;
        this.objType;
        this.opacity = 6;
        this.saveCategory = null;                                   // Used to index saveObj map
        this.scale = 3;
        this.stateNum = 0;
        this.type = null;                                           // Used to index the save obj
        this.uniqueID = Item.uniqueID++;
        
        this.element = document.createElement("div");
        this.element.id = `item-${this.uniqueID}`;


        //
        // Methods
        //
        
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

            gsap.set(this.getMainDivElement(), {rotation: this.degrees});             // Set the rotation value to the current degrees
            this.draggable.update();                                                  // Update the draggable object to apply the change
        }

        this.addSelfToActiveArray = () => {
            activeItemsObj.addItem(this);
        }

        this.activate = () => {
            this.glowOn();
            this.addSelfToActiveArray();
            this.activateGUI();
        }

        this.activateGUI = () => {
            return;
        }

        // Clear the current state and prepare it for an initial click
        this.clearState = () => {
            this.resetState();
            this.glowOff();
        }
        
        this.deactivate = () => {
            this.glowOff();
            this.resetState();
            this.deactivateGUI();
        }

        this.deactivateGUI = () => {
            GUIHolder.turnOffTheseHolders(toolRelatedHolders);
        }

        // Delete self properly
        this.deleteSelf = () => {
            let map = saveObj.allObjs.get(`${this.saveCategory}`).get(`${this.type}`);
            let index = map.indexOf(this);
            map.splice(index, 1);

            activeItemsObj.removeItem(this);
        
            this.getMainDivElement().remove();
        }

        this.getMainDivElement = () => {
            return this.element;
        }

        this.getMainDraggableElement = () => {
            return this.element;
        }

        this.getColorElement = () => {
            return this.element;
        }

        // Returns the element that scaling should be applied to
        this.getScaleElement = () => {
            return this.element;
        }

        this.glowOn = () => {
            this.getMainDivElement().classList.add('breathe-shadow-animation');
        }

        this.glowOff = () => {
            this.getMainDivElement().classList.remove('breathe-shadow-animation');
        }

        this.moveObjTo = (xChange, yChange) => {
            let x = gsap.getProperty(this.getMainDivElement(), 'x');
            let y = gsap.getProperty(this.getMainDivElement(), 'y');
        
            x += xChange;
            y += yChange;
        
            gsap.set(this.getMainDivElement(), {x: x, y: y});                    // Set the rotation value to the current degrees
            this.draggable.update();                                             // Update the draggable object to apply the change
        }

        this.removeSelfFromActiveArr = () => {
            let index = activeItemsObj.items.indexOf(this);
            activeItemsObj.items.splice(index, 1);
        }

        this.resetState = () => {
            this.stateNum = 0;
        }

        // Helper function with changing color
        this.removeAllColorOptions = () => {
            this.getColorElement().classList.remove('custom-red');
            this.getColorElement().classList.remove('custom-white');
            this.getColorElement().classList.remove('custom-green');
            this.getColorElement().classList.remove('custom-black');
            this.getColorElement().classList.remove('custom-purple');
            this.getColorElement().classList.remove('custom-yellow');
            this.getColorElement().classList.remove('custom-orange');
            this.getColorElement().classList.remove('breathe-animation');
        }

        // This function sets the rotation of an object/panel and its tools
        this.rotateObject = () => { 
            gsap.set(this.getMainDivElement(), {rotation: this.degrees});         // Set the rotation value to the current degrees
            snappingHolderObj.activate(this);
        }

        // Changes the color of the approriate element
        this.setColor = (newClass) => {
            this.removeAllColorOptions();
            this.getColorElement().classList.add(newClass);
            this.color = newClass;
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
        }
        
        this.setID = (uniqueID) => {
            this.uniqueID = uniqueID;
        }
        
        // Sets the opacity of the target element
        this.setOpacity = (opacity) => {
            this.opacity = opacity;
            this.getMainDivElement().style.opacity = `${opacity * 10}%`;
        }
        
        // Sets the size/scale of the target element (Height and Width)
        this.setScale = (scale) => {
            this.scale = scale;
            this.getScaleElement().style.height = `${scale * 5}px`;
            this.getScaleElement().style.width = `${scale * 5}px`;
        }

        // Sets the shading on the panel or object accordingly
        this.setShading = (shading) => {
            // Show the number as a fixed string
            this.getColorElement().style.filter = `brightness(${100 - shading.toFixed(1)}%)`;
            shadingHolderObj.activate(this);

            // Then save the number as a float
            this.shading = parseFloat(shading);
        }

        // Set's the new x, y point of this obj to the center
        this.updateCenterOfObj = () => {
            gsap.set(`#item-${this.uniqueID}`, {
                xPercent: -50,
                yPercent: -50
            });
        }

        
        //
        // Post Object Creation Methods
        //

        // Set the proper z index for items
        this.getMainDivElement().style.zIndex = "1100";
    }

    static uniqueID = 0;
}

