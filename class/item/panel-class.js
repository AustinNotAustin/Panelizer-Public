// Author: Austin C Arledge Sr (austin.c.arledge@gmail.com) 21 Jul 22

// ///////////////////////////////
//
// Solar / Water / Existing Panels
//
// ///////////////////////////////


class Panel extends Item {
    constructor(height, width, panelNum, parentArray) {
        super();
        var self = this;

        // Track the parent array upon creation
        this.parentArray = parentArray;

        this.objType = 'panel';
        this.width = width;
        this.height = height;
        this.panelNum = panelNum;
        this.shading = 0;                                               // How much shadow/shading is on a panel
        this.color = '#ffffff';                                         // Background color of the panel

        // Create the individual panel elements
        this.panelElement = document.createElement('div');
        this.textElement = document.createElement('p');
        
        // Set the panel ID and class
        this.panelElement.id = `panel-${panelNum}`;
        this.panelElement.className = 'panel order-5';
        this.textElement.className = 'panel-text';
        
        // Set the panel dimensions
        this.panelElement.style.height = `${this.height}px`;
        this.panelElement.style.width = `${this.width}px`;
        
        // Show the panel number
        this.panelText = document.createTextNode(`${panelNum}`);

        // Add the sub elements to the parent element
        this.textElement.appendChild(this.panelText);
        this.panelElement.appendChild(this.textElement);

        //
        // Methods
        //

        // Removed this for now to see if it was even used. Doesn't seem to be the case.
        // Turn the GUI on and display the appropriate information
        // this.activateGUI = () => {
        //     console.log("ran")
        //     // Hide everything
        //     GUIHolder.hideTheseHolders(toolRelatedHolders);

        //     // Show relevant items
        //     shadingHolderObj.showHolder();
        //     colorHolderObj.showHolder();
            
        //     shadingHolderObj.activate(this);
        //     colorHolderObj.activate(this);
        //     colorHolderObj.setYellow();
            
        //     // Hide sub sections
        //     colorHolderObj.hideSlider();
        // }


        // Give a background glow
        this.glowOn = () => {
            this.panelElement.classList.add('breathe-animation');
        }

        // Remove a background glow
        this.glowOff = () => {
            this.panelElement.classList.remove('breathe-animation');
        }

        // Return the parent div for the whole panel
        this.getMainDivElement = () => {
            return this.panelElement;
        }

        this.getColorElement = () => {
            return this.panelElement;
        }

        // Changes the color of the approriate element
        this.setColor = (newClass) => {
            this.removeAllColorOptions();
            this.getColorElement().classList.add(newClass);
            this.color = newClass;

            if (activeItemsObj.isSinglePanels) {
                activeItemsObj.clearActiveItems();
            }
        }

        this.setShading = (shading) => {
            // Round with toFixed, then parse to a float to save
            this.shading = parseFloat(shading.toFixed(1));
            this.panelElement.style.filter = `brightness(${100 - shading}%)`;
        }

        //
        // Listeners
        //

        // Listen Command / Control clicks that are attmepting to select multiple items
        $(this.panelElement).on('click', event => {
            if (!isControlHeldDown) return;                                     // If not holding cmd/ctrl, return

            this.activate();
        });
        
        $(this.panelElement).on('touchstart', event => {
            if (!isControlHeldDown) return;                                     // If not holding cmd/ctrl, return

            this.activate();
        });
    }

    static getAverageShadingFromSingles = () => {
        let singles = activeItemsObj.items;
        let average = 0.0;
        let count = 0;

        // Count the average as a float each time (JIC)
        singles.forEach(panel => {
            average += parseFloat(panel.shading);
            count++;
        });

        // But display it as a fixed string
        return (average / count).toFixed(1);
    }
}


// ///////////////////
//
// Sub types of panels
//
// ///////////////////


class SolarPanel extends Panel {
    constructor(height, width, panelNum, parentArray) {
        super(height, width, panelNum, parentArray);
        var self = this;
        var panelType = "solar";

        // Changes the color of the approriate element
        this.setColor = (newClass) => {
            if (newClass == "custom-orange" || newClass == "") newClass = "custom-yellow";
            this.removeAllColorOptions();
            this.getColorElement().classList.add(newClass);
            this.color = newClass;

            if (activeItemsObj.isSinglePanels) {
                activeItemsObj.clearActiveItems();
            }
        }

        this.setColor(lastColorUsed);
    }
}

// New panel versions here
class SolarPanelV2 extends Panel {
    constructor(height, width, panelNum, parentArray) {
        super(height, width, panelNum, parentArray);
        var self = this;
        var panelType = "solar";

        // Changes the color of the approriate element
        this.setColor = (newClass) => {
            if (newClass == "custom-yellow" || newClass == "") newClass = "custom-orange";
            this.removeAllColorOptions();
            this.getColorElement().classList.add(newClass);
            this.color = newClass;

            if (activeItemsObj.isSinglePanels) {
                activeItemsObj.clearActiveItems();
            }
        }

        this.setColor(lastColorUsed);
    }
}
// New panel versions here

class WaterPanel extends Panel {
    constructor(height, width, panelNum, parentArray) {
        super(height, width, panelNum, parentArray);
        var self = this;
        const panelType = "water";
        this.color = 'custom-blue';                                         // Background color of the panel
        this.panelElement.classList.add(this.color);


        //
        // Methods
        //

        // Turn the GUI on and display the appropriate information
        this.activateGUI = () => {
            // Hide everything
            GUIHolder.hideTheseHolders(toolRelatedHolders);

            // Show relevant items
            shadingHolderObj.showHolder();
            
            shadingHolderObj.activate(this);
            
            // Hide sub sections
            colorHolderObj.hideSlider();
        }
    }
}

class ExistingPanel extends Panel {
    constructor(height, width, panelNum, parentArray) {
        super(height, width, panelNum, parentArray);
        var self = this;
        const panelType = 'existing';
        this.color = 'custom-gray';                                         // Background color of the panel
        this.panelElement.classList.add(this.color);


        //
        // Methods
        //

        // Existing Panels aren't allowed to do any single panel manipulation
        this.activateGUI = () => {
            return;
        }


        //
        // Listeners
        //

        // Existing panels aren't allowed to be singlely selected
        $(this.panelElement).off('click');
    }
}