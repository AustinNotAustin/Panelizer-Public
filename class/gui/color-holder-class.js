// Author: Austin C Arledge Sr (austin.c.arledge@gmail.com) 19 Jul 22

// ////////////////////
//
// Color Holder Element
//
// ////////////////////


// Color Holder Element
const colorHolderElement = document.getElementById("color-holder");

// Color and Opacity Element
const btnColorOption1Element = document.getElementById("color-option-1");
const btnColorOption2Element = document.getElementById("color-option-2");
const btnColorOption3Element = document.getElementById("color-option-3");
const btnColorOption4Element = document.getElementById("color-option-4");
const sliderOpacityBarElement = document.getElementById("opacity-slider-bar");
const opacityTitleElement = document.getElementById("opacity-title");


class ColorHolder extends GUIHolder {
    constructor(element) {
        super(element);

        this.colorSwap = "black";   // Used to determine if the 4th color should be black or purple

        this.btnColorOption1 =  new GUIComponentButton(btnColorOption1Element);
        this.btnColorOption2 =  new GUIComponentButton(btnColorOption2Element);
        this.btnColorOption3 =  new GUIComponentButton(btnColorOption3Element);
        this.btnColorOption4 =  new GUIComponentButton(btnColorOption4Element);
        this.sliderOpacityBar = new GUIComponentSlider(sliderOpacityBarElement, 'opacity');

        this.subObjects = [
            this.btnColorOption1,
            this.btnColorOption2,
            this.btnColorOption3,
            this.btnColorOption4,
            this.sliderOpacityBar,
        ];


        //
        // Methods
        //

        this.activate = (obj) => {
            this.showSlider();
            this.setBlack();
            this.subObjects.forEach(sub => {
                sub.activate(obj);
            });

        }

        // Hide the slider bar at the bottom
        this.hideSlider = () => {
            this.sliderOpacityBar.hide();
            opacityTitleElement.style.display = "none";
        }
        
        // Show the slider bar at the bottom
        this.showSlider = () => {
            this.sliderOpacityBar.show();
            opacityTitleElement.style.display = 'flex';
        }

        // Sets the 4th color button to black
        this.setBlack = () => {
            this.colorSwap = "black";
            btnColorOption4Element.classList.add("custom-black");
            btnColorOption4Element.classList.remove("custom-yellow");
            btnColorOption4Element.classList.remove("custom-orange");
        }

        // Sets the 4th color button to yellow
        this.setYellow = () => {
            this.colorSwap = "yellow";
            btnColorOption4Element.classList.add("custom-yellow");
            btnColorOption4Element.classList.remove("custom-orange");
            btnColorOption4Element.classList.remove("custom-black");
        }
        
        // Sets the 4th color button to orange
        this.setOrange = () => {
            this.colorSwap = "orange";
            btnColorOption4Element.classList.add("custom-orange");
            btnColorOption4Element.classList.remove("custom-black");
            btnColorOption4Element.classList.remove("custom-yellow");
        }
    }
}


const colorHolderObj = new ColorHolder(colorHolderElement);                                               // Color and Opacity Holder

panelRelatedHolders.push(colorHolderObj);
allHolders.push(colorHolderObj);
obstacleRelatedHolders.push(colorHolderObj);
toolRelatedHolders.push(colorHolderObj);


//
// Color and Opacity Listeners
//

// Helper function for changing the colors of panels in an []
const changeListColors = (newClass) => {
    lastColorUsed = newClass;              // Keep the last color used to apply to all new panels being created

    activeItemsObj.items.forEach(item => {
        item.setColor(newClass)
    });
}

// A helper function to remove color classes if they exist
const removeColorClasses = (item) => {
}

// Red Color button
$(btnColorOption1Element).on('click', () => {
    changeListColors('custom-red');
});

$(btnColorOption2Element).on('click', () => {
    changeListColors('custom-white');
});

$(btnColorOption3Element).on('click', () => {
    changeListColors('custom-green');
});

$(btnColorOption4Element).on('click', () => {
    changeListColors("custom-" + colorHolderObj.colorSwap);
});

$(sliderOpacityBarElement).on('change', () => {
    let val = parseInt(sliderOpacityBarElement.value);

    activeItemsObj.items.forEach(item => {
        item.setOpacity(val);
    });
});
