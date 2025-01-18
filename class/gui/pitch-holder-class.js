// Author: Austin C Arledge (austin.c.arledge@gmail.com) 15 Oct 21

// //////////////////
//
// Pitch Holder Class
//
// //////////////////


// Holder Element
const pitchHolderElement = document.getElementById("pitch-holder");

// Pitch Elements
const pitchFieldElement = document.getElementById("pitch-field");
const btnpitchUpElement = document.getElementById("btn-pitch-up");
const btnpitchDownElement = document.getElementById("btn-pitch-down");


class PitchHolder extends GUIHolder {
    constructor(element) {
        super(element);

        this.pitchField = new GUIComponentField(pitchFieldElement, 'pitch');
        this.btnpitchUp = new GUIComponentButton(btnpitchUpElement);
        this.btnpitchDown = new GUIComponentButton(btnpitchDownElement);

        this.subObjects = [this.pitchField, this.btnpitchUp, this.btnpitchDown];
    }
}


// Pitch Holder
const pitchHolderObj = new PitchHolder(pitchHolderElement);

panelRelatedHolders.push(pitchHolderObj);
allHolders.push(pitchHolderObj);
toolRelatedHolders.push(pitchHolderObj);


//
// Pitch
//

// Listen for GUI changes to the pitch / Pitch section
$(btnpitchUpElement).on('click', () => {
    activeItemsObj.items.forEach(obj => {
        let {pitch} = obj;

        if (pitch > 20) {                 // Currently at 40 degrees
            obj.pitch = 10;               // Up loops back to 10
        }
        else if (pitch > 10) {            // Currently at 20
            obj.pitch = 40;               // Up to 40
        }
        else {                            // Else at 10
            obj.pitch = 20;               // Up to 20
        }

        pitchFieldElement.value = `${obj.pitch}\xB0`;
        obj.updateDimensions();
    });
});

$(btnpitchDownElement).on('click', () => {
    activeItemsObj.items.forEach(obj => {
        let {pitch} = obj;

        if (pitch > 20) {                 // Currently at 40 degrees
            obj.pitch = 20;               // Down to 20
        }
        else if (pitch > 10) {            // Currently at 20
            obj.pitch = 10;               // Down to to 10
        }
        else {                            // Else at 10
            obj.pitch = 40;               // Loop down to 40
        }

        pitchFieldElement.value = `${obj.pitch}\xB0`;
        obj.updateDimensions();
    });
});
