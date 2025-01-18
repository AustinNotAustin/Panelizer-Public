// Author: Austin C Arledge Sr (austin.c.arledge@gmail.com) 21 Jul 22

var savedText;
var isOkayToSend = 0;				// Used to prevent the sending of data prior to drawing content (0 and 1 is no, 2 is yes)

class SaveClass {
    constructor() {
        this.staticImg;
        this.allObjs;
        this.saveObj;
		this.sendSaveAttempt = 0;

        this.initMap = () => {
            this.allObjs = new Map();
            let panelMap = new Map();
            let obstacleMap = new Map();
			let markingMap = new Map();

            panelMap.set("solar", []);

			// New panel versions here
            panelMap.set("solarV2", []);
			// New panel versions here

            panelMap.set("water", []);
            panelMap.set("existing", []);

            obstacleMap.set("circle", []);
            obstacleMap.set("square", []);

			markingMap.set("meter", []);
			markingMap.set("pen", []);
			markingMap.set("free-text", []);

            this.allObjs.set("markings", markingMap);
            this.allObjs.set("panels", panelMap);
            this.allObjs.set("obstacles", obstacleMap);
        }

        this.initSaveMap = () => {
            this.saveMap = {
				settings: {
					zoomLevel: 0,
					coordinates: {
						lat: 0,
						lng: 0
					},
					panels: {
						solar: [],
						
						// New panel versions here
						solarV2: [],
						// New panel versions here
						
						water: [],
						existing: []
					},
					obstacles: {
						circle: [],
						square: []
					},
					markings: {
						meter: [],
						pen: [],
						text: []
					}
				},
				calculations: {}
            };
        }

        this.initMap();                                         // Init the save map to start

        this.populateSaveFile = () => {                         // Set up the saveFile map properly for saving

			// 1. Initialize the save map object with appropriate fields
			// 2. Add all of the obstacle's data to the saveMap
			// 3. Add all of the panel array's data to the saveMap
			// 4. Add all of the marking's data to the saveMap
			// 5. Add the lat and long coords
			// 6. Add the zoom level


			// 1. Save Map
			this.initSaveMap();


			// 2. Obstacles

            let counter = 0;
            // Get circle obstacle data
            this.allObjs.get("obstacles").get("circle").forEach(circle => {
                let values = {
                    color: circle.color,
                    opacity: circle.opacity,
                    scale: circle.scale,
                    uniqueID: circle.uniqueID,

                    x: circle.draggable.x,
                    y: circle.draggable.y
                }

                this.saveMap.settings.obstacles.circle[counter] = values;

                counter++;
            });

            // Get square obstacle data
            counter = 0;        // Reset counter on each iteration
            this.allObjs.get("obstacles").get("square").forEach(square => {
                let values = {
                    color: square.color,
                    opacity: square.opacity,
                    scale: square.scale,
                    uniqueID: square.uniqueID,
                    degrees: square.degrees,

                    x: square.draggable.x,
                    y: square.draggable.y
                }

                this.saveMap.settings.obstacles.square[counter] = values;

                counter++;
            });


			// 3. Panel Arrays

            // Get solar array data
            counter = 0;        // Reset counter on each iteration
            this.allObjs.get("panels").get("solar").forEach(array => {
                let values = this.populateTargetArray(array);

                this.saveMap.settings.panels.solar[counter] = values;

                counter++;
            });
			
			// New panel versions here
			
			// 3a. Panel Arrays V2

            // Get solar array data
            counter = 0;        // Reset counter on each iteration
            this.allObjs.get("panels").get("solarV2").forEach(array => {
                let values = this.populateTargetArray(array);

                this.saveMap.settings.panels.solarV2[counter] = values;

                counter++;
            });
			// New panel versions here

            // Get water array data
            counter = 0;        // Reset counter on each iteration
            this.allObjs.get("panels").get("water").forEach(array => {
                let values = this.populateTargetArray(array);

                this.saveMap.settings.panels.water[counter] = values;

                counter++;
            });

            // Get existing array data
            counter = 0;        // Reset counter on each iteration
            this.allObjs.get("panels").get("existing").forEach(array => {
                let values = this.populateTargetArray(array);

                this.saveMap.settings.panels.existing[counter] = values;

                counter++;
            });


			// 4. Markings

			// Get the meters
			counter = 0;
			this.allObjs.get("markings").get("meter").forEach(meter => {
				let values = {
                    color: meter.arrowColor,
					reverse: meter.arrowReverse,
					direction: meter.dir,
                    opacity: meter.opacity,
                    scale: meter.scale,
                    uniqueID: meter.uniqueID,
                    degrees: meter.degrees,

                    x: meter.draggable.x,
                    y: meter.draggable.y
				}

				this.saveMap.settings.markings.meter[counter++] = values;
			});

			// Get the pen drawings
			counter = 0;
			if (this.allObjs.get("markings").get("pen").length < 1) {
            	this.allObjs.get("markings").get("pen").push(penObj);		// Re-add the object to the map, since init cleared it
			}
			let tempObj = this.allObjs.get("markings").get("pen");
			tempObj.forEach(obj => {
				let tempVals = {
					color: obj.color,
					opacity: obj.opacity,
					scale: obj.scale,
					uniqueID: obj.uniqueID,
					steps: obj.steps
				}
				this.saveMap.settings.markings.pen[counter++] = tempVals;
			});

			// Get the text
			counter = 0;
			this.allObjs.get("markings").get("free-text").forEach(text => {
				let values = {
                    color: text.color,
                    opacity: text.opacity,
                    scale: text.scale,
                    uniqueID: text.uniqueID,
                    degrees: text.degrees,
					text: text.inputElement.innerHTML,

                    x: text.draggable.x,
                    y: text.draggable.y
				}

				this.saveMap.settings.markings.text[counter++] = values;
			});


			// 5. Lat and Long coords
			this.saveMap.settings.coordinates.lat = googleMap.getCenter().lat();
			this.saveMap.settings.coordinates.lng = googleMap.getCenter().lng();


			// 6. Zoom Level
			this.saveMap.settings.zoomLevel = zoomLevel;
        }


        // Helper function to build the save object for any array
        this.populateTargetArray = (array) => {
            let panels = [];
            let panelCounter = 0;

            array.panels.forEach(panel => {
                let values = {
                    shading: panel.shading,
                    height: panel.height,
                    width: panel.width,
                    panelNum : panel.panelNum,
                    color: panel.color,
                }

                panels[panelCounter] = values;
                panelCounter++;
            });

            let values = {
                opacity: array.opacity,
				orientation: array.orientation,
                degrees: array.degrees,
                pitch: array.pitch,
                arrayNum: array.arrayNum,
                uniqueNum: array.uniqueNum,
                snapping: array.snapping,
                isSnappedTogether: array.isSnappedTogether,

                panels: panels,

                x: array.draggable.x,
                y: array.draggable.y
            }

            return values;
        }

        this.saveToFile = () => {
            this.populateSaveFile();

            var blob = new Blob([JSON.stringify(this.saveMap, null, 2)], {type: "application/json;charset=utf-8"}).slice(2,-1);
            var url = URL.createObjectURL(blob);
            var elem = document.createElement("a");
            elem.href = url;
            elem.download = 'test';
            document.body.appendChild(elem);
            elem.click();
            document.body.removeChild(elem);
        }

		// Delete every item from the save object and remove it from the document
		this.deleteAllItems = () => {

			// 1. Remove every item from the DOM
			// 2. Reset the allObjs property (clear it)
			// 3. Reset the active items obj (clear it)

			// 1.

			// Delete solar objs
			this.allObjs.get("panels").get("solar").forEach(array => {
				array.getMainDivElement().remove();
			});
			
			// 11.

			// New panel versions here
			// Delete solar objs
			this.allObjs.get("panels").get("solarV2").forEach(array => {
				array.getMainDivElement().remove();
			});
			// New panel versions here


			// Delete existing objs
			this.allObjs.get("panels").get("existing").forEach(array => {
				array.getMainDivElement().remove();
			});

			// Delete water objs
			this.allObjs.get("panels").get("water").forEach(array => {
				array.getMainDivElement().remove();
			});

			// Delete circle objs
			this.allObjs.get("obstacles").get("circle").forEach(obstacle => {
				obstacle.getMainDivElement().remove();
			});

			// Delete square objs
			this.allObjs.get("obstacles").get("square").forEach(obstacle => {
				obstacle.getMainDivElement().remove();
			});

			// Delete meter objs
			this.allObjs.get("markings").get("meter").forEach(meter => {
				meter.getMainDivElement().remove();
			});

			// Delete Free Text objs
			this.allObjs.get("markings").get("free-text").forEach(text => {
				text.getMainDivElement().remove();
			});

			// Clear the pen markings
			penObj.deleteSelf();


			// 2.
			this.initMap();


			// 3.
			activeItemsObj.items = [];
			activeItemsObj.isSinglePanels = false;
		}

		// Disables all draggable items
		this.disableAllItems = () => {
			// Disable solar objs
			this.allObjs.get("panels").get("solar").forEach(array => {
				array.draggable.disable();
			});
			
			// New panel versions here
			// Disable solar objs V2
			this.allObjs.get("panels").get("solarV2").forEach(array => {
				array.draggable.disable();
			});
			// New panel versions here

			// Disable existing objs
			this.allObjs.get("panels").get("existing").forEach(array => {
				array.draggable.disable();
			});

			// Disable water objs
			this.allObjs.get("panels").get("water").forEach(array => {
				array.draggable.disable();
			});

			// Disable circle objs
			this.allObjs.get("obstacles").get("circle").forEach(obstacle => {
				obstacle.draggable.disable();
			});

			// Disable square objs
			this.allObjs.get("obstacles").get("square").forEach(obstacle => {
				obstacle.draggable.disable();
			});

			// Disable meter objs
			this.allObjs.get("markings").get("meter").forEach(meter => {
				meter.draggable.disable();
			});

			// Disable Free Text objs
			this.allObjs.get("markings").get("free-text").forEach(text => {
				text.draggable.enable();
			});
		}

		// Enables all draggable items
		this.enableAllItems = () => {
			// Enable solar objs
			this.allObjs.get("panels").get("solar").forEach(array => {
				array.draggable.enable();
			});
			
			// New panel versions here
			// Enable solarV2 objs
			this.allObjs.get("panels").get("solarV2").forEach(array => {
				array.draggable.enable();
			});
			// New panel versions here

			// Enable existing objs
			this.allObjs.get("panels").get("existing").forEach(array => {
				array.draggable.enable();
			});

			// Enable water objs
			this.allObjs.get("panels").get("water").forEach(array => {
				array.draggable.enable();
			});

			// Enable circle objs
			this.allObjs.get("obstacles").get("circle").forEach(obstacle => {
				obstacle.draggable.enable();
			});

			// Enable square objs
			this.allObjs.get("obstacles").get("square").forEach(obstacle => {
				obstacle.draggable.enable();
			});

			// Enable meter objs
			this.allObjs.get("markings").get("meter").forEach(meter => {
				meter.draggable.enable();
			});

			// Enable Free Text objs
			this.allObjs.get("markings").get("free-text").forEach(text => {
				text.draggable.enable();
			});
		}

		// Recursive function that attempts to send a save file after waiting some time
		this.sendSaveWhenReady = () => {
			if (isOkayToSend < 2 && this.sendSaveAttempt < 1000) {
				// If isOkayToSave is still false, wait 100 ms and try again
				setTimeout(() => {
					this.sendSaveAttempt++
					this.sendSaveWhenReady()
				}, 100);
			}
			else if (this.sendSaveAttempt >= 1000) {
				alert("Error!\nWe have tried to send your data 1000 times unsuccessfully.\n\nPlease check your internet connection, refresh, and try again.");
			}
			else if (isOkayToSend >= 2) {
				isOkayToSend = 0;
				this.sendSave()
			}
		}

		// Send the save file to the url via
		this.sendSave = () => {

			activeItemsObj.clearActiveItems();

			let cleanImg = document.getElementById("clean-img-file");
			let dirtyImg = document.getElementById("dirty-img-file");

			let cleanImgURL = cleanImg.toDataURL('image/jpeg', 1.0);
			let dirtyImgURL = dirtyImg.toDataURL("image/jpeg", 1.0);

			let pl_ImageSource = $("#dirty-img-file").text();

			// Populate the data in saveMap as a JSON, prior to sending
			this.populateSaveFile();
			let calcData = getCalcData();
			this.saveMap.calculations = calcData;

			// Send via AJAX
			$.ajax({
				url: kh_BaseUrl + "pl_PostSettings",
				type: "GET",
				data: {
					kh_UserName: kh_UserName,
					rp_Key: rp_Key,
					pl_Settings: JSON.stringify(this.saveMap),
					pl_ImageSource: pl_ImageSource,
					inspectionDataURL: cleanImgURL,
					proposalDataURL: dirtyImgURL
				},
				dataType: "jsonp",
				jsonpCallback: "jsonpCallback",
				crossDomain: true,
				success: function (data, status, xhr) {
					showSuccessfulSaveModal();
				},
				error: function (responseData, textStatus, errorThrown) {
					alert("There was an error while attempting to send/save the data!\n\n" +
							"Please check your internet connection and try again.\n\n" +
							"If the error persists, refresh the page and try again.\n\n" +
							"If the error still persists, contact the administrator with this error: \n\n"
							+ `Error: ${JSON.stringify(responseData)}`);
				}
			});
		}
    }

    // Generates content from a save file
    static loadSave = (file) => {
		try {
			// The url for this image doesn't have the 4daction/ folder, fixing it now
			let trimmedUrl = kh_BaseUrl.split("4daction/")[0];

			// PAD THE PROJECT NUMBER
			var paddedKey = "0000000000" + rp_Key;
			var $rp_Key = paddedKey.substring(paddedKey.length-5);

			// Load the img from the server, and place it on the map-img src
			let url = `${trimmedUrl}installations/${$rp_Key}/inspection.jpg`;
			$("#map-img").attr("src", url);
		} catch (err) {
			alert("There was an error loading the image from the server!\n\n" +
			"Please refresh and try again\n\n" +
			"If the error persists, contact the administrator with this error:\n\n" + err);
		}

        try {
			// Set the zoom level to spawn objects in
			zoomLevel = file.settings.zoomLevel;
			zoomHolderObj.handleZoomBtns();

            // Set the circle obstacle data
            file.settings.obstacles.circle.forEach(circle => {
                // Make new circle object
                let obj = new Obstacle("circle", null);

                // Set the circle values
                obj.setColor(circle.color);
                obj.setOpacity(circle.opacity);
                obj.setScale(circle.scale);
                obj.setID(circle.uniqueID);
                obj.moveObjTo(circle.x, circle.y);
            });

            file.settings.obstacles.square.forEach(square => {
                // Make new square object
                let obj = new Obstacle("square", null);

                // Set the square values
                obj.setColor(square.color);
                obj.setDegrees(square.degrees);         // Only difference between squares and circles are the degrees
                obj.setOpacity(square.opacity);
                obj.setScale(square.scale);
                obj.setID(square.uniqueID);
                obj.moveObjTo(square.x, square.y);
				obj.clearState();
            });

            file.settings.panels.solar.forEach(array => {
                SaveClass.loadSaveHelper(array, "solar");
            });
            
			// New panel versions here
			file.settings.panels.solarV2.forEach(array => {
                SaveClass.loadSaveHelper(array, "solarV2");
            });
			// New panel versions here

            file.settings.panels.water.forEach(array => {
                SaveClass.loadSaveHelper(array, "water");
            });

            file.settings.panels.existing.forEach(array => {
                SaveClass.loadSaveHelper(array, "existing");
            });

			file.settings.markings.meter.forEach(meter => {
				let obj = new Meter(meter.x, meter.y);

				obj.arrowReverse = meter.reverse;
				obj.dir = meter.direction;
				obj.setColor(meter.color);
				obj.setDegrees(meter.degrees);
				obj.setID(meter.uniqueID);
				obj.setOpacity(meter.opacity);
				obj.setScale(meter.scale);
				obj.clearState();
			});

			file.settings.markings.text.forEach(text => {
				let obj = new FreeText(text.x, text.y);

				obj.setColor(text.color);
				obj.setDegrees(text.degrees);
				obj.setID(text.uniqueID);
				obj.setOpacity(text.opacity);
				obj.setScale(text.scale);
				obj.setText(text.text);
				obj.clearState();
			});

			file.settings.markings.pen.forEach(pen => {
				let obj = penObj;

				obj.setColor(pen.color);
				obj.setOpacity(pen.opacity);
				obj.setScale(pen.scale);
				obj.setID(pen.uniqueID);
				obj.generateSelf(pen.steps);
			});

        } catch (err) {
            alert("There was an error while attempting to load the data!\n\n" +
					"Please refresh the page and try again.\n\n" +
					"If the error persists, contact the administrator with this error: \n\n" + err);
        }

		GUIHolder.turnOffTheseHolders(toolRelatedHolders);
    }

    // Helper function to load the save object's sub panels array
    static loadSaveHelper = (array, type) => {
        let degrees = array.degrees;
        let uniqueNum = array.uniqueNum;
        let x = array.x;
        let y = array.y;
		let obj = "";

		if (type == "water" || type == "solar" || type == "existing") obj = new PanelArrayClass(uniqueNum, type, x, y, degrees);

		// New panel versions here
		else if (type == "solarV2") obj = new PanelArrayClassV2(uniqueNum, type, x, y, degrees);
		// New panel versions here

        obj.panelObj.panelElement.remove();
        obj.panels = [];
        obj.panelObj = null;

		obj.orientation = array.orientation;
        obj.setArrayNum(array.arrayNum);
        obj.setIsSnappedTogether(array.isSnappedTogether);
        obj.setOpacity(array.opacity);
        obj.setPitch(array.pitch);
        obj.setSnapping(array.snapping);
		obj.getMainDivElement().style.zIndex = 1001;

        array.panels.forEach(panel => {
            // Make a new panel
            let panelObj = obj.addNewPanel();
            // Set that panel's properties
            panelObj.setShading(panel.shading);
            panelObj.setColor(panel.color);
        });

		Item.uniqueID++;
        obj.clearState();
		obj.setRotationCenter();
    }
}

const saveObj = new SaveClass();


// //////////////////////
//
// Saving Related Methods
//
// //////////////////////

// Appends the specified image to it's respective invisible holder
const appendImg = (isClean) => {

	let targetSrc;
	let targetDest;

	if (isClean) {
		targetSrc = document.querySelector("#map-img");
		targetDest = document.querySelector("#clean-img-file");
	}

	else if (!isClean) {
		targetSrc = document.querySelector("#map");
		targetDest = document.querySelector("#dirty-img-file");
	}

	let ctx = targetDest.getContext("2d");
	ctx.clearRect(0, 0, 600, 600);

	html2canvas(targetSrc, {
		useCORS: true,
		allowTaint: true,
		width: 600,
		height: 600,
		scale: 1,
	}).then((canvas) => {
		ctx.drawImage(canvas, 0, 0);
	}).then(() => {
		isOkayToSend++;
	});
}

// Save function that controls the save button functionality
const saveBtnAction = () => {
	// Then save the dirty/edited image
	appendImg(false);

	// Save the clean image first
	appendImg(true);

	// Send the save via AJAX
	saveObj.sendSaveWhenReady();
}
