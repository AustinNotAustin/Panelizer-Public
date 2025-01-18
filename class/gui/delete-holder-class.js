// Author: Austin C Arledge (austin.c.arledge@gmail.com) 15 Oct 21

// ///////////////////
//
// Delete Holder Class
//
// ///////////////////


// Delete Holder Element
const deleteHolderElement = document.getElementById("delete-holder");

// Delete Holder Sub Elements
const btnDeleteObjectElement = document.getElementById("delete-btn");

class DeleteHolder extends GUIHolder {
    constructor(element) {
        super(element);

        this.deleteBtn = new GUIComponentButton(btnDeleteObjectElement);
        
        this.subObjects = [
            this.deleteBtn
        ];
        
    }
}


const deleteHolderObj = new DeleteHolder(deleteHolderElement);

allHolders.push(deleteHolderObj);
newObjectRelatedHolders.push(deleteHolderObj);

