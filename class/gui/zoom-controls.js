// Author: Austin C Arledge (austin.c.arledge@gmail.com) 2 Nov 21


// //////////////////////
//
// Zoom in or out buttons
//
// //////////////////////


// Holder Element
const zoomHolderElement = document.getElementById("zoom-holder-div");

// Movement and rotation group
const zoomInElement = document.getElementById("zoom-in-btn");
const zoomOutElement = document.getElementById("zoom-out-btn");


class ZoomHolder extends GUIHolder {
    constructor(element) {
        super(element);
        
        this.zoomInBtn = new GUIComponentButton(zoomInElement);
        this.zoomOutBtn = new GUIComponentButton(zoomOutElement);

        this.subObjects = [
            this.zoomInBtn, this.zoomOutBtn,
        ];


        //
        // Methods
        //

        // Handles zooming in or out of a static img
        this.zoomImg = (type) => {
            // Disable all holders on the left and right
            activeItemsObj.clearActiveItems();
            GUIHolder.turnOffTheseHolders(toolRelatedHolders);

            // Delete all existing items
            saveObj.deleteAllItems();

            if (type == "plus") {
                if (zoomLevel < 22) {
                    zoomLevel++;
                }
                else if (zoomLevel >= 22) {

                }
            }
            else if (type == "minus") {
                zoomLevel--;
            }

            let link = makeGoogleStaticMapURL();                    // Get the full Google URL
            $("#map-img").attr("src", ``);                          // Set the img to said Google URL
            $("#map-img").attr("src", `${link}`);                   // Set the img to said Google URL
            this.handleZoomBtns();                                  // Disable and enable buttons each call
        }

        // Handles the button's status according to the max and min zoom limits
        this.handleZoomBtns = () => {
            if (zoomLevel >= 22) {
                this.zoomInBtn.deactivate();
            }
            if (zoomLevel < 22) {
                this.zoomInBtn.activate();
            }
            if (zoomLevel <= 20) {
                this.zoomOutBtn.deactivate();
            }
            if (zoomLevel > 18) {
                this.zoomOutBtn.activate();
            }
        }

    }
}


const zoomHolderObj = new ZoomHolder(zoomHolderElement);


//
// Listeners
//

// Listen for zoom in button clicks
$(zoomInElement).on("click", () => {
    showZoomModal("plus");
});

// Listen for zoom out button clicks
$(zoomOutElement).on("click", () => {
    showZoomModal("minus");
});
