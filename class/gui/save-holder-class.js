// Author: Austin C Arledge (austin.c.arledge@gmail.com) 15 Oct 21

// /////////////////
//
// Save Holder Class
//
// /////////////////


// Save Holder Element
const saveHolderElement = document.getElementById("save-holder");

// Save Holder Sub Elements
const btnSaveProjectElement = document.getElementById("save-btn");


class SaveHolder extends GUIHolder {
    constructor(element) {
        super(element);
        
        this.saveBtn = new GUIComponentButton(btnSaveProjectElement);

        this.subObjects = [
            this.saveBtn
        ];
        
    }
}


const saveHolderObj = new SaveHolder(saveHolderElement);

allHolders.push(saveHolderObj);
newObjectRelatedHolders.push(saveHolderObj);
