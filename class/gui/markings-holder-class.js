// Author: Austin C Arledge (austin.c.arledge@gmail.com) 5 Nov 21

// /////////////////////
//
// Markings Holder Class
//
// /////////////////////


// Markings Holder Element
const markingsHolderElement = document.getElementById("markings-holder");

// Markings Holder Sub Elements
const btnNewMeterElement = document.getElementById("meter-marking-btn");
const btnNewPenElement = document.getElementById("line-marking-btn");
const btnNewTextElement = document.getElementById("text-marking-btn");

class MarkingsHolder extends GUIHolder {
    constructor(element) {
        super(element);


        this.meterBtn = new GUIComponentButton(btnNewMeterElement);
        this.penBtn = new GUIComponentButton(btnNewPenElement);
        this.textBtn = new GUIComponentButton(btnNewTextElement);

        this.subObjects = [
            this.meterBtn, this.penBtn, this.textBtn
        ];


        //
        // Listeners
        //

        $("#line-marking-btn").on("click", (event) => {
            event.preventDefault();
            if (penObj.isDrawing == true) {
                Pen.cancelPenTool();
            }
            else if (penObj.isDrawing == false) {
                Pen.preparePenTool();
            }
        });

        $("#pen-status-text").on("click", (event) => {
            event.preventDefault();
        });
    }
}


const markingsHolderObj = new MarkingsHolder(markingsHolderElement);

allHolders.push(markingsHolderObj);
newObjectRelatedHolders.push(markingsHolderObj);
