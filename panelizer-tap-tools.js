// Author: Austin C Arledge (austin.c.arledge@gmail.com) 15 Oct 21

class TapTool {
    constructor () {
        this.element = document.createElement('div');

        // X and Y Pos of the item
        this.x;
        this.y;


        //
        // Methods
        //

        this.showTool = () => {
            this.element.style.visibility = 'visible';
        }

        this.hideTool = () => {
            this.element.style.visibility = 'hidden';
        }
    }
}


class DupeArrow extends TapTool {
    constructor (dir) {
        super();

        this.dir = dir;             // The orientation of the arrow (L, R, T, or Bot)
        this.status = 'enabled';    // Whether or not this item has bee enabled or disabled due to it's axis settings

        // The button dimensions in pxs
        this.height = 10;
        this.width = 10;

        // The space in between the buttons and their panel
        this.padding = 10;

        // Set the element ID and class
        this.element.id = `${dir}-arrow`;
        this.element.className = `${dir}-arrow arrow`;
    
        // Hide it by default
        this.hideTool();

        
        //
        // Methods
        //

        // Set the arrow height, used for sizing the arrows with the arrays
        this.setHeight = (newHeight) => {
            this.element.style.height = `${newHeight}px`;
        }

        // Set the arrow height, used for sizing the arrows with the arrays
        this.setWidth = (newWidth) => {
            this.element.style.width = `${newWidth}px`;
        } 

        this.dragDuplication = (obj, point) => {
            let additionalHeight, additionalWidth;
            let newX, newY;
            let degreeCenter;

            // Commented out the top and bottom information

            // let angleTopAndBot = parseInt(obj.radians * (180 / Math.PI) + 90);
            // let radiansTopAndBot = angleTopAndBot * (Math.PI / 180);

            switch (this.dir) {
                // case 'top':
                //     degreeCenter = obj.degrees; // Set the direction bounds
                //     additionalHeight = obj.panelHeight;
                //     additionalWidth = 0;

                //     newX = Math.cos(radiansTopAndBot) * (obj.panelHeight) * -1;
                //     newY = Math.sin(radiansTopAndBot) * (obj.panelHeight) * -1;
                //     break;
                // case 'bottom':
                //     degreeCenter = obj.degrees + 180; // Set the direction bounds
                //     additionalHeight = obj.panelHeight;
                //     additionalWidth = 0;

                //     newX = Math.cos(radiansTopAndBot) * (obj.panelHeight);
                //     newY = Math.sin(radiansTopAndBot) * (obj.panelHeight);
                //     break;
                case 'left':
                    degreeCenter = obj.degrees + 270; // Set the direction bounds
                    additionalHeight = 0;
                    additionalWidth = obj.panelWidth;

                    newX = Math.cos(obj.radians) * (obj.panelWidth) * -1;
                    newY = Math.sin(obj.radians) * (obj.panelWidth) * -1;

                    break;
                    
                case 'right':
                    degreeCenter = obj.degrees + 90; // Set the direction bounds
                    additionalHeight = 0;
                    additionalWidth = obj.panelWidth;
                    
                    newX = Math.cos(obj.radians) * (obj.panelWidth);
                    newY = Math.sin(obj.radians) * (obj.panelWidth);

                    break;
            }

            // Get angle of mouse to starting obj
            let objMap = { x: gsap.getProperty(obj.masterElement, 'x'), y: gsap.getProperty(obj.masterElement, 'y') };
            let angles = determineAngle(objMap, point);


            degreeCenter = degreeCenter > 359 ? degreeCenter - 360 : degreeCenter;
            degreeCenter = degreeCenter < 0 ? degreeCenter + 360 : degreeCenter;

            let angleDiff = (degreeCenter - angles[1] + 180 + 360) % 360 - 180;
            let distance = getHypotenuse(objMap.x, objMap.y, point.x, point.y);
            
            // If that angle is within allotted right bounds
            if (angleDiff <= 45 && angleDiff >= -45) {
                // Get the distance (hypotenuse) of mouse
                if (distance > ((additionalWidth + additionalHeight))) {

                    obj.addPanelToSide(this.dir);

                    groupNumberHolderObj.activate(obj);
                    groupNumberHolderObj.panelsInSection.activate(obj);
                }
            }

            // Handle panel reduction when a panel has already been expanded
            if (angleDiff >= 135 || angleDiff <= -135) {

                if (distance > ((additionalWidth + additionalHeight))) {

                    obj.removePanelFromSide(this.dir);
                }
            }
        }
    }

    static showAllArrows = (arrows) => {
        arrows.forEach(arrow => {
            if (arrow.status != 'disabled') arrow.showTool();
        });
    }
    
    static hideAllArrows = (arrows) => {
        arrows.forEach(arrow => {
            if (arrow.status != 'disabled') arrow.hideTool();
        });
    }
}

// Spin Knobs are used to rotate the panel in question
class SpinKnob extends TapTool {
    constructor () {
        super();
        this.element.id = `spin-knob`;
        this.element.className = 'spin-knob';
        this.element.style.display = 'block';       // Remove this once top and bottom arrows are re-added

    }
}

const determineAngle = (object, mouse) => {
    let RadToDegree = 180 / Math.PI;

    let x1 = object.x;
    let y1 = object.y;

    let x2 = mouse.x;
    let y2 = mouse.y;

    let rads = Math.atan2(y2 - y1, x2 - x1);
    let degrees = (((parseInt(rads * RadToDegree + 90)) % 360) + 360) % 360;

    let adjustedRads = degrees * (Math.PI / 180);

    return [adjustedRads, degrees];
}
 