// Author: Austin C Arledge Sr (austin.c.arledge@gmail.com) 19 Jun 22

// ////////////////////
//
// Scale Holder Element
//
// ////////////////////


// Scale Holder Element
const scaleHolderElement = document.getElementById("scale-holder");

// Scale Group
const scaleSliderElement = document.getElementById("scale-slider-bar");


class ScaleHolder extends GUIHolder {
    constructor(element) {
        super(element);

        this.slider = new GUIComponentSlider(scaleSliderElement, 'scale');

        this.subObjects = [
            this.slider
        ];

        // Active the scale holder items
        this.activate = (obj) => {
            this.subObjects.forEach(item => {
                item.activate(obj);
            });

            this.resetScaleRange();
        }

        // Set scale range back to the default 3 to 10
        this.resetScaleRange = () => {
            scaleSliderElement.min = 2;
            scaleSliderElement.max = 12;
        }

        // Set the scale range to 5 - 8 for use with the font scale
        this.setScaleRangeSmall = () => {
            scaleSliderElement.min = 5;
            scaleSliderElement.max = 8;
        }
    }
}


const scaleHolderObj = new ScaleHolder(scaleHolderElement);                                               // Color and Opacity Holder
scaleHolderObj.hideHolder();

panelRelatedHolders.push(scaleHolderObj);
allHolders.push(scaleHolderObj);
obstacleRelatedHolders.push(scaleHolderObj);
toolRelatedHolders.push(scaleHolderObj);


//
// Scale Listeners
//

$(scaleSliderElement).on('change', () => {
    let scale = parseInt(scaleSliderElement.value);
    
    activeItemsObj.items.forEach(item => {
        item.setScale(scale);
    });
});
