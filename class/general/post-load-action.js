// Author: Austin C Arledge (austin.c.arledge@gmail.com) 1 Mar 22

// Check if the loaded project is new or a revision of an existing project
const checkNew = () => {
    let elem = $("#pl_Action");

    // Check if the DOM elem has a new or revision value in its text field
    if (elem.text() == "create") {
        // Force the user to select a map location, attempt to use the geo location on file.
        enableMapMoving();
    }
    else if (elem.text() == "edit") {
        // Send GET via AJAX for the JSON to parse and load
        $.ajax({
            url: kh_BaseUrl + "pl_GetSettings",
            type: "GET",
            data: {
                kh_UserName: kh_UserName,
                rp_Key: rp_Key,
            },
            dataType: "jsonp",
            jsonpCallback: "jsonpCallback",
            crossDomain: true,
            success: function (data, status, xhr) {
                SaveClass.loadSave(data);
            },
            error: function (responseData, textStatus, errorThrown) {
                alert("There was an error while attempting to load data from the server!\n\n" + 
                        "Please check your internet connection and try again.\n\n" + 
                        "If the error persists, refresh the page and try again.\n\n" +
                        "If the error still persists, contact the administrator with this error: \n\n" 
                        + `Error: ${JSON.stringify(responseData)}`);
            }
        });
    }
}

checkNew();
