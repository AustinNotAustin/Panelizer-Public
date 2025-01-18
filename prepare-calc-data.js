// Author: Austin C Arledge Sr (austin.c.arledge@gmail.com) 22 Jul 22

const getCalcData = () => {
    let compareMap = organizeArrayData();

    let result = {
        arrays: {
            solar: [],      // {number of panels: , shading: , tilt: }

            // New panel versions here
            solarV2: [],
            // New panel versions here

            water: [],       // {number of panels: , shading: , tilt: }
        }
    };

    prepareCalcDataHelper(result, compareMap);

    return result;
}

// Iterates through the grouping map by every single level, building the result map from said grouping map
    // i.e. This function turns a map full of arrays grouped by type, number, tilt, and finally rotation
    // into a result map that can be sent to the KumuHub calculator. (See compareMap below for the "grouping map")
const prepareCalcDataHelper = (result, compareMap) => {

    for (let type in compareMap.arrays) {
        for (let num in compareMap.arrays[type]) {
            for (let tilt in compareMap.arrays[type][num]) {
                for (let degree in compareMap.arrays[type][num][tilt]) {

                    let totalShading = 0.0;
                    let numberOfPanels = 0;
                    
                    // For every object/array in the rotation
                    for (let obj in compareMap.arrays[type][num][tilt][degree]) {
                        // Fill in the missing data
                        numberOfPanels += compareMap.arrays[type][num][tilt][degree][obj].panels.length;
                        // For every panel in the array
                        for (let i in compareMap.arrays[type][num][tilt][degree][obj].panels) {
                            totalShading += parseFloat(compareMap.arrays[type][num][tilt][degree][obj].panels[i].shading);
                        }
                    }

                    // Create the temporary sub object
                    let subData = {
                        panels: numberOfPanels,
                        shading: totalShading / numberOfPanels,
                        tilt: tilt,
                        rotation: degree
                    }

                    // Append the object
                    if (type == "solar") {
                        result.arrays.solar.push(subData);
                    }
                    else if (type == "water") {
                        result.arrays.water.push(subData);
                    }

                    // New panel versions here
                    else if (type == "solarV2") {
                        result.arrays.solarV2.push(subData);
                    }
                    // New panel versions here
                }
            }
        }
    }
}

// Gather the panel array data and organize it
const organizeArrayData = () => {
        // Comparison Map used for grouping arrays of the same type to save calculator space:
        let compareMap = {
            arrays: {
                solar: {
                    0: {
                        10: {},
                        20: {},
                        40: {}
                    },
                    1: {
                        10: {},
                        20: {},
                        40: {}
                    },
                    2: {
                        10: {},
                        20: {},
                        40: {}
                    },
                    3: {
                        10: {},
                        20: {},
                        40: {}
                    },
                    4: {
                        10: {},
                        20: {},
                        40: {}
                    },
                    5: {
                        10: {},
                        20: {},
                        40: {}
                    },
                    6: {
                        10: {},
                        20: {},
                        40: {}
                    },
                    7: {
                        10: {},
                        20: {},
                        40: {}
                    },
                    8: {
                        10: {},
                        20: {},
                        40: {}
                    },
                    9: {
                        10: {},
                        20: {},
                        40: {}
                    },
                },

                // New panel versions here
                solarV2: {
                    0: {
                        10: {},
                        20: {},
                        40: {}
                    },
                    1: {
                        10: {},
                        20: {},
                        40: {}
                    },
                    2: {
                        10: {},
                        20: {},
                        40: {}
                    },
                    3: {
                        10: {},
                        20: {},
                        40: {}
                    },
                    4: {
                        10: {},
                        20: {},
                        40: {}
                    },
                    5: {
                        10: {},
                        20: {},
                        40: {}
                    },
                    6: {
                        10: {},
                        20: {},
                        40: {}
                    },
                    7: {
                        10: {},
                        20: {},
                        40: {}
                    },
                    8: {
                        10: {},
                        20: {},
                        40: {}
                    },
                    9: {
                        10: {},
                        20: {},
                        40: {}
                    },
                },
                // New panel versions here
    
                water: {
                    0: {
                        10: {},
                        20: {},
                        40: {}
                    },
                    1: {
                        10: {},
                        20: {},
                        40: {}
                    },
                    2: {
                        10: {},
                        20: {},
                        40: {}
                    },
                    3: {
                        10: {},
                        20: {},
                        40: {}
                    },
                    4: {
                        10: {},
                        20: {},
                        40: {}
                    },
                    5: {
                        10: {},
                        20: {},
                        40: {}
                    },
                    6: {
                        10: {},
                        20: {},
                        40: {}
                    },
                    7: {
                        10: {},
                        20: {},
                        40: {}
                    },
                    8: {
                        10: {},
                        20: {},
                        40: {}
                    },
                    9: {
                        10: {},
                        20: {},
                        40: {}
                    },
                },
            }
        };
    
        organizeArrayDataHelper("solar", compareMap);
        organizeArrayDataHelper("water", compareMap);

        // New panel versions here
        organizeArrayDataHelper("solarV2", compareMap);
        // New panel versions here

        return compareMap;
    }

// Helper function to build the comparison map & organize arrays by their values
const organizeArrayDataHelper = (type, obj) => {
    saveObj.allObjs.get("panels").get(type).forEach(arr => {
        // Attempt to place this array in it's respective comparison map position
        try {    
            obj.arrays[type][arr.arrayNum][arr.pitch][arr.degrees].push(arr);
        } catch (err) {
            // If that degree wasn't found, make a new entry in the map
            obj.arrays[type][arr.arrayNum][arr.pitch][arr.degrees] = [arr];
        }
    })
}
