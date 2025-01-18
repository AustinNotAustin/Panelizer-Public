// Author: Austin C Arledge (austin.c.arledge@gmail.com) 15 Oct 21

// //////////////////////
//
// Obstacles Holder Class
//
// //////////////////////


// Obstacle Holder Element
const obstaclesHolderElement = document.getElementById("obstacles-holder");

// Obstacle Holder Sub Elements
const btnNewCircleElement = document.getElementById("circle-obstacle-btn");
const btnNewSquareElement = document.getElementById("square-obstacle-btn");

class ObstaclesHolder extends GUIHolder {
    constructor(element) {
        super(element);


        this.circleBtn = new GUIComponentButton(btnNewCircleElement);
        this.squareBtn = new GUIComponentButton(btnNewSquareElement);

        this.subObjects = [
            this.circleBtn, this.squareBtn
        ];

    }
}


const obstaclesHolderObj = new ObstaclesHolder(obstaclesHolderElement);

allHolders.push(obstaclesHolderObj);
newObjectRelatedHolders.push(obstaclesHolderObj);
