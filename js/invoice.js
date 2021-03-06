/*********************************************
 *
 * MY CUSTOM TREEHOUSE CODE REVIEWER INVOICE
 *
 * ROBERT MANOLIS - MARCH 2016
 *
 *********************************************/
"use strict";
 
var rate = document.getElementById("rate");
var hours = document.getElementById("hours");
var due = document.getElementById("due");
var invoiceInputTime = document.getElementById("invoiceInputTime");
var invoiceInputDue = document.getElementById("invoiceInputDue");
var yourInfoInput = document.getElementsByClassName("yourInfoInput");
var invoiceBody = document.getElementById("invoiceBody");
var invoiceRow = document.getElementsByClassName("invoiceRow");
var invoiceInput = document.getElementsByClassName("invoiceInput");
var invoiceInput2 = document.getElementsByClassName("invoiceInput2");
var billable = document.getElementsByClassName("billable");

var newRow = document.getElementById("newRow");
var rows = document.getElementById("rows");
var oneMore = document.getElementById("oneMore");
var clearAll = document.getElementById("clearAll");

var warningWrap = document.getElementById("warningWrap");
var trueClear = document.getElementById("trueClear");
var closeIt = document.getElementById("close");

var instructions = document.getElementById("instructions");
var instructionsModal = document.getElementsByClassName("instructionsModal")[0];
var instructionClose = document.getElementsByClassName("instructionClose")[0];

var runningCount = 0;
var runningTime = 0;


// SET ELEMENTS AND INFO FROM LOCAL STORAGE IF LOCAL STORAGE EXISTS
window.onload = function() {
	
	// SET INITIAL NUMBER OF ROWS BASED ON PREVIOUS STATE WITH LOCAL STORAGE
	if(typeof(Storage) !== "undefined") {
		for (var lsrn = 1; lsrn <= Number(localStorage.getItem("rowNumber")); lsrn++) {
			makeRows();
		}
		
		if (invoiceRow.length > 0) {
			newRow.disabled = true;
			oneMore.disabled = false;
		}
		
		// SET TOTALS
		var totalToggle = localStorage.getItem("rsToggle");
		
		if (totalToggle) {
			invoiceInputDue.value = "$\u00A0" + localStorage.getItem("totalDue");
			invoiceInputTime.value = localStorage.getItem("totalTime") + "\u00A0hours";
			
			due.value = "$\u00A0" + localStorage.getItem("totalDue");
			hours.value = localStorage.getItem("totalTime") + "\u00A0hours";
			
		} else {
			invoiceInputDue.value = "$";
			invoiceInputTime.value = "hour(s)";
			
			due.value = "$";
			hours.value = "hours";
		}
		
		// CHANGE ID AND RESAVE TO LOCAL STORAGE IF OPENING OLD DATA FROM LOCAL STORAGE
		changeId();
		saveToLocal();
	
		// SET STATE OF INPUT THAT CREATES ROWS
		var rsToggle = localStorage.getItem("rsToggle");
		
		if (rsToggle) {
			rows.value = localStorage.getItem("rowNumber");
			rows.disabled = true;
		}
		
		// LOAD SAVED NOTES IF THERE BE ANY, ARRRGH!  (HA! JUST THOUGHT I'D BE A PIRATE FOR A MINUTE.  :)  )
		invoiceInput2[2].value = localStorage.getItem(invoiceInput2[2].getAttribute("id"));
	} else {
		alert("This invoice uses local storage to save your entires into this form until you hit clear.  You don't seem to have local storage, so some aspects of this App my not function properly and your data will not be saved.");
		invoiceInputDue.value = "$";
		invoiceInputTime.value = "hour(s)";
	}
	
	// MAKE SURE CALKULATOR DOESNT QUIT WORKING
	calkulator();
	calkulator2();
};



// SET/PULL MAIN PERSONAL AND BILLING INFO INTO/OUT OF LOCAL STORAGE
for (var i = 0; i < yourInfoInput.length; i++) {
	// STICK A MARKER ON EACH INPUT	
	yourInfoInput[i].marker = i;
	
	// LOAD INPUTS FROM LOCAL STORAGE
	if(typeof(Storage) !== "undefined") {
	    yourInfoInput[i].value = localStorage.getItem(yourInfoInput[i].getAttribute("id"));
	} else {
	    yourInfoInput[i].value = "";
	}
	
	// SET TO LOCAL STORAGE
	yourInfoInput[i].addEventListener("blur", function() {	
		var idee = yourInfoInput[this.marker].getAttribute("id");
		var val = yourInfoInput[this.marker].value;
		
		// ERROR MESSAGE FOR INCORECT INPUT FOR HOURLY RATE
		if (yourInfoInput[this.marker].getAttribute("id") === "rate") {
			if (isNaN(this.value) || this.value < 0) {
				// ERROR FOR iNCORRECT INPUT
				alert("This input takes dollars per hour in positive numerical values.  Example: 3 or 42 or 420 or 3.14 ");
				rate.value = "";
			}
		}
		
		if(typeof(Storage) !== "undefined") {
		    localStorage.setItem(idee, val);
		}
	});
}



// HELPER FUNCTION TO CHANGE THE ID OF GENERATED INVOICE INPUTS TO INCLUDE A TRAILING INDX OF PARENT'S PARENT SO EACH ID IS UNIQUE FOR PURPOSES OF LOAL STORAGE
var changeId = function() {
	// STICK A MARKER ON INPUT'S PARENT'S PARENT
	for (var ir = 0; ir < invoiceRow.length; ir++) {
	    invoiceRow[ir].marker = ir; 
	}
	
	// CREATE NEW ID
	for (var ci = 0; ci < invoiceInput.length; ci++) {
		var oldIdee = invoiceInput[ci].getAttribute("id");
		var classIndex = invoiceInput[ci].parentNode.parentNode.marker;
		var newIdee = oldIdee + classIndex;
		
		// SET NEW ID
		invoiceInput[ci].setAttribute("id", newIdee);
	}
};

// HELPER FUINCTION TO CHANGE IDS FOR ONE MORE ROW
var oneRowNewId = function () {
	// STICK A MARKER ON INPUT'S PARENT'S PARENT
	invoiceRow[invoiceRow.length - 1].marker = invoiceRow.length - 1; 

	for (var ci = invoiceInput.length - 7; ci < invoiceInput.length; ci++) {
		var oldIdee = invoiceInput[ci].getAttribute("id");
		var classIndex = invoiceInput[ci].parentNode.parentNode.marker;
		var newIdee = oldIdee + classIndex;
		
		// SET NEW ID
		invoiceInput[ci].setAttribute("id", newIdee);
	}
};



// SET/PULL INVOICE ITEMS INTO/OUT OF LOCAL STORAGE
var saveToLocal = function() {
	
	// LOCAL STORAGE
	for (var ii = 0; ii < invoiceInput.length; ii++) {
		invoiceInput[ii].marker = ii;
		
		// IF DATA IN STORAGE THEN LOAD FROM STORAGE ELSE NOTHING
		if(typeof(Storage) !== "undefined") {
			invoiceInput[ii].value = localStorage.getItem(invoiceInput[ii].getAttribute("id"));
		} else {
		    invoiceInput[ii].value = "";
		}
		
			
		// // INPUT VALUE INTO LOCAL STORGAE ON INPUT BLUR
		invoiceInput[ii].addEventListener("blur", function() {	
			var idee = invoiceInput[this.marker].getAttribute("id");
			var val = invoiceInput[this.marker].value;
			
			if (rate.value === "" || rate.value === null) {
				alert("This App can't do any calculations until you enter your hourly rate above.  Just numerical digits please.  Example: 3 or 42 or 420 or 3.14");
			}
			
			if(typeof(Storage) !== "undefined") {
			    localStorage.setItem(idee, val);
			}
		});

	}
};



// HELPER FUNCTION FOR ROUNDING NUMBERS DOWN TO THE HUNDRETH DECIMAL PLACE
var round = function(num, places) {
	return Math.round(num * 100) / 100;
};


// CALULATE AND UPDATE INVOICE TOTALS ON INPUT OF DATA INTO ANY CELL OF THE INVOICE COLUMN TITLED BILLABLE
var calkulator = function() {
	for (var bill = 0; bill < billable.length; bill++) {
		billable[bill].addEventListener("input", function() {
			
			if (isNaN(this.value) || this.value < 0) {
				// ERROR FOR iNCORRECT INPUT
				alert("This input takes minutes in positive numerical values.  Example: 3 or 42 or 420 or 3.14 ");
			} else {
				// RESET COUNT
				runningCount = 0;
				
				// GET NEW TOTAL
				for (var bill2 = 0; bill2 < billable.length; bill2++) {
					runningCount += Number(billable[bill2].value);
				}

				// GET RATE
				var myRate = rate.value;
				
				// CONVERT MINTUES TO HOURS
				var minToHours = runningCount / 60;
				
				// HOURS * RATE = AMOUNT TO ADD
				var newTotal = Number(myRate) * Number(minToHours);
				
				// ROUND TOTAL
				var roundTotal = round(newTotal, -1);

				// PRINT TOTAL
				invoiceInputDue.value = "$\u00A0" + roundTotal;
				due.value = "$\u00A0" + roundTotal;
				
				// STORE DATA
				if(typeof(Storage) !== "undefined") {
					localStorage.setItem("totalDue", roundTotal);

					// SET TOGGLE TO LOCAL STORAGE SO MACHINE KNOWS WHETHER TO LOAD WITH TOTAL VALUES OR NOT
					localStorage.setItem("rsToggle", true);
				}
			}	
		});
	}
};

var calkulator2 = function() {
	for (var bill = 0; bill < billable.length; bill++) {
		billable[bill].addEventListener("input", function() {
			
			if (isNaN(this.value) || this.value < 0) {
				// ERROR FOR iNCORRECT INPUT
				alert("This input takes minutes in positive numerical values.  Example: 3 or 42 or 420 or 3.14 ");
			} else {
				// RESET COUNT
				runningTime = 0;
				
				// GET NEW TOTAL
				for (var bill2 = 0; bill2 < billable.length; bill2++) {
					runningTime += Number(billable[bill2].value);
				}
				
				// CONVERT MINTUES TO HOURS
				var minToHours = runningTime / 60;
				
				// ROUND TOTAL
				var roundTime = round(minToHours, -1);
				
				// PRINT TOTAL
				invoiceInputTime.value = roundTime + "\u00A0hours";
				hours.value = roundTime + "\u00A0hours";
				
				// STORE DATA
				if(typeof(Storage) !== "undefined") {
					localStorage.setItem("totalTime", roundTime);

					// SET TOGGLE TO LOCAL STORAGE SO MACHINE KNOWS WHETHER TO LOAD WITH TOTAL VALUES OR NOT
					localStorage.setItem("rsToggle", true);
				}
			}
		});
	}
};


// HELPER FUNCTION TO GENERATE DESIRED NUMBER OF NEW COMPLETE TABLE ROW(S)
var makeRows = function() {
	var tr = document.createElement("tr");
	tr.setAttribute("class", "invoiceRow");
	
	for (var tdip = 1; tdip < 8; tdip++) {
		var td = document.createElement("td");
		var ip = document.createElement("input");
		ip.setAttribute("type", "text");
		if (tdip === 2) {
			ip.setAttribute("class", "invoiceInput invoiceProject");
		} else if (tdip === 5) {
			ip.setAttribute("class", "invoiceInput billable");
		} else if (tdip === 6) {
			ip.setAttribute("class", "invoiceInput invoiceStudent");
		} else {
			ip.setAttribute("class", "invoiceInput");
		}
		if (tdip === 1) {
			ip.setAttribute("id", "date");
			ip.setAttribute("autocomplete", "off");
		} else if (tdip === 2) {
			ip.setAttribute("id", "project");
			ip.setAttribute("autocomplete", "on");
		} else if (tdip === 3) {
			ip.setAttribute("id", "timeStart");
			ip.setAttribute("autocomplete", "off");
		} else if (tdip === 4) {
			ip.setAttribute("id", "timeStop");
			ip.setAttribute("autocomplete", "off");
		} else if (tdip === 5) {
			ip.setAttribute("id", "billable");
			ip.setAttribute("autocomplete", "off");
		} else if (tdip === 6) {
			ip.setAttribute("id", "student");
			ip.setAttribute("autocomplete", "off");
		} else if (tdip === 7) {
			ip.setAttribute("id", "grade");
			ip.setAttribute("autocomplete", "on");
		}
		
		td.appendChild(ip);
		tr.appendChild(td);
	}
	invoiceBody.appendChild(tr);
};

// HELPER FUNCTION TO MAKE ROWS
var makeSomeRowsYo = function() {
	if (rows.value < 1 || rows.value > 42 || isNaN(rows.value)) {
		// ERROR FOR iNCORRECT INPUT
		alert("Please replace the '#' with a number between 1 and 42, then try again.");
	} else {
		newRow.disabled = true;
		rows.disabled = true;
		oneMore.disabled = false;
		if(typeof(Storage) !== "undefined") {
		    localStorage.setItem("rowNumber", rows.value);
		}
		for (var rowi = 1; rowi <= rows.value; rowi++) {
			makeRows();
		}
	}	
	
	changeId();
	saveToLocal();
	calkulator();	
	calkulator2();	
};


// CREATE ROWS AND SET NUMBER TO LOCAL STORAGE
newRow.addEventListener("click", function() {	
	makeSomeRowsYo();
});

// ADD ENTER BUTTON FUNCTIONALITY TO UNPUT
rows.addEventListener("keydown", function(e) {
	if(e.keyCode == 13){
		makeSomeRowsYo();
	}
});

oneMore.disabled = true;

oneMore.onclick = function() {
	makeRows();
	oneRowNewId();
	saveToLocal();
	calkulator();
	calkulator2();
	
	var oldRows = Number(localStorage.getItem("rowNumber"));
	var newRows = oldRows += 1;
	
	// UPDATE NUMBER IN ROWS INPUT BOX TO REPRESENT ACTUAL NUMBER OF ROWS
	rows.value = newRows;
	
	if(typeof(Storage) !== "undefined") {
		localStorage.setItem("rowNumber", newRows);
	}
};


// RESET LOCAL STORAGE FOR ROW NUMBER IMPUT AND RE-ENABLE CREATE ROWS BUTTON
rows.addEventListener("focus", function() {
	newRow.disabled = false;
	if(typeof(Storage) !== "undefined") {
		localStorage.setItem("rowNumber", rows.value);
	}
});


// SET/PULL TOTALS AND NOTES INTO/OUT OF LOCAL STORAGE
invoiceInput2[2].addEventListener("blur", function() {	
	var idee = invoiceInput2[2].getAttribute("id");
	var val = invoiceInput2[2].value;
	
	if(typeof(Storage) !== "undefined") {
	    localStorage.setItem(idee, val);
	} 
});


// RESET 
clearAll.onclick = function() {	
	var opac = 0;
	var showWarning = setInterval(function() {
		opac += .01;
		if (opac < 1) {
			warningWrap.style.opacity = opac;
		}
	}, 3);
	
	warningWrap.style.display = "block";
};

 // TRUE RESET
trueClear.onclick = function() {
	// SET BUTTON AND INPUT STATES
	newRow.disabled = false;
	rows.disabled = false;
	oneMore.disabled = true;
	
	// CLEAR LOCAL STORAGE
	if(typeof(Storage) !== "undefined") {
		localStorage.removeItem("rsToggle");
		localStorage.removeItem("rowNumber");
		
		localStorage.removeItem("totalDue");
		localStorage.removeItem("totalTime");
		
		var idee2 = invoiceInput2[2].getAttribute("id");
		localStorage.removeItem(idee2);
		
		for(var remi = 0; remi < invoiceInput.length; remi++) {
			var idee1 = invoiceInput[remi].getAttribute("id");
			localStorage.removeItem(idee1);
		}
	}
	
	window.location.reload();
};

// CLOSE RESET WARNING
closeIt.onclick = function() {
	warningWrap.style.opacity = "0";
	warningWrap.style.display = "none";
};

// OPEN INSTRUCITONS
instructions.onclick = function() {
	var opac = 0;
	var showWarning = setInterval(function() {
		opac += .01;
		if (opac < 1) {
			instructionsModal.style.opacity = opac;
		}
	}, 3);
	
	instructionsModal.style.display = "block";
};


// CLOSE INSTRUCTIONS
instructionClose.onclick = function() {
	instructionsModal.style.opacity = "0";
	instructionsModal.style.display = "none";
};