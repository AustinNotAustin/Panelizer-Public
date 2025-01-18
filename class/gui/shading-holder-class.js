// Author: Austin C Arledge Sr (austin.c.arledge@gmail.com) 26 May 22

// ////////////////////
//
// Shading Holder Class
//
// ////////////////////


// Shading Holder Element
const shadingHolderElement = document.getElementById("shading-holder");

// Shading Elements
const shadingFieldElement = document.getElementById("shading-field");
const btnShadingUpElement = document.getElementById("btn-shading-up");
const btnShadingDownElement = document.getElementById("btn-shading-down");


class ShadingHolder extends GUIHolder {
    constructor(element) {
        super(element);

        this.shadingField = new GUIComponentField(shadingFieldElement, 'shading');
        this.btnShadingUp = new GUIComponentButton(btnShadingUpElement);
        this.btnShadingDown = new GUIComponentButton(btnShadingDownElement);

        this.subObjects = [
            this.shadingField, this.btnShadingUp, this.btnShadingDown
        ];


        //
        // Methods
        //

        // Active the shading holder items
        this.activate = (obj) => {
            this.subObjects.forEach(item => {
                item.activate(obj);
            });

            if (activeItemsObj.isSinglePanels) {
                this.shadingField.element.value = `${Panel.getAverageShadingFromSingles()}%`;
            } else {
                this.shadingField.element.value = `${obj.getAverageShading()}%`;
            }
        }
    }
}


const shadingHolderObj = new ShadingHolder(shadingHolderElement);                                           // Shading Holder

panelRelatedHolders.push(shadingHolderObj);
allHolders.push(shadingHolderObj);
toolRelatedHolders.push(shadingHolderObj);


//
// Shading Listeners
//

$(btnShadingUpElement).on('click', () => {                                      // Shading button up
    let shading = parseFloat(shadingFieldElement.value);
    shading += 5.0;
    
    if (shading > 100.0) {
        shading = 0.0;
    }
    
    activeItemsObj.items.forEach(item => {
        item.setShading(shading);
    });
    
    // Display the number as a fixed float
    shading = shading.toFixed(1);
    shadingFieldElement.value = `${shading}%`;
});

$(btnShadingDownElement).on('click', () => {                    // Shading button down
    let shading = parseFloat(shadingFieldElement.value);
    shading -= 5.0;
    
    if (shading < 0.0) {
        shading = 100.0;
    }
    
    activeItemsObj.items.forEach(item => {
        item.setShading(shading);
    });
    
    // Display the number as a fixed float
    shading = shading.toFixed(1);
    shadingFieldElement.value = `${shading}%`;
});

$(shadingFieldElement).on('change', () => {                     // Shading text field
    let val = shadingFieldElement.value;

    // Check for non-float numbers like . or blank
    if (val == "." || val == "") val = 0.0;

    let shading = parseFloat(val);
    shading = clamp(shading, 0.0, 100.0);
    
    activeItemsObj.items.forEach(item => {
        item.setShading(shading);
    });

    // Display the number as a fixed float
    shading = shading.toFixed(1);
    shadingFieldElement.value = `${shading}%`;
});
