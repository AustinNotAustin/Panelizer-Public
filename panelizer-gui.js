// Author: Austin C Arledge Sr (austin.c.arledge@gmail.com) 21 Jul 22

var isTypingAddr = false;                                                   // If the user is typing an address into the search bar


//
// GUI Side Tools Holder
//

class GUIHolder {
    constructor(element) {
        this.element = element;             // The div holding all the sub items

        this.subObjects = [];               // List of all the objects held within this holder

        //
        // Methods
        //

        this.hideHolder = () => {
            this.element.style.display = "none";
        }

        this.showHolder = () => {
            this.element.style.display = 'inherit';
        }

        this.deactivate = () => {
            this.subObjects.forEach(obj => {
                obj.deactivate();
            });
        }

        this.activate = (obj) => {
            this.subObjects.forEach(sub => {
                sub.activate(obj);
            });
        }

        this.setData = () => {
            // this.subObjects.forEach(obj => {

            //     switch (obj.type) {
            //         case 'text':

            //     }
            //     obj.turnOn();
            // });
        }
    }

    static hideTheseHolders(holders) {
        holders.forEach(holder => {
            holder.hideHolder();
        });
    }

    static turnOnTheseHolders(obj, holders) {
        holders.forEach(holder => {
            holder.activate(obj);
        });
    }

    static turnOffTheseHolders(holders) {
        holders.forEach(holder => {
            holder.deactivate();
        });
    }
}


//
// GUI Side Tools Class
//

class GUIComponent {
    constructor(element) {

        this.element = element;
        this.target;

        //
        // Methods
        //

        this.activate = () => {
            this.turnOn();
        }

        this.deactivate = () => {
            this.turnOff();
        }

        this.hide = () => {
            this.element.style.visibility = 'hidden';
        }

        this.show = () => {
            this.element.style.visibility = 'visible';
        }

        this.remove = () => {
            this.element.style.display = "none";
        }

        this.add = () => {
            this.element.style.display = 'inherit';
        }

        this.toggle = () => {
            if (this.element.disabled) {
                this.element.classList.remove("disabled");
            } else {
                this.element.classList.add("disabled");
            }
            this.element.disabled = !this.element.disabled;
        }

        this.toggleCheck = () => {
            this.element.checked = !this.element.checked;
        }

        this.turnOff = () => {
            this.element.disabled = true;
            if (!this.element.classList.contains("disabled")) {
                this.element.classList.add("disabled");
            }
        }

        this.turnOn = () => {
            this.element.disabled = false;
            if (this.element.classList.contains("disabled")) {
                this.element.classList.remove("disabled");
            }
        }

        this.setValue = (val) => {
            this.element.value = val;
        }

        this.setTextContent = (text) => {
            if (this.element)
            this.element.textContent = text;
        }

        this.check = () => {
            this.element.checked = true;
        }

        this.uncheck = () => {
            this.element.checked = false;
        }
    }
}

class GUIComponentButton extends GUIComponent {
    constructor(element) {
        super(element);
    }
}

class GUIComponentSlider extends GUIComponent {
    constructor(element, target) {
        super(element);

        this.element = element;
        this.target = target;                       // Opacity or Scale sliders allowed

        this.activate = (obj) => {
            if (!obj) return;

            switch (this.target) {
                case "opacity":
                    this.element.value = `${obj.opacity}`;
                    break;

                case "scale":
                    this.element.value = `${obj.scale}`;
                    break;
            }

            this.turnOn();
        }
    }
}

class GUIComponentText extends GUIComponent {
    constructor(element, target) {
        super(element);

        this.target = target;               // Options are sectionLength, totalLength, snapStatus
        this.targetObtained;
        let text;

        this.activate = (obj) => {
            if (!obj) return;

            let singles = activeItemsObj.isSinglePanels;

            switch (this.target) {
                case 'sectionLength':
                    if (singles) {
                        text = activeItemsObj.items.length;
                    } else {
                        text = obj.panels.length;
                    }
                    break;

                case 'totalLength':
                    if (singles) {
                        text = activeItemsObj.items.length;
                    } else {
                        text = obj.getTotalPanelsNum();
                    }

                    break;

                case 'snapStatus':
                    if (singles) {
                        text = 'Off';
                    } else {
                        text = obj.snapping ? 'On' : 'Off';
                    }

                    break;
            }

            this.turnOn();
            this.element.textContent = text;
        }

        this.deactivate = () => {
            switch (this.target) {
                case 'sectionLength':
                    text = '0';

                    break;

                case 'totalLength':
                    text = '0';

                    break;

                case 'snapStatus':
                    text = 'Off';

                    break;
            }

            this.turnOff();
            this.element.textContent = text;
        }
    }
}

class GUIComponentField extends GUIComponent {
    constructor(element, target) {
        super(element);

        this.target = target;               // Options are pitch, shading, groupNum, degrees
        this.targetObtained;
        let text;

        this.activate = (obj) => {
            if (!obj) return;                                       // Handle empty objects being sent

            let singles = activeItemsObj.isSinglePanels;

            switch (this.target) {
                case 'pitch':
                    if (singles) {
                        text = '';
                    } else {
                        text = `${obj.pitch}\xB0`;
                    }

                    break;

                case 'shading':
                    if (singles) {
                        text = `${Panel.getAverageShadingFromSingles()}%`;
                    } else {
                        text = `${obj.getAverageShading()}%`;
                    }

                    break;

                case 'groupNum':
                    if (singles) {
                        text = '';
                    } else {
                        text = obj.arrayNum;
                    }

                    break;

                case 'degrees':
                    if (singles) {
                        text = '';
                    } else {
                        text = `${obj.degrees}\xB0`;
                    }

                    break;
            }

            this.turnOn();
            this.element.value = text;
        }

        this.deactivate = () => {
            this.turnOff();
            this.element.value = '';
        }
    }
}

class GUIComponentCheckbox extends GUIComponent {
    constructor(element) {
        super(element);

        this.activate = (obj) => {
            this.turnOn();

            if (obj.snapping) {
                this.check();
            }
            else if (obj.snapping) {
                this.uncheck();
            }
        }

        this.deactivate = () => {
            this.turnOff();
            this.uncheck();
        }
    }
}


//
// GUI Left Objects Class
//

const solarBtnElement = document.getElementById('create-new-solar-panel');

// New panel versions here
const solarV2BtnElement = document.getElementById('create-new-v2-solar-panel');
// New panel versions here

const waterBtnElement = document.getElementById('create-new-water-panel');
const existingBtnElement = document.getElementById('create-new-existing-panel');
const circleBtnElement = document.getElementById('circle-obstacle-btn');
const squareBtnElement = document.getElementById('square-obstacle-btn');
const meterBtnElement = document.getElementById('meter-marking-btn');
const freeTextBtnElement = document.getElementById('text-marking-btn');

class ObjectSpawner {
    constructor(element, type, itemType) {
        this.element = element;
        this.type = type;

        this.spawnNewItem = (pos) => {
            let x = pos.get('x');
            let y = pos.get('y');
        }

        if (itemType == 'panel') {
            $(this.element).on('mousedown', event => {
                if (areObjsEnabled) PanelArrayClass.createNewSingleArray(this.type, event);
            });
            $(this.element).on('touchstart', event => {
                if (areObjsEnabled) PanelArrayClass.createNewSingleArray(this.type, event);
            });
        }

        else if (itemType == 'obstacle') {
            $(this.element).on('mousedown', event => {
                if (areObjsEnabled) Obstacle.createNewObstacle(this.type, event);
            });
            $(this.element).on('touchstart', event => {
                if (areObjsEnabled) Obstacle.createNewObstacle(this.type, event);
            });
        }

        else if (itemType == 'marking') {
            if (this.type == "meter") {
                $(this.element).on('mousedown', event => {
                    if (areObjsEnabled) Meter.createNewMeter(event);
                });
                $(this.element).on('touchstart', event => {
                    if (areObjsEnabled) Meter.createNewMeter(event);
                });
            }
            else if (this.type == "text") {
                $(this.element).on('mousedown', event => {
                    if (areObjsEnabled) FreeText.createNewFreeText(event);
                });
                $(this.element).on('touchstart', event => {
                    if (areObjsEnabled) FreeText.createNewFreeText(event);
                });
            }
        }
    }
}

const solarBtnObj = new ObjectSpawner(solarBtnElement, "solar", 'panel');

// New panel versions here
const solarV2BtnObj = new ObjectSpawner(solarV2BtnElement, "solarV2", 'panel');
// New panel versions here

const waterBtnObj = new ObjectSpawner(waterBtnElement, "water", 'panel');
const existingBtnObj = new ObjectSpawner(existingBtnElement, "existing", 'panel');
const circleObstacleBtnObj = new ObjectSpawner(circleBtnElement, "circle", 'obstacle');
const squareObstacleBtnObj = new ObjectSpawner(squareBtnElement, "square", 'obstacle');
const meterMarkingBtnObj = new ObjectSpawner(meterBtnElement, "meter", 'marking');
const freeTextMarkingBtnObj = new ObjectSpawner(freeTextBtnElement, 'text', 'marking');



// //////////////
//
//  GUI Listeners
//
// //////////////


//
// Modal Controls
//

// Titles
const saveSuccessMsg = "Save Successful!";
const areYouSureMsg = "Are you sure?";

// Messages
const askToDeleteMsg = "If you move the map from this location, all of your progress will be deleted.";
const askToChargeMsg = "By confirming this, you will be charged $5-$7 per image. This image may or may not be more up-to-date than the current view. There is no way to preview this image.";
const askCorrectLocMsg = "Is this the correct location?";
const askOverwriteMsg = "Saving will overwrite any previous save.";
const askToZoomMsg = "If you zoom right now, all of your progress will be deleted.";


const closeModal = () => {
    $("#modal-div").css("display", "none");
}
closeModal();                                                   // Close the modal by default

const openModal = () => {
    $("#modal-div").css("display", "block");
}

// Show the pop up window to ask the user if they're okay with a $5 fee
const showPictometryFeeModal = () => {
    openModal();                                                // Display the modal

    // Set the title, header, and text
    $("#modal-title").text(areYouSureMsg);
    $("#modal-header").text(askCorrectLocMsg);
    $("#modal-text").text(askToChargeMsg);

    // Prepare the confirm button
    $("#modal-confirm-btn").removeAttr('onclick');              // Set the confirm button's onclick value
    $("#modal-confirm-btn").attr('onClick', "closeModal();");

    // Hide the cancel button
    $("#modal-cancel-btn").css("display", "block");
}


// Shows the pop up window to ask the user is they are sure they want to lose all of their progress
const showMoveMapModal = () => {
    openModal();                                                // Display the modal

    // Set the title, header, and text
    $("#modal-title").text(areYouSureMsg);
    $("modal-header").text("");
    $("#modal-text").text(askToDeleteMsg);

    // Prepare the confirm button
    $("#modal-confirm-btn").removeAttr('onclick');              // Clear the last onClick func
    $("#modal-confirm-btn").attr("onClick", "enableMapMoving();closeModal();");

    // Hide the cancel button
    $("#modal-cancel-btn").css("display", "block");
}

// Shows the pop up window to ask the user if they're sure they want to save
const showConfirmSaveModal = () => {

    activeItemsObj.clearActiveItems();

    openModal();                                                // Display the modal

    // Set the title, header, and text
    $("#modal-title").text(areYouSureMsg);
    $("#modal-header").text("Warning!");
    $("#modal-text").text(askOverwriteMsg);

    // Prepare the confirm button
    $("#modal-confirm-btn").removeAttr('onclick');              // Clear the last onClick func
    $("#modal-confirm-btn").attr("onClick", "saveBtnAction();closeModal();");

    // Hide the cancel button
    $("#modal-cancel-btn").css("display", "block");
}

// Show the pop up window to show the user a successful save
const showSuccessfulSaveModal = () => {
    openModal();                                                // Display the modal

    // Set the title, header, and text
    $("#modal-title").text(saveSuccessMsg);
    $("#modal-header").text("");
    $("#modal-text").text("");

    // Prepare the confirm button
    $("#modal-confirm-btn").removeAttr('onclick');              // Clear the last onClick func
    $("#modal-confirm-btn").attr("onClick", "closeModal();");

    // Hide the cancel button
    $("#modal-cancel-btn").css("display", "none");
}

// Show the pop up window to ask the user if they're okay with zooming and removing all items
const showZoomModal = (type) => {
    openModal();

    // set the title, header, and text
    $("#modal-title").text(areYouSureMsg);
    $("#modal-header").text("");
    $("#modal-text").text(askToZoomMsg);

    // Prepare the confirm button
    $("#modal-confirm-btn").removeAttr("onclick");
    $("#modal-confirm-btn").attr("onClick", `zoomHolderObj.zoomImg("${type}");closeModal();`);

    // Prepare the cancel button
    $("#modal-cancel-btn").attr("onClick", "closeModal();");
}


// /////////
//
// Listeners
//
// /////////

//
// Map Green
//

$(document.body).on("click", (event) => {
    if (event.target == $("#map-green-padding")[0]) {
        activeItemsObj.clearActiveItems();
    }
    else if (event.target == $("#body-background")[0]) {
        activeItemsObj.clearActiveItems();
    }
    else if (event.target == $("#left-column")[0]) {
        activeItemsObj.clearActiveItems();
    }
    else if (event.target == $("#right-column")[0]) {
        activeItemsObj.clearActiveItems();
    }
    else if (event.target == $("#map-column")[0]) {
        activeItemsObj.clearActiveItems();
    }
});

//
// Delete Button
//

const deleteObj = () => {
    activeItemsObj.items.forEach(item => {
        item.deleteSelf();
    });
}

$("#delete-btn").on("click", () => {
    deleteObj();
});


//
// Address to geo location bar
//

$("#geo-code-text").on('focus', () => {
    $("#geo-code-text").val("");
    $("#geo-code-text").removeClass("text-gray-500");
    isTypingAddr = true;
});


//
// Control the ctrl-btn button
//

var isCtrlBtnActive = false;
const ctrlBtnToggle = () => {
    isCtrlBtnActive = !isCtrlBtnActive;
    isControlHeldDown = isCtrlBtnActive;

    if (isCtrlBtnActive) {
        $("#ctrl-btn-text").text("Command - On");
        $("#ctrl-btn").removeClass("custom-white");
        $("#ctrl-btn").addClass("custom-green");
    }
    else if (!isCtrlBtnActive) {
        $("#ctrl-btn-text").text("Command - Off");
        $("#ctrl-btn").removeClass("custom-green");
        $("#ctrl-btn").addClass("custom-white");
    }
}


// /////////////
//
// Holder arrays
//
// /////////////

// Every single holder
const allHolders = [];

// A list of all the panel holder related objects
const panelRelatedHolders = [];
const obstacleRelatedHolders = [];
const toolRelatedHolders = [];

// Object Creation Holder Lists
const newObjectRelatedHolders = [];
