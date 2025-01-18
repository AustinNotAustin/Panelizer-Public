// Author: Austin C Arledge Sr (austin.c.arledge@gmail.com) - edited 25 May 22

// //////////////////
//
// Active Items Class
//
// //////////////////


// Class that handles which items are currently active. Since there are multiple different types of items
// this class keeps all of those different items organized under one reference.
class ActiveItems {
    constructor() {
        this.isSinglePanels = false;
        this.items = [];


        //
        // Methods
        //

        // Add items to the array
        this.addItem = (item) => {

            // If control is held down, add multiple items
            if (isControlHeldDown) {

                // If type is 'panel', clear [] and add panels
                if (item.objType === 'panel') {

                    // If this is the first single panel (not already set to single panels)
                    if (this.isSinglePanels == false) {
                        
                        // Deactivate the current active items
                        this.items.forEach(item => {
                            item.deactivate();
                        });

                        // Set isSingle to true & clear the []
                        this.isSinglePanels = true;
                        this.items = [];
                    }

                    this.addItemPreCheck(item);
                    
                } else {
                    // If there are single panels in the [], clear first
                    if (this.isSinglePanels) {
                        this.items.forEach(item => {
                            item.deactivate();
                        });

                    }
                    
                    // Item isn't a panel, remove the currently selected items and set is single panels to false
                    this.isSinglePanels = false;
                    this.items = [];
                    this.addItemPreCheck(item);
                }
                
            } else {
                this.isSinglePanels = false;

                // If the item is already in the array, return
                if (this.items.includes(item)) return;

                // Otherwise, replace the array with the new item after clearing
                this.items.forEach(item => {
                    item.deactivate();
                });

                this.items = [item];
            }
        }

        // Clear the active items in the array and deactivate the appropriately
        this.clearActiveItems = () => {
            this.items.forEach(item => {
                item.deactivate();
            });

            this.items = [];
        }

        // Remove item of choice from the []
        this.removeItem = (item) => {
            if (this.items.includes(item)) {
                let index = this.items.indexOf(item);
                this.items.splice(index, 1);
                return true;
            } else {
                return false;
            }
        }

        // Add a specific item to the array, only if it's not already added
        this.addItemPreCheck = (item) => {

            if (this.checkForDupe(item)) {
                return;
            } else {
                this.items.push(item);
            }
        }

        // Searches for a duplicate item in the this.items array and returns T or F if it's found
        this.checkForDupe = (item) => {

            for (let i = 0; i < this.items.length; i++) {
                if (this.items[i].uniqueID == item.uniqueID) {
                    return true;
                }
            }

            return false;
        }
    }
}


const activeItemsObj = new ActiveItems();
