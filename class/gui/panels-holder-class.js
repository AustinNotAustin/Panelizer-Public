// Author: Austin C Arledge (austin.c.arledge@gmail.com) 21 Jul 22

// ///////////////////////////
//
// Panel Creation Holder Class
//
// ///////////////////////////


// Panels Creation Holder Element
const panelsHolderElement = document.getElementById("panels-holder");

// Panel Creation Elements
const btnNewSolarElement = document.getElementById("create-new-solar-panel");

// New panel versions here
const btnNewV2SolarElement = document.getElementById("create-new-v2-solar-panel");
// New panel versions here

const btnNewWaterElement = document.getElementById("create-new-water-panel");
const btnNewExistingElement = document.getElementById("create-new-existing-panel");

class PanelsHolder extends GUIHolder {
    constructor(element) {
        super(element);


        this.solarBtn = new GUIComponentButton(btnNewSolarElement);

        // New panel versions here
        this.solarV2Btn = new GUIComponentButton(btnNewV2SolarElement);
        // New panel versions here

        this.waterBtn = new GUIComponentButton(btnNewWaterElement);
        this.existingBtn = new GUIComponentButton(btnNewExistingElement);
        
        this.subObjects = [
            this.solarBtn,

            // New panel versions here
            this.solarV2Btn,
            // New panel versions here

            this.waterBtn,
            this.existingBtn,
        ];
    }
}


const panelsHolderObj = new PanelsHolder(panelsHolderElement);

allHolders.push(panelsHolderObj);
newObjectRelatedHolders.push(panelsHolderObj);
