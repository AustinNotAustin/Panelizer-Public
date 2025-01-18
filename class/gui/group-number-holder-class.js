// Author: Austin C Arledge (austin.c.arledge@gmail.com) 3 Nov 21

// /////////////////////////
//
// Group Number Holder Class
//
// /////////////////////////


// Group Number Holder Element
const groupNumberHolderElement = document.getElementById("group-number-holder");

// Array Group
const arrayGroupInputFieldElement = document.getElementById("array-group-field");
const panelsInSectionElement = document.getElementById("panels-in-section-num");
const totalpanelsInArrayElement = document.getElementById("total-panels-in-array-num");


class GroupNumberHolder extends GUIHolder {
    constructor(element) {
        super(element);

        this.arrayGroupInputField = new GUIComponentField(arrayGroupInputFieldElement, 'groupNum');
        this.panelsInSection = new GUIComponentText(panelsInSectionElement, 'sectionLength');
        this.totalPanelsInArray = new GUIComponentText(totalpanelsInArrayElement, 'totalLength');

        this.subObjects = [
            this.arrayGroupInputField, this.panelsInSection, this.totalPanelsInArray
        ];
    }
}


const groupNumberHolderObj = new GroupNumberHolder(groupNumberHolderElement);                                   // Array Group Number Holder

panelRelatedHolders.push(groupNumberHolderObj);
allHolders.push(groupNumberHolderObj);
toolRelatedHolders.push(groupNumberHolderObj);


//
// Group Number Listeners
//

// Listen for GUI changes to the Array Group Number
$(arrayGroupInputFieldElement).on('change', () => {
    let userInput = parseInt(arrayGroupInputFieldElement.value);

    activeItemsObj.items.forEach(item => {    
        item.arrayNum = clamp(userInput, 0, 9);
        item.updatePanelText();
        shadingHolderObj.shadingField.element.value = `${item.getAverageShading()}%`;
        
        groupNumberHolderObj.activate(item);
    });
});
