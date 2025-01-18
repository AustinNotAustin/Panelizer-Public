// Author: Austin C Arledge (austin.c.arledge@gmail.com) 15 Oct 21

// ///////////////////////////////////////
//
// Snapping, Movement, and Rotation Holder
//
// ///////////////////////////////////////


// Holder Element
const snappingHolderElement = document.getElementById("move-rotate-snap-holder");

// Movement and rotation group
const degreeInputFieldElement = document.getElementById("degree-field");

// Rotation Buttons
const btnLeft90Element = document.getElementById("btn-left-90");
const btnRight90Element = document.getElementById("btn-right-90");
const btnLeft1Element = document.getElementById("btn-left-1");
const btnRight1Element = document.getElementById("btn-right-1");

// Movement Buttons
const btnMoveUpElement = document.getElementById("btn-move-up");
const btnMoveDownElement = document.getElementById("btn-move-down");
const btnMoveLeftElement = document.getElementById("btn-move-left");
const btnMoveRightElement = document.getElementById("btn-move-right");

// Portrait to Landscape Toggle Button
const btnPortToLandElement = document.getElementById("port-to-land-btn");

// Snapping Elements
const btnSnappingElement = document.getElementById("snapping-checkbox");
const snappingStatusTextElement = document.getElementById("snapping-status-text");


class SnappingHolder extends GUIHolder {
    constructor(element) {
        super(element);

        // Holder Components
        this.btnLeft90              = new GUIComponentButton(btnLeft90Element);
        this.btnMoveUp              = new GUIComponentButton(btnMoveUpElement);
        this.btnRight90             = new GUIComponentButton(btnRight90Element);
        this.btnMoveLeft            = new GUIComponentButton(btnMoveLeftElement);

        this.degreeInputField       = new GUIComponentField(degreeInputFieldElement, 'degrees');

        this.btnMoveRight           = new GUIComponentButton(btnMoveRightElement);
        this.btnLeft1               = new GUIComponentButton(btnLeft1Element);
        this.btnMoveDown            = new GUIComponentButton(btnMoveDownElement);
        this.btnRight1              = new GUIComponentButton(btnRight1Element);

        this.portToLand             = new GUIComponentButton(btnPortToLandElement);

        this.btnSnapping            = new GUIComponentCheckbox(btnSnappingElement);
        this.snappingStatusText     = new GUIComponentText(snappingStatusTextElement, 'snapStatus');

        this.subObjects = [
            this.btnLeft90, this.btnMoveUp, this.btnRight90, this.btnMoveLeft,
            this.degreeInputField, this.btnMoveRight, this.btnLeft1, 
            this.btnMoveDown, this.btnRight1, this.portToLand, 
            this.btnSnapping, this.snappingStatusText
        ];


        //
        // Methods
        //

        this.hideRotationButtons = () => {
            this.btnLeft1.hide();
            this.btnLeft90.hide();
            this.btnRight1.hide();
            this.btnRight90.hide();
            this.degreeInputField.hide();
        }

        this.hideSnapSection = () => {
            $("#snapping-row-div").css("display", "none");
        }

        this.showHolder = () => {
            this.element.style.display = 'inherit';
            this.showRotationButtons();
            this.showSnapSection();
        }

        this.showRotationButtons = () => {
            this.btnLeft1.show();
            this.btnLeft90.show();
            this.btnRight1.show();
            this.btnRight90.show();
            this.degreeInputField.show();
        }

        this.showSnapSection = () => {
            $("#snapping-row-div").css("display", "flex");
        }
    }
}


// Holder Object
const snappingHolderObj = new SnappingHolder(snappingHolderElement);

panelRelatedHolders.push(snappingHolderObj);
allHolders.push(snappingHolderObj);
toolRelatedHolders.push(snappingHolderObj);


//
// Snapping Related Functions
//

const toggleSnappingStatus = () => {
    activeItemsObj.items.forEach(array => {
        array.snapping = !array.snapping;

        if (array.snapping) {
            snappingHolderObj.btnSnapping.activate(array);
            snappingHolderObj.snappingStatusText.activate(array);
            snappingHolderObj.snappingStatusText.element.textContent = 'On';
        }
        else if (!array.snapping) {
            snappingHolderObj.btnSnapping.uncheck();
            snappingHolderObj.snappingStatusText.element.textContent = 'Off';
        }
    })
}


//
// Movement Button Listeners
//

$(btnMoveLeftElement).on('click', () => {
    activeItemsObj.items.forEach(item => {
        item.moveObjTo(-1, 0);
    });
});

$(btnMoveRightElement).on('click', () => {
    activeItemsObj.items.forEach(item => {
        item.moveObjTo(1, 0);
    });
});

$(btnMoveUpElement).on('click', () => {
    activeItemsObj.items.forEach(item => {
        item.moveObjTo(0, -1);
    });
});

$(btnMoveDownElement).on('click', () => {
    activeItemsObj.items.forEach(item => {
        item.moveObjTo(0, 1);
    });
});


//
//  Rotation Button Listeners
//

$(btnLeft90Element).on('click', () => {
    activeItemsObj.items.forEach(item => {
        item.addDegrees(-90);
    });
});

$(btnRight90Element).on('click', () => {
    activeItemsObj.items.forEach(item => {
        item.addDegrees(90);
    });
});

$(btnLeft1Element).on('click', () => {
    activeItemsObj.items.forEach(item => {
        item.addDegrees(-1);
    });
});

$(btnRight1Element).on('click', () => {
    activeItemsObj.items.forEach(item => {
        item.addDegrees(1);
    });
});

// Listen for GUI changes to the rotation
$(degreeInputFieldElement).on('change', () => {
    let userInput = parseInt(clamp360Degree(degreeInputFieldElement.value));

    activeItemsObj.items.forEach(item => {
        item.setDegrees(userInput);
    })
});

// Listen for portait to landscape button presses
$(btnPortToLandElement).on("click", () => {
    activeItemsObj.items.forEach(item => {
        item.toggleOrientation();
    });
});
