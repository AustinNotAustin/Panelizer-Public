// Author: Austin C Arledge Sr (austin.c.arledge@gmail.com) 21 Jul 22

// /////////////////////////
//
// Panel Array Master Holder
//
// /////////////////////////

class PanelArrayClass extends Item {
    constructor(uniqueNum, type, x, y, degrees) {
        super();

        var self = this;

        this.isSnappedTogether = false;                             // is the panel currently snapped to another object
        this.arrayNum = 1;                                          // The solar panel array number
        this.snapping = true;                                       // If snapping is enabled or disabled
        
        this.type = type;                                           // Water, Solar, or Existing as string

        this.uniqueNum = uniqueNum;                                 // Unique number for ID
        this.panels = [];                                           // All panel objects in this current solar panel array
        this.stateNum = 0;                                          // Used for tap tools
        this.axis = 'primary';                                      // Used for duplication arrows. primary, horizontal, or vertical
        this.radians = degreeToRadian(degrees);
        this.degrees = degrees;
        this.pitch = 20;                                            // How steep or flat the panel is laying on a roof
        this.opacity = 6;                                           // The number (* 10) of the opacity percentage that this object has
        this.objType = 'panelArray';
        this.orientation = lastOrientation;                         // Portrait or Landscape, used for sideways panels that are still considered 0 degrees
        this.saveCategory = "panels";                               // Used for the saveObj class

        this.isActive = false;                                      // Is clicked/tapped on as the actively selected item

        this.panelObj;                                              // The object that holds the panel class object
        this.closestSnapArrayObj;                                   // Used when attempting to snap, this is the closest object to self (using their center x,y coords)

        // Create the DOM elements
        this.masterElement = document.createElement('div');         // The entire DOM object & sub objects (Highest level)
        this.toolElement = document.createElement('div');           // The div that holds the spin knob, arrows, and the panel holder div (2nd level)

        this.topToolSubElement = document.createElement('div');     // The div that holds the top level arrow
        this.middleToolSubElement = document.createElement('div');  // The div the holds the left arrow, right arrow, and panel holder div
        this.bottomToolSubElement = document.createElement('div');  // The div the holds the bottom level arrow
        
        this.panelHolderElement = document.createElement('div');    // The div that holds all of the individual solar panels

        // Create the Tool DOM elements
        this.spinKnobObj = new SpinKnob();
        this.arrowLeftObj = new DupeArrow('left');
        this.arrowRightObj = new DupeArrow('right');

        // Top and bottom arrows are removed for now.

        // this.arrowTopObj = new DupeArrow('top');
        // this.arrowBottomObj = new DupeArrow('bottom');

        // Asign the DOM element class and ID
        this.masterElement.id = `panel-obj-master-holder-${this.uniqueNum}`;
        this.masterElement.className = 'panel-obj-master-holder order-10';

        this.toolElement.id = `panel-obj-tool-holder-${this.uniqueNum}`;
        this.toolElement.className = 'panel-obj-tool-holder';

        this.topToolSubElement.className = 'top-tool-holder';
        this.middleToolSubElement.className = 'middle-tool-holder';
        this.bottomToolSubElement.className = 'bottom-tool-holder';

        this.panelHolderElement.id = `panel-obj-panels-holder-${this.uniqueNum}`;
        this.panelHolderElement.className = 'panels-holder';

        // Append the DOM elements to the document
        map.appendChild(this.masterElement);
        this.masterElement.appendChild(this.toolElement);
        this.toolElement.append(this.topToolSubElement);
        this.toolElement.append(this.middleToolSubElement);
        this.toolElement.append(this.bottomToolSubElement);

        // this.topToolSubElement.append(this.arrowTopObj.element);
        this.topToolSubElement.append(this.spinKnobObj.element);

        this.middleToolSubElement.append(this.arrowLeftObj.element);
        this.middleToolSubElement.append(this.panelHolderElement);
        this.middleToolSubElement.append(this.arrowRightObj.element);

        // this.bottomToolSubElement.append(this.arrowBottomObj.element);

        // Group and set the arrow tool positions
        this.allArrows = [this.arrowLeftObj, this.arrowRightObj];
        // this.allArrows = [this.arrowTopObj, this.arrowBottomObj, this.arrowLeftObj, this.arrowRightObj];


        //
        // Snapping
        //

        //  A parallel panels snapping diagram

        //  Snap points holds the first item's points, last item's points, and every panels basic points
        //
        //  First points will have the left 3 points of an array
        //  Basic points will have the top and bottom points for every single array
        //  End points will have the right 3 points of an array
        //
        //  It's fine for one panel to be the first, last, and basic panel at the same time.

        //  Each panel (labeled as 'Self') stores snapping points around itself
        //
        //     L1        T1      T2       R1
        //
        //           -------- -------- --------
        //          |        |        | Random |
        //          |        |        | Panel  |
        //     L2   |  Self  |  Self  |   R2   |
        //          |        |        |        |
        //          |        |        |        |
        //           -------- -------- --------
        //          | Random |
        //     L3   |   B1   |   B2       R3
        //          | Panel  |

        //  In this example, L1-3 are the Left points extends from the Left most panel labeled 'Self
        //  T1-2 and B-2 are the 'Basic' top and bottom points
        //  R1-3 are the Right points extending from the last panel in the array

        // The other two panels are random panels snapped in postion in their own array (just used as an example of snapping)


        this.snapParallelPoints = new Map();        // The snappable points of each panel when both panels are parallel
        this.selfPoints = new Map();                // The non-snappable points of each panels middle position


        // /////////////////
        // 
        // Currently, the perpendicular snapping is not built <--------------------   READ   -----!!

        // Don't need to build it since we added an option to turn verticle panels horizontal.

        // this.snapPerpendicularPoints = new Map();   // The snappable points of each panel when one panel is perpendicular to the other

        // A rectanngle, when snapped sideways (perpendicular), will have these points
        //
        //   1     2          3     4
        //
        //           --------
        //          |        |
        //     5    |        |    6
        //          |  Self  |-----------
        //     7    |        |    8      | This 2nd rectangle snapped to point 8 (Middle Right Bottom position)
        //          |        |           |
        //           -------- -----------
        //          |           |    This 3rd rectangle is snapped to point 11
        //   9    10|       11  |    12
        //           -----------
        
        //      Number Key:
        // 1: Top Left Outter
        // 2: Top Left Inner
        // 3: Top Right Inner
        // 4: Top Right Outter
        // 5: Middle Top Left
        // 6: Middle Top Right
        // 7: Middle Bottom Left
        // 8: Middle Bottom Right
        // 9: Bottom Left Outter
        // 10: Bottom Left Inner
        // 11: Bottom Right Inner
        // 12: Bottom Right Outter

        // Currently, the perpendicular snapping is not built
        //
        // /////////////////

        let targetArray = saveObj.allObjs.get("panels").get(this.type);
        targetArray.push(this);

		this.distances = [];
		this.distanceMap = {};
		this.closestSnapObj;

        this.isPanelHeldDown = false;
        this.isArrowHeldDown = false;
        this.arrowHeldDown = '';

        
        // This object allows the panel array to be rotated
        this.rotatable = Draggable.create(`#panel-obj-master-holder-${self.uniqueNum}`, {
            type: "rotation",
            onPress: () => {
                self.setRotationCenter();
            },
            onRelease: () => {
                self.rotatable.disable();                   // Disable this object once the rotation is over
                self.draggable.enable();                    // then enable the draggable
            },
            liveSnap: true,
            snap: function(endValue) {
                let degrees = clamp360Degree(endValue);
                let radians = degreeToRadian(degrees);
                lastPanelDegrees = degrees;
                lastPanelRadians = radians;
                self.degrees = degrees;
                self.radians = radians;

                self.activateGUI();

                return degrees;
            }
        })[0].disable();        // Disable this object to start


        // This object allows the panel array to be moved / dragged
		this.draggable = Draggable.create(`#panel-obj-master-holder-${self.uniqueNum}`, {
            onPress: function (event) {
                if (!areObjsEnabled) return;                                                   // If the map is not ready for objects, don't move
                if (isControlHeldDown) return;                                                  // Holding control should select a single item instead
                
                if (event.target == self.spinKnobObj.element) {                                 // If the user presses down on the spin knob
                    self.draggable.disable();
                    self.rotatable.enable().startDrag(event);
                }
                else if (event.target == self.arrowLeftObj.element) {                                // If the user presses down on the left arrow
                    self.isArrowHeldDown = true;
                    self.arrowHeldDown = self.arrowLeftObj;
                    return;
                }
                else if (event.target == self.arrowRightObj.element) {                               // If the user presses down on the right arrow
                    self.isArrowHeldDown = true;
                    self.arrowHeldDown = self.arrowRightObj;
                    return;
                } else {   
                    self.activate();
                    self.handleState();                                                           // Update the GUI items to match the current object
                }
                
                // //////////////////////////////////////////////////
                //
                // Top and bottom arrow features are removed for now

                // if (event.target == self.arrowTopObj.element) {                                 // If the user presses down on the top arrow
                //     self.isArrowHeldDown = true;
                //     self.arrowHeldDown = self.arrowTopObj;
                //     return;
                // }
                // if (event.target == self.arrowBottomObj.element) {                              // If the user presses down on the bottom arrow
                //     self.isArrowHeldDown = true;
                //     self.arrowHeldDown = self.arrowBottomObj;
                //     return;
                // }

                // Top and bottom arrow features are removed for now
                //
                // //////////////////////////////////////////////////
            },
            onRelease: function (event) {
                self.isArrowHeldDown = false;

                if (self.arrowHeldDown != null) self.arrowHeldDown = null;
            },
			onDragStart: function (point) {
                if (isControlHeldDown) return;
                if (self.isArrowHeldDown) return;

                self.resetState();
                self.handleState();
                self.activateGUI();
                self.updateSnapPoints();                                // Only call this after moving to avoid exessive calculations, this will calculate the snappable points on this solar array
			},
			onDragEnd: function () {
                if (self.closestSnapArrayObj) self.closestSnapArrayObj.masterElement.style.filter = '';
                self.updateCenterOfObj();
			},
			inertia: true,
			liveSnap: {
				points: function(point) {
                    if (isControlHeldDown) return;

                    // If the user is duplicating the panels with the arrow draggable tool, don't move the panel
                    if (self.isArrowHeldDown) {
                        self.arrowHeldDown.dragDuplication(self, point);

                        return;              // Again, don't return a point (unless it's to silence errors in the future)
                    }

                    if (!self.snapping) return point;                                           // If snapping is turned off, don't snap and instead give the normal X and Y coords

                    self.updateCenterOfObj();                                                   // Used to just get the center X and Y values of the draggable element
                    self.closestSnapArrayObj = self.findClosestPanelArray();                    // Returned the closest panel array as an object
                    let closestRotationAngle;

                    // If there is another array to snap to
                    if (self.closestSnapArrayObj != null) {

                        // Set the closest array's aura to red (subject to change drastically)
                        self.closestSnapArrayObj.masterElement.style.filter = 'drop-shadow(0 0 0.75rem crimson)';

                        closestRotationAngle = self.getClosestRotationSnap();                   // Find the closest snappable array's angle (used to auto snap and turn later)
                        let closestSnapPoint;                                                   // Store the closest snappable point (compared to the self's centere point)

                        if (!closestRotationAngle.isPerpendicular) {                            // If the closest snappable rotation is NOT a perpendicular angle
                            closestSnapPoint = self.findClosestSnapPoint();                     // Get the closest snappable point
                        }
                        
                        if (closestSnapPoint != null) {                                         // Don't run if there isn't a closest snappable point
                            // If the draggable's position is at the same position as the closest snap point (within 3 px's)
                            if (Math.abs(closestSnapPoint.x.toFixed(0) - self.draggable.x.toFixed(0)) < 3 && 
                                Math.abs(closestSnapPoint.y.toFixed(0) - self.draggable.y.toFixed(0)) < 3) {

                                self.isSnappedTogether = true;                                  // Set self isSnappedTogether value to true
                                self.closestSnapArrayObj.isSnappedTogether = true;              // Set the other array's value to true as well
                            } else {
                                self.isSnappedTogether = false;                                 // If not, set isSnappedTogether to false
                            }

                            // Snap the object to the same direction as the other panel
                            if (self.isSnappedTogether) {
                                let snapAngle = closestRotationAngle.snapRotationResult;        // Get the angle to snap to
                                self.degrees = snapAngle;                                       // Store the new angle in degrees
                                self.radians = degreeToRadian(snapAngle);                       // Store the new angle in degrees
                                self.rotateObject();                                            // Apply the rotation
                            }

                            return {x: closestSnapPoint.x.toFixed(3), y: closestSnapPoint.y.toFixed(3)};    // Return the snap point to the draggable obj
                        }
                    }

                    return point;           // If no other point is returned, just move the object freely (no snap point)
				},

				radius: 18
			},
		})[0];


        // ////////////////
        //
        // Snapping Methods
        //
        // ////////////////
        
        this.findClosestPanelArray = () => {
            let objList = saveObj.allObjs.get("panels").get(this.type);

            let shortestDistance;
            let targetObj;

            objList.forEach(obj => {
                obj.masterElement.style.filter = '';
                if (obj == this) return;

                let distance = getHypotenuse(this.draggable.x, this.draggable.y, obj.draggable.x, obj.draggable.y);

                if (shortestDistance == null) {
                    shortestDistance = distance;
                    targetObj = obj;
                }

                if (distance < shortestDistance) {
                    shortestDistance = distance;
                    targetObj = obj;
                }
            });

            return targetObj;
        }

        // Finds the closest snap points for a moving array as compared to the array's closest snappable array (that snappable arrays respective points, that is)
        this.findClosestSnapPoint = () => {
            if (this.closestSnapArrayObj == null) return;

            let values = this.snapParallelPoints.values();
            let length = this.snapParallelPoints.size;

            let closestPoint;
            let shortestHypotenuse;

            for (let x = 0; x < length; x++) {
                let nextVal = values.next().value;
                let hypotenuse = getHypotenuse(nextVal.x, nextVal.y, this.draggable.x, this.draggable.y);
                
                if (shortestHypotenuse == null && hypotenuse != null) {
                    closestPoint = nextVal;
                    shortestHypotenuse = hypotenuse;
                }

                if (hypotenuse < shortestHypotenuse) {
                    closestPoint = nextVal;
                    shortestHypotenuse = hypotenuse;
                }
            }

            return closestPoint;
        }

        // Set's the draggable object's x and y position to be the center of the master holder element
        this.updateCenterOfObj = () => {
            gsap.set(`#panel-obj-master-holder-${this.uniqueNum}`, {
                xPercent: -50,
                yPercent: -50
            });
        }
        
        // Call this only on drag start to find all snappable points
        this.updateSnapPoints = () => {
            let arrays = saveObj.allObjs.get("panels").get(`${this.type}`);
            let numOfPanels = this.panels.length;

            this.snapParallelPoints.clear();

            arrays.forEach(array => {
                if (array == this) return;

                let otherNumOfPanels = array.panels.length;
                let total = numOfPanels + otherNumOfPanels;

                if (total % 2 > 0) {
                    this.setSnapPointsOdd(array);
                } else {
                    this.setSnapPointsEven(array);
                }

            });

        }

        // Shift the "weight" of the holder to the left or right to account for position changes that occur when
        // using the duplication "wings". This will simply move the array to the left or right by half of it's width
        this.shiftSide = (dir) => {
            let currentX, currentY, newX, newY, xDiff, yDiff, hypot;

            this.updateCenterOfObj();

            currentX = gsap.getProperty(this.getMainDivElement(), 'x');
            currentY = gsap.getProperty(this.getMainDivElement(), 'y');

            hypot = this.getMainDivElement().offsetWidth / 2;

            xDiff = hypot * Math.cos(this.degrees * (Math.PI / 180));
            yDiff = hypot * Math.sin(this.degrees * (Math.PI / 180));

            let currDegree = this.degrees + 0;
            this.setDegrees(0);

            // Shift the weight opposite of the direction
            if (dir == "left") {
                newX = currentX + xDiff;
                newY = currentY + yDiff;

                // Set the center point of this object to the right
                gsap.set(this.getMainDivElement(), {
                    xPercent: -100,
                    yPercent: -50
                });
            }
            else if (dir == "right") {
                newX = currentX + (xDiff * -1);
                newY = currentY + (yDiff * -1);

                // Set the center point of this object to the right
                gsap.set(this.getMainDivElement(), {
                    xPercent: 0,
                    yPercent: -50
                });
            }

            this.setDegrees(currDegree);

            // Apply the changes
            gsap.set(this.getMainDivElement(), {x: newX, y: newY});                     // Set the rotation value to the current degrees
            this.draggable.update();                                                    // Update the draggable object to apply the change
        }

        // Unshift the "weight" of the item from a left or right direction, back to it's central point
        // This should give the effect that nothing had changed on the item
        this.unshiftSide = (dir) => {
            let currentX, currentY, newX, newY, xDiff, yDiff, hypot;

            currentX = gsap.getProperty(this.getMainDivElement(), 'x');
            currentY = gsap.getProperty(this.getMainDivElement(), 'y');

            hypot = this.getMainDivElement().offsetWidth / 2;

            let radians = clamp360Degree(this.degrees - 0) * (Math.PI / 180)

            xDiff = hypot * Math.cos(radians);
            yDiff = hypot * Math.sin(radians);

            // Shift the weight opposite of the direction
            if (dir == "left") {
                newX = currentX - (xDiff * 1);
                newY = currentY - (yDiff * 1);
            }
            else if (dir == "right") {
                newX = currentX + (xDiff * 1);
                newY = currentY + (yDiff * 1);
            }
            
            // Set the center point of this object back to the center
            gsap.set(this.getMainDivElement(), {
                xPercent: -50,
                yPercent: -50
            });

            // Apply the changes
            gsap.set(this.getMainDivElement(), {x: newX, y: newY});                     // Set the rotation value to the current degrees
            this.draggable.update();                                                    // Update the draggable object to apply the change
        }

        // Create and append x and y coord values of each array's panel's center point (specifically the center point of each panel in the array)
        // this.setOddSelfPoints = () => {
        //     if (this.closestSnapArrayObj == null) return;

        //     let noSnapMap = this.selfPoints;                                        // Clear the no snap map points
        //     noSnapMap.clear();

        //     let count = 1;                                                          // Counter used to track panels in the array
        //     let hopCount = 0;                                                       // Used to keep track of the panel length starting at the middle
        //     let numOfPanels = this.panels.length;                                   // Total number of panels in the array
        //     let otherArrayNumOfPanels = this.closestSnapArrayObj.panels.length;     // Total number of panels on the closest array

        //     let centerPanel = {x: this.draggable.x, y: this.draggable.y};           // Add the first center point
        //     noSnapMap.set(`center${hopCount}`, centerPanel);

        //     hopCount++;

        //     while (count < numOfPanels + otherArrayNumOfPanels) {                   // Add the side points until done
        //         let xL, yL, xR, yR, xDiff, yDiff;

        //         xDiff = (this.panels[0].width * hopCount) * Math.cos(this.radians);
        //         yDiff = (this.panels[0].width * hopCount) * Math.sin(this.radians);
                
        //         xL = this.draggable.x - xDiff;
        //         yL = this.draggable.y - yDiff;
        //         let panelL = {x: xL, y: yL};
                
        //         xR = this.draggable.x + xDiff;
        //         yR = this.draggable.y + yDiff;
        //         let panelR = {x: xR, y: yR};
                
        //         count += 2;
                
        //         noSnapMap.set(`left${hopCount}`, panelL);
        //         noSnapMap.set(`right${hopCount}`, panelR);

        //         hopCount++;
        //     }
        // }

        // Sets the panels internal snap points when the length is even, on the x axis
        // this.setEvenSelfPoints = () => {
        //     let noSnapMap = this.selfPoints;                                        // Clear the no snap map points
        //     noSnapMap.clear();

        //     let count = 1;                                                          // Counter used to track panels in the array
        //     let hopCount = 0;                                                       // Used to keep track of the panel length starting at the middle
        //     let numOfPanels = this.panels.length;                                   // Total number of panels in the array

        //     let xCenterDiffL, yCenterDiffL, xCenterDiffR, yCenterDiffR, xDiff, yDiff;


        //     xDiff = (this.panels[0].width / 2) * Math.cos(this.radians);             // The x pos difference for trig calcs
        //     yDiff = (this.panels[0].width / 2) * Math.sin(this.radians);             // The y pos difference for trig calcs

        //     xCenterDiffL = this.draggable.x - xDiff;                                // The L center panel x pos
        //     yCenterDiffL = this.draggable.y - yDiff;                                // The L center panel y pos

        //     xCenterDiffR = this.draggable.x + xDiff;                                // The R center panel x pos
        //     yCenterDiffR = this.draggable.y + yDiff;                                // The R center panel y pos
            
        //     count += 2;

        //     let centerLPanel = {x: xCenterDiffL, y: yCenterDiffL};                  // Add the first center left point
        //     noSnapMap.set(`centerLeft${hopCount}`, centerLPanel);

        //     let centerRPanel = {x: xCenterDiffR, y: yCenterDiffR};                  // Add the first center left point
        //     noSnapMap.set(`centerRight${hopCount}`, centerRPanel);
 
        //     hopCount++;

        //     while (count <= numOfPanels) {                                           // Add the side points until done
        //         let xL, yL, xR, yR;
                
        //         xL = xCenterDiffL - (this.panels[0].width * hopCount) * Math.cos(this.radians);
        //         yL = yCenterDiffL - (this.panels[0].width * hopCount) * Math.sin(this.radians);
        //         let panelL = {x: xL, y: yL};
                
        //         xR = xCenterDiffR + (this.panels[0].width * hopCount) * Math.cos(this.radians);
        //         yR = yCenterDiffR + (this.panels[0].width * hopCount) * Math.sin(this.radians);
        //         let panelR = {x: xR, y: yR};
                
        //         count += 2;
                
        //         noSnapMap.set(`left${hopCount}`, panelL);
        //         noSnapMap.set(`right${hopCount}`, panelR);
                
        //         hopCount++;
        //     }
        // }

        // Call this after the movement is complete to re-calculate the possible snappable points
        this.setSnapPointsEven = (otherObj) => {
            if (this.closestSnapArrayObj == null) return;

            let snapMap = this.snapParallelPoints;                                      // Clear the snap points
            let startingNum = snapMap.size;

            let count = 1;                                                              // Used for iterating through the entire panel array
            let hopCount = 0;                                                           // Used to keep track of the panel length starting at the middle
            let numOfPanels = this.panels.length;                                            // Panel width
            let otherArrayNumOfPanels = otherObj.panels.length;         // Total number of panels on the closest array

            // Get the middle snap points from each panel
            let midTopX, midTopY, midBotX, midBotY, midPointX, midPointY, xDiffTandB, yDiffTandB;

            midPointX = otherObj.draggable.x;                                               // Get the center x pos
            midPointY = otherObj.draggable.y;                                               // Get the center y pos

            let angleTopAndBot = parseInt((otherObj.radians * (180 / Math.PI) + 90));       // Get the degrees for top and bottom points
            let radiansTopAndBot = angleTopAndBot * (Math.PI / 180);                    // Convert the degree result into radians (Needed in other sections)

            xDiffTandB = (((this.panels[0].height / 2) + (otherObj.panels[0].height / 2)) * Math.cos(radiansTopAndBot));           // Get the x pos difference in points
			yDiffTandB = (((this.panels[0].height / 2) + (otherObj.panels[0].height / 2)) * Math.sin(radiansTopAndBot));           // Get the y pos difference in points

            midTopX = midPointX - xDiffTandB;                                           // Get the top x and y point
            midTopY = midPointY - yDiffTandB;

            midBotX = midPointX + xDiffTandB;                                           // Get the bottom x and y point
            midBotY = midPointY + yDiffTandB;

            // Middle center point has been obtained, now get the remaining
            while (count <= numOfPanels + otherArrayNumOfPanels) {
                let topLeftX, topLeftY, topRightX, topRightY, bottomLeftX, bottomLeftY, bottomRightX, bottomRightY, xDiff, yDiff;

                xDiff = (((this.panels[0].width / 2) * hopCount) + ((otherObj.panels[0].width / 2) * hopCount)) * Math.cos(otherObj.radians);
                yDiff = (((this.panels[0].width / 2) * hopCount) + ((otherObj.panels[0].width / 2) * hopCount)) * Math.sin(otherObj.radians);

                // Get the top points
                topLeftX = midTopX - xDiff;                     // Top Left
                topLeftY = midTopY - yDiff;

                topRightX = midTopX + xDiff;                    // Top Right
                topRightY = midTopY + yDiff;

                // Get the bottom points
                bottomLeftX = midBotX - xDiff;                  // Bottom Left
                bottomLeftY = midBotY - yDiff;

                bottomRightX = midBotX + xDiff;                 // Bottom Right
                bottomRightY = midBotY + yDiff;

                count += 2;

                snapMap.set(`${startingNum++}`, {x: topLeftX, y: topLeftY});
                snapMap.set(`${startingNum++}`, {x: topRightX, y: topRightY});
                snapMap.set(`${startingNum++}`, {x: bottomLeftX, y: bottomLeftY});
                snapMap.set(`${startingNum++}`, {x: bottomRightX, y: bottomRightY});
                
                hopCount++;
            }
            
            let edgeXDiff, edgeYDiff;

            edgeXDiff = (
                (
                    ( (this.panels[0].width / 2) * numOfPanels) + 
                    ( (otherObj.panels[0].width / 2) * otherArrayNumOfPanels)
                ) * 
                    Math.cos(otherObj.radians)
            );   // The x and y pos difference for trig points
            edgeYDiff = (
                (
                    ( (this.panels[0].width / 2) * numOfPanels) + 
                    ( (otherObj.panels[0].width / 2) * otherArrayNumOfPanels)
                ) * 
                    Math.sin(otherObj.radians)
            );


            // Get the L edge Snap points from the 1st panel
            let topLeftCornerX, topLeftCornerY, bottomLeftCornerX, bottomLeftCornerY, leftEdgeX, leftEdgeY;

            leftEdgeX = midPointX - edgeXDiff;                                              // Get the left edge middle point
            leftEdgeY = midPointY - edgeYDiff;

            topLeftCornerX = leftEdgeX - xDiffTandB;                                        // Get the left edge top corner point
            topLeftCornerY = leftEdgeY - yDiffTandB;

            bottomLeftCornerX = leftEdgeX + xDiffTandB;                                     // Get the left edge bottom corner point
            bottomLeftCornerY = leftEdgeY + yDiffTandB;

            // Add the left side points to the snap map
            snapMap.set(`${startingNum++}`, {x: leftEdgeX, y: leftEdgeY});
            snapMap.set(`${startingNum++}`, {x: topLeftCornerX, y: topLeftCornerY});
            snapMap.set(`${startingNum++}`, {x: bottomLeftCornerX, y: bottomLeftCornerY});


            // Get the R edge Snap points from the 1st panel
            let topRightCornerX, topRightCornerY, bottomRightCornerX, bottomRightCornerY, rightEdgeX, rightEdgeY;

            rightEdgeX = midPointX + edgeXDiff;                                             // Get the right edge middle point
            rightEdgeY = midPointY + edgeYDiff;
            
            topRightCornerX = rightEdgeX - xDiffTandB;                                      // Get the left edge top corner point
            topRightCornerY = rightEdgeY - yDiffTandB;

            bottomRightCornerX = rightEdgeX + xDiffTandB;                                   // Get the left edge bottom corner point
            bottomRightCornerY = rightEdgeY + yDiffTandB;

            // Add the right side points to the snap map
            snapMap.set(`${startingNum++}`, {x: rightEdgeX, y: rightEdgeY});
            snapMap.set(`${startingNum++}`, {x: topRightCornerX, y: topRightCornerY});
            snapMap.set(`${startingNum++}`, {x: bottomRightCornerX, y: bottomRightCornerY});

            // If debugging is needed, use this to place dots around the object.
            // this.redDotThis(snapMap);

            return snapMap;
        }

        		// Call this as soon as dragging starts to re-calculate the possible snappable points
		this.setSnapPointsOdd = (otherObj) => {
			if (this.closestSnapArrayObj == null) return;

			let snapMap = this.snapParallelPoints;                                      // Get the snap points map
			let startingNum = snapMap.size;												// Get the next snap points starting number to continue adding points

			let count = 1;                                                              // Used for iterating through the entire panel array
			let hopCount = 0;                                                           // Used to keep track of the panel length starting at the middle
			let numOfPanels = this.panels.length;                                       // Panel width
			let otherArrayNumOfPanels = otherObj.panels.length;         				// Total number of panels on the other array obj

			// Get the middle snap points from each panel in order to get the two center points
			let midTopX, midTopY, midBotX, midBotY, midPointX, midPointY, xDiffTandB, yDiffTandB;

			midPointX = otherObj.draggable.x;                                           // Get the center x pos
			midPointY = otherObj.draggable.y;                                           // Get the center y pos

			let angleTopAndBot = parseInt((otherObj.radians * (180 / Math.PI) + 90));   // Get the degrees for top and bottom points
			let radiansTopAndBot = angleTopAndBot * (Math.PI / 180);					// Convert the degree result into radians (Needed in other sections)

			xDiffTandB = (((this.panels[0].height / 2) + (otherObj.panels[0].height / 2)) * Math.cos(radiansTopAndBot));           // Get the x pos difference in points
			yDiffTandB = (((this.panels[0].height / 2) + (otherObj.panels[0].height / 2)) * Math.sin(radiansTopAndBot));           // Get the y pos difference in points

			midTopX = midPointX - xDiffTandB;                                           // Get the top x and y point
			midTopY = midPointY - yDiffTandB;

			midBotX = midPointX + xDiffTandB;                                           // Get the bottom x and y point
			midBotY = midPointY + yDiffTandB;

			// Middle center point has been obtained, now get the left and right center middle points
			let partialDiffX, partialDiffY, partialDiffXNeg, partialDiffYNeg;			// Partial diffs are used to offset the left and right central points
			partialDiffX = ((this.panels[0].width / 2) * Math.cos(otherObj.radians));
			partialDiffY = ((this.panels[0].width / 2) * Math.sin(otherObj.radians));

			partialDiffXNeg = ((this.panels[0].width / 2) * Math.cos(otherObj.radians * -1));
			partialDiffYNeg = ((this.panels[0].width / 2) * Math.sin(otherObj.radians * -1));

			let midLeftTopX, midLeftTopY, midLeftBotX, midLeftBotY;						// Get the two central left points
			midLeftTopX = midTopX - partialDiffX;										// Top Left Point
			midLeftTopY = midTopY - partialDiffY;
			midLeftBotX = midBotX - partialDiffXNeg;									// Bottom Left Point
			midLeftBotY = midBotY + partialDiffYNeg;

			let midRightTopX, midRightTopY, midRightBotX, midRightBotY;					// Get the two central right points
			midRightTopX = midTopX + partialDiffXNeg;									// Top Right Point
			midRightTopY = midTopY - partialDiffYNeg;
			midRightBotX = midBotX + partialDiffX;										// Bottom Right Point
			midRightBotY = midBotY + partialDiffY;


			while (count <= numOfPanels + otherArrayNumOfPanels - 1) {
				let topLeftX, topLeftY, topRightX, topRightY, bottomLeftX, bottomLeftY, bottomRightX, bottomRightY;
                let xDiff, yDiff, xDiffNeg, yDiffNeg;
				xDiff = (this.panels[0].width * hopCount) * Math.cos(otherObj.radians);
				yDiff = (this.panels[0].width * hopCount) * Math.sin(otherObj.radians);

				xDiffNeg = (this.panels[0].width * hopCount) * Math.cos(otherObj.radians * -1);
				yDiffNeg = (this.panels[0].width * hopCount) * Math.sin(otherObj.radians * -1);

				// Get the top points
				topLeftX = midLeftTopX - xDiff;                     // Top Left
				topLeftY = midLeftTopY - yDiff;

				topRightX = midRightTopX + xDiffNeg;                   // Top Right
				topRightY = midRightTopY - yDiffNeg;

				// Get the bottom points
				bottomLeftX = midLeftBotX - xDiffNeg;                  // Bottom Left
				bottomLeftY = midLeftBotY + yDiffNeg;

				bottomRightX = midRightBotX + xDiff;                // Bottom Right
				bottomRightY = midRightBotY + yDiff;

				count += 2;

				snapMap.set(`${startingNum++}`, {x: topLeftX, y: topLeftY});
				snapMap.set(`${startingNum++}`, {x: topRightX, y: topRightY});
				snapMap.set(`${startingNum++}`, {x: bottomLeftX, y: bottomLeftY});
				snapMap.set(`${startingNum++}`, {x: bottomRightX, y: bottomRightY});
				
				hopCount++;
			}

			// Get some data to use for point calculations
			let edgeHopDistance = (numOfPanels + otherArrayNumOfPanels) / 2;                // Get the actual disance of the edges point based off the lengths of both the arrays
			
			let edgeXDiff, edgeYDiff;

            // let hypot = (this.panels[0].width * (edgeHopDistance));

			// edgeXDiff = hypot * Math.cos(otherObj.radians);		// The x and y pos difference for trig points
			// edgeYDiff = hypot * Math.sin(otherObj.radians);

            edgeXDiff = ((
                ((this.panels[0].width / 2) * numOfPanels) 
                + ((otherObj.panels[0].width / 2) * otherArrayNumOfPanels))
                * Math.cos(otherObj.radians));   // The x and y pos difference for trig points
            edgeYDiff = ((
                ((this.panels[0].width / 2) * numOfPanels) 
                + ((otherObj.panels[0].width / 2) * otherArrayNumOfPanels))
                * Math.sin(otherObj.radians));


			// Get the L edge Snap points from the 1st panel
			let topLeftCornerX, topLeftCornerY, bottomLeftCornerX, bottomLeftCornerY, leftEdgeX, leftEdgeY;

			leftEdgeX = midPointX - edgeXDiff;                               // Get the left edge middle point
			leftEdgeY = midPointY - edgeYDiff;

			topLeftCornerX = leftEdgeX - xDiffTandB;                                        // Get the left edge top corner point
			topLeftCornerY = leftEdgeY - yDiffTandB;

			bottomLeftCornerX = leftEdgeX + xDiffTandB;                                     // Get the left edge bottom corner point
			bottomLeftCornerY = leftEdgeY + yDiffTandB;

			// Add the left side points to the snap map
			snapMap.set(`${startingNum++}`, {x: leftEdgeX, y: leftEdgeY});
			snapMap.set(`${startingNum++}`, {x: topLeftCornerX, y: topLeftCornerY});
			snapMap.set(`${startingNum++}`, {x: bottomLeftCornerX, y: bottomLeftCornerY});


			// Get the R edge Snap points from the 1st panel
			let topRightCornerX, topRightCornerY, bottomRightCornerX, bottomRightCornerY, rightEdgeX, rightEdgeY;

			rightEdgeX = midPointX + edgeXDiff;                              // Get the right edge middle point
			rightEdgeY = midPointY + edgeYDiff;
			
			topRightCornerX = rightEdgeX - xDiffTandB;                                      // Get the left edge top corner point
			topRightCornerY = rightEdgeY - yDiffTandB;

			bottomRightCornerX = rightEdgeX + xDiffTandB;                                   // Get the left edge bottom corner point
			bottomRightCornerY = rightEdgeY + yDiffTandB;

			// Add the right side points to the snap map
			snapMap.set(`${startingNum++}`, {x: rightEdgeX, y: rightEdgeY});
			snapMap.set(`${startingNum++}`, {x: topRightCornerX, y: topRightCornerY});
			snapMap.set(`${startingNum++}`, {x: bottomRightCornerX, y: bottomRightCornerY});

			return snapMap;
		}

        this.getClosestRotationSnap = () => {
            let currentTargetAngle = this.closestSnapArrayObj.degrees;          // The target-to-be-snapped-to's rotation/angle in degrees
            let right = clamp360Degree(currentTargetAngle + 90);                // The right rotation snap point based off the above target's
            let bottom = clamp360Degree(currentTargetAngle + 180);              // The bottom rotation snap point
            let left = clamp360Degree(currentTargetAngle + 270);                // The left rotation snap point

            let rotationAngles = [currentTargetAngle, right, bottom, left];     // Place in array to iterate

            let shortestDiff;                                                   // The soon to be, closest rotational snap point
            let diffInLength;                                                   // The difference between the rotational angles and self
            let isPerpendicular;                                                // If self's closest rotational snap point (shortestDiff) is perpendicular to the target snap panel

            let snapRotationResult;                                             // The final result of this logic, this is the angle to which self should snap to.

            rotationAngles.forEach(angle => {
                if (shortestDiff == null) {                                     // Get a value to start with
                    shortestDiff = angle;
                }
                diffInLength = (angle - this.degrees + 180 + 360) % 360 - 180;  // Calculate distance differences on a 180/-180 circle rather than a 360

                if (diffInLength > -45 && diffInLength < 45) {                  // If the difference is with 45 degrees, that rotational snap point is the closest
                    shortestDiff = diffInLength;
                    snapRotationResult = angle;
                }
            });

            if (snapRotationResult === right || snapRotationResult === left) {  // If the rotational angle is left or right, it's perpendicular to the target panel
                isPerpendicular = true;                                         // Set isPerpendicular to true for future snap point checks
            } else {
                isPerpendicular = false;                                        // If the closest rotational snap point isn't left or right, it's parallel.
            }

            return {snapRotationResult: snapRotationResult, isPerpendicular: isPerpendicular};
        }


        // /////////////////////////////////
        //
        // General Panel Array Class Methods
        //
        // /////////////////////////////////

        this.addPanelToSide = (dir) => {
            this.shiftSide(dir);

            let dimensions = this.getPixelPerPanel();
            this.panelHeight = dimensions.height;
            this.panelWidth = dimensions.width;

            let type = this.type;

            switch (type) {
                case "water":
                    this.panelObj = new WaterPanel(this.panelHeight, this.panelWidth, this.arrayNum);
                    break;
                case "solar":
                    this.panelObj = new SolarPanel(this.panelHeight, this.panelWidth, this.arrayNum);
                    break;

    			// New panel versions here
                case "solarV2":
                    this.panelObj = new SolarPanelV2(this.panelHeight, this.panelWidth, this.arrayNum);
                    break;
    			// New panel versions here

                case 'existing':
                    this.panelObj = new ExistingPanel(this.panelHeight, this.panelWidth, this.arrayNum);
                    break;
            } 

            this.panelObj.panelElement.opacity = this.opacity;
            this.panelObj.panelElement.style.opacity = `${this.opacity * 10}%`;
            
            if (dir == "left") {
                // If left, add the panel to the start with prepend (left side)
                this.panels.unshift(this.panelObj);
                this.panelHolderElement.prepend(this.panelObj.panelElement);
            } else if (dir == "right") {
                // If going right, add the panel to the end of the array with append (right side)
                this.panels.push(this.panelObj);
                this.panelHolderElement.append(this.panelObj.panelElement);
            }

            this.unshiftSide(dir);

            return this.panelObj;
        }

        this.addNewPanel = () => {
            let dimensions = this.getPixelPerPanel();
            this.panelHeight = dimensions.height;
            this.panelWidth = dimensions.width;

            let tempX = new Number(this.draggable.x);
            let tempY = new Number(this.draggable.y);



            let type = this.type;

            switch (type) {
                case "water":
                    this.panelObj = new WaterPanel(this.panelHeight, this.panelWidth, this.arrayNum, this);
                    break;
                case "solar":
                    this.panelObj = new SolarPanel(this.panelHeight, this.panelWidth, this.arrayNum, this);
                    break;

			    // New panel versions here
                case "solarV2":
                    this.panelObj = new SolarPanelV2(this.panelHeight, this.panelWidth, this.arrayNum, this);
                    break;
			    // New panel versions here
                
                case 'existing':
                    this.panelObj = new ExistingPanel(this.panelHeight, this.panelWidth, this.arrayNum, this);
                    break;
            }

            this.panelObj.panelElement.opacity = this.opacity;
            this.panelObj.panelElement.style.opacity = `${this.opacity * 10}%`;
            this.panelHolderElement.append(this.panelObj.panelElement);

            gsap.set(this.masterElement, {x: tempX, y: tempY})

            this.panels.push(this.panelObj);

            return this.panelObj;
        }

        // Updates the Panels inner text to reflect its current array group number
        this.updatePanelText = () => {
            this.panels.forEach(panel => {
                panel.panelText.textContent = this.arrayNum;
            });
        }

        // Updates the GUI for the respective object
        this.activateGUI = () => {
            // Turn off all holders to cover all bases
            GUIHolder.hideTheseHolders(toolRelatedHolders);

            // Show all relevant holders
            snappingHolderObj.showHolder();
            pitchHolderObj.showHolder();
            shadingHolderObj.showHolder();
            groupNumberHolderObj.showHolder();
            colorHolderObj.showHolder();

            // Activate all relevant
            snappingHolderObj.activate(this);
            pitchHolderObj.activate(this);
            shadingHolderObj.activate(this);
            groupNumberHolderObj.activate(this);
            colorHolderObj.activate(this);
            this.setColorHolderColor()

            if (this.type == "water") {
                colorHolderObj.deactivate();
                colorHolderObj.hideHolder();
            }
            else if (this.type == "existing") {
                colorHolderObj.deactivate();
                groupNumberHolderObj.deactivate()
                shadingHolderObj.deactivate();

                colorHolderObj.hideHolder();
                groupNumberHolderObj.hideHolder();
                shadingHolderObj.hideHolder();
            }
        }

        // Adds a specified number to each panel's shading
        this.addShading = (shading) => {
            this.panels.forEach(panel => {
                panel.shading += shading;
            });

            let totalShading = Panel.getAverageShadingFromSingles();
            shadingHolderObj.shadingField.value = `${totalShading}%`;
        }
        
        // Get the total number of solar panels that share the same array number
        this.getTotalPanelsNum = () => {
            let map = saveObj.allObjs.get("panels").get(this.type);
            let num = 0;
            
            map.forEach(array => {
                if (array.arrayNum == this.arrayNum) {
                    num += array.panels.length;
                }
            });

            return num;
        }

        // Get the average shading % from every panel in THIS array
        this.getAverageShading = () => {
            let shading = 0.0;

            // Parse shading as floats to ensure no str's
            this.panels.forEach(panel => {
                shading += parseFloat(panel.shading);
            });

            let val = shading / this.panels.length;

            // Return the shading as a fixed string
            return val.toFixed(1);
        }

        // Get the average shading % from every panel in the array and other arrays that have the same number
        this.getCompleteAverageShading = () => {
            // So far I haven't even called this function once.
                // It could have been used in the save class, but it doesn't track rotation
                // thus I haven't used it.
            // console.log("Called getComplete...");
            let shading = 0.0;
            let count = 0;

            saveObj.allObjs.get("panels").get(this.type).forEach(array => {
                if (array.arrayNum == this.arrayNum) {
                    array.panels.forEach(panel => {
                        // Be sure to parse float each time
                        shading += parseFloat(panel.shading);
                        count++;
                    });
                }
            });

            // return as fixed str
            return (shading / count).toFixed(1);
        }

        // Get the average shading of this array only, regardless of number
        this.getAvgShadingSelf = () => {
            let shading = 0.0;
            let count = 0;

            this.panels.forEach(panel => {
                // be sure to parse float each time
                shading += parseFloat(panel.shading);
                count++;
            });

            // return fixed str
            return (shading / count).toFixed(1);
        }

        // Simply returns the parent div for universal access
        this.getMainDivElement = () => {
            return this.masterElement;
        }

        // Get the pixel size per panel based on the google map geo-location info
        this.getPixelPerPanel = () => {
            // Get meters per pixel
            let meterPerPx = getMeterPerPixel();
        
            // Get the panel height according to the pitch degree
            let panelHeight = this.pitchReference[this.orientation][parseInt(this.pitch)];
        
            // Calculate the px/height
            let panelPxHeight = panelHeight / meterPerPx;
        
            // Get the panel width
            let panelWidth = this.panelDimensions[this.orientation].width;
        
            // Calc the px/width
            let panelPxWidth = panelWidth / meterPerPx;
        
            // Put the results in a JSON
            let panelPxDimensions = {
                height: panelPxHeight,
                width: panelPxWidth,
            };
        
            // return the JSON
            return panelPxDimensions;
        }

        // Handle the logic for multiple clicks on a target
        this.handleState = () => {
            this.glowOn();

            if (this.stateNum == 0) { // State 0, show nothing, just hightlight panel
                DupeArrow.hideAllArrows(this.allArrows);

                // this.arrowTopObj.element.style.display = 'block';
                this.spinKnobObj.hideTool();
                // this.spinKnobObj.element.style.display = "none";
                this.stateNum++;
            }
            else if (this.stateNum == 1) { // State 1, show dupe arrows
                DupeArrow.showAllArrows(this.allArrows);

                // this.arrowTopObj.element.style.display = 'block';
                this.spinKnobObj.hideTool();
                // this.spinKnobObj.element.style.display = "none";
                this.stateNum++;
            }
            else if (this.stateNum == 2) {
                DupeArrow.hideAllArrows(this.allArrows);

                // this.arrowTopObj.element.style.display = "none";
                this.spinKnobObj.showTool();
                this.spinKnobObj.element.style.display = 'block';
                this.stateNum = 0;
            }
        }

        // Reset the state logic back to 0
        this.resetState = () => {
            this.spinKnobObj.hideTool();
            DupeArrow.hideAllArrows(this.allArrows);
            this.stateNum = 0;
            GUIHolder.turnOffTheseHolders(panelRelatedHolders);
        }

        // Remove a panel based on the entered direction
        this.removePanelFromSide = (dir) => {
            if (this.panels.length < 2) return;
            this.shiftSide(dir);

            let dimensions = this.getPixelPerPanel();
            this.panelHeight = dimensions.height;
            this.panelWidth = dimensions.width;

            // Remove the panel
            if (dir == "left") {
                // If left side, remove the first panel (left)
                let panelToDelete = this.panels[0];
                panelToDelete.panelElement.remove();
                this.panels.shift();
            } else if (dir == "right") {
                // If right side, remove the last panel (right)
                let lastPanelToDelete = this.panels[this.panels.length - 1];
                lastPanelToDelete.panelElement.remove();
                this.panels.splice(-1, 1);
            }

            // Active the holders to update the information
            groupNumberHolderObj.activate(this);
            groupNumberHolderObj.panelsInSection.setTextContent(this.panels.length);

            this.unshiftSide(dir);
        }

        this.setArrayNum = (num) => {
            this.arrayNum = num;
        }

        // Sets this obj's duplication arrows height
        this.setArrowDimensions = (newHeight) => {
            this.arrowLeftObj.setHeight(newHeight);
            this.arrowLeftObj.setWidth(newHeight);
            
            this.arrowRightObj.setHeight(newHeight);
            this.arrowRightObj.setWidth(newHeight);
        }
        
        this.setColor = (color) => {
            this.panels.forEach(panel => {
                panel.setColor(color);
            });
        }

        // Set the color holder object's 4th color to what ever is set below
        this.setColorHolderColor = () => {
            colorHolderObj.setYellow()
        }
        
        this.setDegrees = (degrees) => {
            this.degrees = degrees;
            this.radians = degreeToRadian(degrees);
            this.rotateObject();
        }
        
        this.setIsSnappedTogether = (snapped) => {
            this.isSnappedTogether = snapped;
        }
        
        this.setOpacity = (opacity) => {
            this.opacity = opacity;
            this.panels.forEach(panel => {
                panel.getMainDivElement().style.opacity = `${opacity * 10}%`;
            });
        }
        
        // Set how tall the panels are in 2D in relation to the pitch/angle of their 3D appearance
        this.setPitch = (pitch) => {
            this.pitch = pitch;
            this.updateDimensions();
        }

        // // Get the offset minus the spin knob space in %
        // this.getRotationCenter = () => {
        //     alert("Keep me");
        //     let total = 30 + this.panelObj.height;                          // Spin Height: 25 + Padding: 5 + Self Height
        //     let halfSelf = (this.panelObj.height) / 2;                      // Half of self's height (where the center point should be)
        //     let diff = total - halfSelf;                                    // The total amount of space above the center point
        //     let ratio = (diff / total) * 100;

        //     return ratio;
        // }

        // Set the origin point for rotations
        this.setRotationCenter = () => {
            let total = 30 + this.panels[0].height;                          // Spin Height: 25 + Padding: 5 + Self Height
            let halfSelf = (this.panels[0].height) / 2;                      // Half of self's height (where the center point should be)
            let diff = total - halfSelf;                                    // The total amount of space above the center point
            let ratio = (diff / total) * 100;

            gsap.set(this.masterElement, {transformOrigin: `50% ${ratio}%`});
        }

        // Set's the shading of each individual sub panel
        this.setShading = (shading) => {
            this.panels.forEach(panel => {
                panel.shading = shading;
                panel.setShading(shading);
            });

            shadingHolderObj.shadingField.value = `${this.getAverageShading()}%`
        }
        
        this.setSnapping = (snapping) => {
            this.snapping = snapping;
        }

        // Toggles the current orientation to the 2nd option (Portrait or Landscape)
        this.toggleOrientation = () => {
            if (this.orientation == "portrait") {
                this.orientation = "landscape";
                lastOrientation = "landscape";
            }
            else if (this.orientation == "landscape") {
                this.orientation = "portrait";
                lastOrientation = "portrait";
            }
            this.updateDimensions();
            this.setRotationCenter();
            this.updateCenterOfObj();
        }

        // Adjust the panel array to meet the new dimensions
        this.updateDimensions = () => {
            let result = this.getPixelPerPanel();
            this.panels.forEach(panel => {
                panel.height = result.height;
                panel.width = result.width;
    
                panel.panelElement.style.height = `${result.height}px`;
                panel.panelElement.style.width = `${result.width}px`;
            });

            this.setArrowDimensions(result.height);
        }

        

        // //////////////////////////////////
        //
        // Panel Array Class Reference Info
        //
        // //////////////////////////////////

        // The possible pitch options for panels and their respective length
        this.pitchReference = {
            "landscape": {
                10: 1.02557,                                // 10 degree pitch turns a 1.0414 meter wide panel into 1.71346 meters
                20: 0.97859,                                // 20 degree pitch turns a 1.0414 meter wide panel into 1.63497 meters
                40: 0.79775,                                // 40 degree pitch turns a 1.0414 meter wide panel into 1.33284 meters
            },
            "portrait": {
                10: 1.71346,                                // 10 degree pitch turns a 1.7399 meter tall panel into 1.71346 meters
                20: 1.63497,                                // 20 degree pitch turns a 1.7399 meter tall panel into 1.63497 meters 
                40: 1.33284,                                // 40 degree pitch turns a 1.7399 meter tall panel into 1.33284 meters
            },
        };

        // A standard panel's dimensions
        this.panelDimensions = {
            "portrait": {
                height: 1.7399,                                 // 68.5" or 1.7399 meters (meters will be the unit of measurement for my math)
                width: 1.0414                                   // 41.0" or 1.0414 meters
            },
            "landscape": {
                width: 1.7399,                                  // 41.0" or 1.0414 meters
                height: 1.0414                                  // 68.5" or 1.7399 meters (meters will be the unit of measurement for my math)
            },
        };

        
        // Create the first / primary panel[0]
        // Get the current size a panel should be
        this.addNewPanel();

        this.rotateObject();                                                // Rotate the object after it's creation
        this.setRotationCenter();                                           // Set the proper center point for rotations
        this.updateCenterOfObj();
        this.moveObjTo(x, y);                                               // Move the object to its new location
        this.closestSnapArrayObj = this.findClosestPanelArray();            // Call on creation in order to snap immediately

        

        // //////////////////////////////////
        //
        // Debugging methods
        //
        // //////////////////////////////////

        // Holds all the snap point elements in case I make a func to del them
        this.snapPointMarkers = [];

        // Make small little red dots on the self snap points
        this.redDotSelf = () => {

            this.updateSnapPoints();

            // for (let z = 0; z < saveObj.allObjs.get("panels").size; z++) {
            //     let target = saveObj.allObjs.get("panels").get("solar")[z];
            //     console.log(target.snapPointMarkers);
            //     for (let i = 0; i < target.snapPointMarkers.length; i++) {
            //         target.snapPointMarkers[i].removeElement()
            //     }
            // }

            for (let i = 0; i < this.snapPointMarkers.length; i++) {
                this.snapPointMarkers[i].remove();
            }
            

            for (let i = 0; i < this.snapParallelPoints.size; i++) {
                let x = this.snapParallelPoints.get(`${i}`)["x"];
                let y = this.snapParallelPoints.get(`${i}`)["y"];

                let elm = document.createElement("div");
                elm.style.height = "2px";
                elm.style.width = "2px";
                elm.style.position = "absolute";
                elm.style.backgroundColor = "red";

                gsap.set(elm, {x: x, y: y});

                map.appendChild(elm);
                this.snapPointMarkers.push(elm);
            }
        }

        this.redDotThis = (thisMap) => {
            for (let i = 0; i < this.snapPointMarkers.length; i++) {
                this.snapPointMarkers[i].remove();
            }
            

            for (let i = 0; i < thisMap.size; i++) {
                let x = thisMap.get(`${i}`)["x"];
                let y = thisMap.get(`${i}`)["y"];

                let elm = document.createElement("div");
                elm.style.height = "2px";
                elm.style.width = "2px";
                elm.style.position = "absolute";
                elm.style.backgroundColor = "red";

                gsap.set(elm, {x: x, y: y});

                map.appendChild(elm);
                this.snapPointMarkers.push(elm);
            }
        }



        // ///////////////////////////////////////////////////////////////////
        // 
        // While there is no top and bottom support, this function is disabled
        //
        // ///////////////////////////////////////////////////////////////////

        // Set the duplication arrows of the array to be horizontal, vertical, or both
        // this.setArrayAxis = (axis) => {
        //     if (axis == 'horizontal') {
        //         this.arrowTopObj.status = 'disabled';                       // Set the top and bottom arrows to disabled
        //         this.arrowBottomObj.status = 'disabled';
        //         this.arrowTopObj.element.visibility = 'hidden';             // Hide the top and bottom arrows from view and render
        //         this.arrowBottomObj.element.visibility = 'hidden';

        //         this.arrowLeftObj.status = 'enabled';                       // Set the left and right arrows' status to enabled
        //         this.arrowRightObj.status = 'enabled';                      // No need to show the element right now
        //     }

        //     if (axis == 'vertical') {
        //         this.arrowLeftObj.status = 'disabled';                      // Set the left and right arrows to disabled
        //         this.arrowRightObj.status = 'disabled';
        //         this.arrowLeftObj.element.visibility = 'hidden';            // Hide the left and right arrows from view and render
        //         this.arrowRightObj.element.visibility = 'hidden';

        //         this.arrowTopObj.status = 'enabled';                        // Set the left and right arrows' status to enabled
        //         this.arrowBottomObj.status = 'enabled';                     // No need to show the element right now

        //     }

        //     if (axis == 'primary') {
        //         this.arrowTopObj.status = 'enabled';                        // Set the all arrows to enabled
        //         this.arrowBottomObj.status = 'enabled';
        //         this.arrowLeftObj.status = 'enabled';
        //         this.arrowRightObj.status = 'enabled';

        //     }
        // }


        // ////////////////
        //
        // Object Listeners
        //
        // ////////////////

        // Listen for mouse downs outside of the object
        // $(map).on("mousedown", () => {
        //     this.deactivate();
        // });
    }

    
    // ////////////////////////////////
    //
    // Panel Array Class Static Methods
    //
    // ////////////////////////////////

    static createNewSingleArray(type, event) {
        let panelArray = "";
        if (type == "solar" || type == "existing" || type == "water") panelArray = new PanelArrayClass(Item.uniqueID++, type, 0, -525, lastPanelDegrees);
        
        // New panel versions here
        else if (type == "solarV2") panelArray = new PanelArrayClassV2(Item.uniqueID++, type, 0, -525, lastPanelDegrees);
        // New panel versions here

        panelArray.addNewPanel();
        panelArray.addNewPanel();
        panelArray.draggable.startDrag(event);
    }

    static disableAllArrays() {
        saveObj.allObjs.get("panels").get("solar").forEach(array => {
            array.draggable.disable();
        });

        // New panel versions here
        saveObj.allObjs.get("panels").get("solarV2").forEach(array => {
            array.draggable.disable();
        });
        // New panel versions here

        saveObj.allObjs.get("panels").get("water").forEach(array => {
            array.draggable.disable();
        });
        saveObj.allObjs.get("panels").get('existing').forEach(array => {
            array.draggable.disable();
        });
    }

    static enableAllArrays() {
        saveObj.allObjs.get("panels").get("solar").forEach(array => {
            array.draggable.enable();
        });

        // New panel versions here
        saveObj.allObjs.get("panels").get("solarV2").forEach(array => {
            array.draggable.enable();
        });
        // New panel versions here

        saveObj.allObjs.get("panels").get("water").forEach(array => {
            array.draggable.enable();
        });
        saveObj.allObjs.get("panels").get('existing').forEach(array => {
            array.draggable.enable();
        });
    }
}
