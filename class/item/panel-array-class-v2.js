// Author: Austin C Arledge Sr (austin.c.arledge@gmail.com) 21 Jul 22

// /////////////////////////
//
// Panel Array Master Holder
//
// /////////////////////////

class PanelArrayClassV2 extends PanelArrayClass {
    constructor(uniqueNum, type, x, y, degrees) {
        super(uniqueNum, type, x, y, degrees);

        // Set the color holder objects 4th color to what is below
        this.setColorHolderColor = () => {
            colorHolderObj.setOrange();
        }

        // //////////////////////////////////
        //
        // Panel Array Class V2 Reference Variables
        //
        // //////////////////////////////////

        // The possible pitch options for panels and their respective length
        this.pitchReference = {
            "portrait": {
                10: 1.85055,                                // 10 degree pitch turns a 1.8791 meter tall panel into 1.85055 meters
                20: 1.76578,                                // 20 degree pitch turns a 1.8791 meter tall panel into 1.76578 meters 
                40: 1.43947,                                // 40 degree pitch turns a 1.8791 meter tall panel into 1.43947 meters
            },
            "landscape": {
                10: 1.02557,                                // 10 degree pitch turns a 1.0414 meter wide panel into 1.02557 meters
                20: 0.97859,                                // 20 degree pitch turns a 1.0414 meter wide panel into 0.97859 meters
                40: 0.79775,                                // 40 degree pitch turns a 1.0414 meter wide panel into 0.79775 meters
            },
        };

        // A standard panel's dimensions
        this.panelDimensions = {
            "portrait": {
                height: 1.8791,                                 // 74-ish" or 1.8791 meters (meters will be the unit of measurement for my math)
                width: 1.0414                                   // 41.0" or 1.0414 meters
            },
            "landscape": {
                height: 1.0414,                                 // 41.0" or 1.0414 meters
                width: 1.8791                                   // 74-ish" or 1.8791 meters
            },
        };

        this.addNewPanel();
        this.removePanelFromSide("left");

    }

    
}