var fs = require('fs-extra');
var Dialogs = require('dialogs');
var dialogs = Dialogs(opts={})
window.$ = window.jQuery = require('jquery');

//Useful universal functions
function createFile(file,text) {
	fs.writeFileSync(file, text);
}
function appendFile(file,text) {
	fs.appendFileSync(file,text);
}
function deleteFile(fileName){
	fs.unlinkSync(fileName);
}
function renameFile(oldPath,newPath) {
	fs.renameSync(oldPath,newPath);
}
function getKeyByValue(object, value) {
	return Object.keys(object).find(key => object[key] === value);
}
function contains(a, obj) {
	var i = a.length;
	while (i--) {
		if (a[i] === obj) {
			return true;
		}
	}
	return false;
}
function isLetter(str) {
  return str.length === 1 && str.match(/[a-z]/i);
}
function integer(thing) {
	if (typeof thing=="string") {
		thing = parseInt(thing);
		return thing;
	} else if (typeof thing!="number") {
		return null;
	}
	return thing;
}
function isKey(obj, key) {
	return key in obj;
}

//Files In Data-Collect
var manifest_pit = [];
var manifest_stand = [];
var matchSchedule = {}

//List of Teams
var teams = [488,492,753,948,955,957,997,1294,1318,1425,1595,1778,2046,2147,2374,2471,2521,2550,2557,2811,2907,2910,2928,2930,2980,2990,3024,3070,3219,3223,3238,3393,3663,3674,3693,3711,4061,4125,4131,4173,4450,4469,4488,4495,4513,4662,4911,4915,4918,5085,5198,5295,5450,5468,5588,5803,5827,5920,5970,5975,6343,6350,6445]
var teams_names = ["Team XBot","Titan Robotics","High Desert Droids","NRG","CV Robotics","SWARM","Spartan Robotics","Top Gun","Issaquah Robotics Society","Error Code Xero", "The Dragons","Chill Out","Bear Metal","CHUCK","Crusader Bots","Mean Machine","SERT","Skynet","SOTAbots","StormBots","Lion Robotics","Jack in the Bot","Viking Robotics","Sonic Squirrels","Whidbey Island Wild Cats","Hotwire","My Favorite Team","Team Pronto","TREAD","Robotics of Central Kitsap","Cyborg Ferrets","Horns of Havoc","CPR","4-H Clover Bots","GearHead Pirates","Iron Mustang","SciBorgs","Confidential","Iron Patriots","Bulldogs","Olympia Robotics Federation","RAID","Shockwave","Haywire","Circuit Breakers","Byte Sized Robotics","CyberKnights","Spartronics","The Roboctopi","LakerBots","Knight Tech","Aldernating Current","SHREC","Chaos Theory","Holy Names Academy","Apex Robotics","Code Purple","VIKotics","BeaverTronics","Beta Blues","Steel Ridge Robotics","The Enumclaw Hornets","CTEC Robotics"]//["High Desert Droids","PHRED","CV ROBOTICS","SWARM","Spartan Robotics","Error Code Xero","Wildcats","Flaming Chickens","CALibrate Robotics","Tualatin Robotics","Crusader Bots","SERT","Skynet","StormBots","Flying Hedgehogs","Hotwire","Gladiators","C.Y.B.O.R.G. Seagulls","4-H Clover Bots","NerdHerd","Sabin-Sharks","STEAMPUNK","DEEP SPACE NINERS","LoggerBots","Scotbots","Shockwave","Byte Sized Robotics","Metal Mallards","LakerBots","Knight Tech","Chaos Theory","Falcons","BeaverTronics","Modern Americans","CTEC Robotics","Oregon Trail Academy Wi-Fires","Cardinal Dynamics"]

//Stores:
//Member ID
//Total Number of Matches Scoutes
var scoutcount = {
	"98": [0,0],
	"50": [0,0],
	"60": [0,0],
	"64": [0,0],
	"66": [0,0],
	"81": [0,0],
	"24": [0,0],
//	"25": [0,0],
	"20": [0,0],
//	"21": [0,0],
	"22": [0,0],
//	"23": [0,0],
	"44": [0,0],
	"40": [0,0],
	"41": [0,0],
	"96": [0,0],
	"77": [0,0],
	"76": [0,0],
	"72": [0,0],
	"97": [0,0],
//	"58": [0,0],
	"99": [0,0],
	"13": [0,0],
	"12": [0,0],
	"15": [0,0],
	"14": [0,0],
	"17": [0,0],
	"16": [0,0],
	"19": [0,0],
	"18": [0,0],
//	"30": [0,0],
	"37": [0,0],
	"36": [0,0],
	"34": [0,0],
	"33": [0,0],
	"55": [0,0],
	"48": [0,0]
};

//Stores:
//Member ID
//Member Name
var accounts = {
	"98": "Adolfo",
	"50": "Noor",
	"60": "Nicholas",
	"64": "David",
	"66": "Alexander Y",
	"81": "Holly",
	"24": "Zack",
//	"25": "Ruby",
	"20": "Lauren Mei",
//	"21": "Hammad",
	"22": "Robin",
//	"23": "Claire",
	"44": "Hannah",
	"40": "Fin",
	"41": "Amber",
	"96": "Liam B",
	"77": "Bailey",
	"76": "Spencer",
	"72": "Aarushi",
	"97": "Marti",
//	"58": "Quinn",
	"99": "Jake",
	"13": "Andrei",
	"12": "Alexander M",
	"15": "Tristan",
	"14": "Jonathan",
	"17": "Avery",
	"16": "Tyler",
	"19": "Kobi",
	"18": "Ryan",
//	"30": "Josephine",
	"37": "Kean",
	"36": "Liam W",
	"34": "Ben J",
	"33": "Culla",
	"55": "Dylan",
	"48": "Natalie"
};

// Tristan's Edits
var candyBool = false;
$('.candy').click(function () {
	candyBool = !candyBool;
	if (candyBool) {
		$('.candy').css('background', 'pink');
		$('.candy').css('border', '1px solid pink');
	} else if (!candyBool) {
		$('.candy').css('background', '');
		$('.candy').css('border', '');
	}
});

//Imports Previous Files
function start() {
	if (fs.existsSync('data-collect/stand-scouting/manifest.json')) {
		manifest_stand = JSON.parse(fs.readFileSync('data-collect/stand-scouting/manifest.json'));
 	}
 	if (fs.existsSync('data-collect/pit-scouting/manifest.json')) {
		manifest_pit = JSON.parse(fs.readFileSync('data-collect/pit-scouting/manifest.json'));
	}
	if (fs.existsSync('matchSched.json')) {
		matchSchedule = JSON.parse(fs.readFileSync('matchSched.json'));
	}
	createTable();
	//Load Stand
	for (x in manifest_stand) {
		if (fs.existsSync('data-collect/stand-scouting/'+manifest_stand[x])) {
			var data = JSON.parse(fs.readFileSync('data-collect/stand-scouting/'+manifest_stand[x]));
			scoutcount[data.scoutId][1]+=1;
		}
	}
	//Load Pit
	for (x in manifest_pit) {
		if (fs.existsSync('data-collect/pit-scouting/'+manifest_pit[x])) {
			var data = JSON.parse(fs.readFileSync('data-collect/pit-scouting/'+manifest_pit[x]));
			scoutcount[data.scoutIds[0]][0]+=1;
          	if (data.scoutIds[1]!="-") {
				scoutcount[data.scoutIds[1]][0]+=1;
			}
		}
	}
	updateTable();
}

//Imports Incoming Pit Data
function importPit() {
	if (navigator.appVersion.indexOf('Mac') != -1) {
		if (fs.existsSync('/Volumes/1540/')) {
			var manifest = JSON.parse(fs.readFileSync("/Volumes/1540/companal/pit-scouting/manifest.json"));
			console.log(manifest);
			for (var team in manifest) {
				if (!fs.existsSync('data-collect/pit-scouting/'+manifest[team]) && fs.existsSync('/Volumes/1540/companal/pit-scouting/' + manifest[team])) {
					var txt = fs.readFileSync('/Volumes/1540/companal/pit-scouting/' + manifest[team]);
					var teamData = JSON.parse(txt);
					scoutcount[teamData.scoutIds[0]][0]+=1;
					if (teamData.scoutIds[1]!="-") {
						scoutcount[teamData.scoutIds[1]][0]+=1;
					}
					manifest_pit.push(manifest[team]);
					createFile("data-collect/pit-scouting/manifest.json",JSON.stringify(manifest_pit));
					createFile("data-collect/pit-scouting/"+manifest[team],txt);
				} else {
					console.log(manifest[team]);
				}
			}
			$("#impPit").addClass("disabled");
			updateTable();
			dialogs.alert('Done importing data!');
		} else {
			dialogs.alert('The USB is not inserted properly');
		}
	} else {
		dialogs.alert('Oops! Something went wrong');
	}
}

//Imports Incoming Stand Data
function importStand() {
	if (navigator.appVersion.indexOf('Mac') != -1) {
		if (fs.existsSync('/Volumes/1540/')) {
			var manifest = JSON.parse(fs.readFileSync("/Volumes/1540/companal/stand-scouting/manifest.json"));
			for (var team in manifest) {
				if (!fs.existsSync('data-collect/stand-scouting/'+manifest[team]) && fs.existsSync('/Volumes/1540/companal/stand-scouting/'+manifest[team])) {
					var txt = fs.readFileSync('/Volumes/1540/companal/stand-scouting/'+ manifest[team]);
					var data = JSON.parse(txt);
					manifest_stand.push(manifest[team]);
          			scoutcount[data.scoutId][1]+=1;
          			createFile("data-collect/stand-scouting/"+manifest[team],JSON.stringify(data));
				}
			}
			$("#impStand").addClass("disabled");
			createFile("data-collect/stand-scouting/manifest.json",JSON.stringify(manifest_stand));
			dialogs.alert('Done importing data!');
			updateTable();
		} else {
			dialogs.alert('The USB is not inserted properly');
		}
	} else {
		dialogs.alert('Oops! Something went wrong');
	}
}

//Exports Data To Flashdrive
function exportData() {
	//alexander code
	if (fs.existsSync('/Volumes/1540')) {
		$("#export").addClass("disabled");
		$("#impStand").addClass("disabled");
		$("#impPit").addClass("disabled");
		$("#new").removeClass("disabled");
		fs.copySync('data-collect/stand-scouting/', '/Volumes/1540/companal/output/stand-scouting/')
		fs.copySync('data-collect/pit-scouting/', '/Volumes/1540/companal/output/pit-scouting/')
	} else {
		dialogs.alert("The USB is not inserted properly.");
	}
}

//Creates The Tables
function createTable() {
	var keys = Object.keys(accounts);
	for (x in keys) {
		var name = accounts[keys[x]];
		var id = keys[x]
		var tr = document.createElement("tr");
		tr.setAttribute("id",id+"row")
		$("#tbody").append(tr);
		var td = document.createElement("td");
		td.setAttribute("id",id+"id");
		$("#"+id+"row").append(td);
		$("#"+id+"id").text(id);
		var td2 = document.createElement("td");
		td2.setAttribute("id",id+"name");
		$("#"+id+"row").append(td2);
		$("#"+id+"name").text(name);
		var td3 = document.createElement("td");
		td3.setAttribute("id",id+"num");
		$("#"+id+"row").append(td3);
		$("#"+id+"num").text(scoutcount[id][0]);
		var td4 = document.createElement("td");
		td4.setAttribute("id",id+"num2");
		$("#"+id+"row").append(td4);
		$("#"+id+"num2").text(scoutcount[id][1]);
		var td5 = document.createElement("td");
		td5.setAttribute("id",id+"num3");
		$("#"+id+"row").append(td5);
		$("#"+id+"num3").text(parseInt(scoutcount[id][2])+parseInt(scoutcount[id][2]));
		$('#' + id + 'name').prepend('<a class="err-no-ten-' + id + '" data-toggle="tooltip" data-placement="right auto" style="text-decoration: none; color: red; cursor: pointer;" title="' + accounts[id] + ' has not scouted 24 matches">&#215;</a>&nbsp;&nbsp;');
		if (candyBool) {
			for (x in keys) {
				var id = keys[x];
				if (parseInt($("#" + id + "num2").val()) % 10 == 0) {
					$('.' + id + 'row').addClass('pinkCandy');
				}
			}
		}
	}
	for (match=1;match<=Object.keys(matchSchedule).length;match+=1) {
		var tr = document.createElement("tr");
		tr.setAttribute("id","m"+match+"row");
		$("#matchBody").append(tr);
		var tnum = document.createElement("td");
		tnum.setAttribute("id","m"+match+"num");
// 		tnum.setAttribute("class","first");
		$("#m"+match+"row").append(tnum);
		$("#m"+match+"num").text(match);
		var r1 = document.createElement("td");
		r1.setAttribute("id","m"+match+"r1");
		$("#m"+match+"row").append(r1);
		$("#m"+match+"r1").text("False");
		$("#m"+match+"r1").css("background-color","#F5FFBF");
		var r2 = document.createElement("td");
		r2.setAttribute("id","m"+match+"r2");
		$("#m"+match+"row").append(r2);
		$("#m"+match+"r2").text("False");
		$("#m"+match+"r2").css("background-color","#F5FFBF");
		var r3 = document.createElement("td");
		r3.setAttribute("id","m"+match+"r3");
		$("#m"+match+"row").append(r3);
		$("#m"+match+"r3").text("False");
		$("#m"+match+"r3").css("background-color","#F5FFBF");
		var b1 = document.createElement("td");
		b1.setAttribute("id","m"+match+"b1");
		$("#m"+match+"row").append(b1);
		$("#m"+match+"b1").text("False");
		$("#m"+match+"b1").css("background-color","#F5FFBF");
		var b2 = document.createElement("td");
		b2.setAttribute("id","m"+match+"b2");
		$("#m"+match+"row").append(b2);
		$("#m"+match+"b2").text("False");
		$("#m"+match+"b2").css("background-color","#F5FFBF");
		var b3 = document.createElement("td");
		b3.setAttribute("id","m"+match+"b3");
		$("#m"+match+"row").append(b3);
		$("#m"+match+"b3").text("False");
		$("#m"+match+"b3").css("background-color","#F5FFBF");
	}
	for (x in teams) {
		var team = teams[x];
		var tr = document.createElement("tr");
		tr.setAttribute("id","r"+team+"row");
		$("#robotBody").append(tr);
		var name = document.createElement("td");
		name.setAttribute("id","r"+team+"bot");
		$("#r"+team+"row").append(name);
		$("#r"+team+"bot").text(team);
		var aname = document.createElement("td");
		aname.setAttribute("id","r"+team+"nm");
		$("#r"+team+"row").append(aname);
		$("#r"+team+"nm").text(teams_names[x]);
		var pit = document.createElement("td");
		pit.setAttribute("id","r"+team+"pit");
		$("#r"+team+"row").append(pit);
		$("#r"+team+"pit").text("False");
		$("#r"+team+"pit").css("background-color","#ffdad1");
		var stand = document.createElement("td");
		stand.setAttribute("id","r"+team+"stand");
		$("#r"+team+"row").append(stand);
		$("#r"+team+"stand").text("0");
	}
	keys = Object.keys(matchSchedule);
	for (match=1;match<keys.length+1;match+=1) {
		var tr = document.createElement("tr");
		tr.setAttribute("id","s"+match);
		$("#scheduleBody").append(tr);
		var mnum = document.createElement("td");
		mnum.setAttribute("id","s"+match+"title");
		$("#s"+match).append(mnum);
		$("#s"+match+"title").text(match);
		for (x=0;x<6;x+=1) {
			var td = document.createElement("td");
			td.setAttribute("id","s"+match+"spot"+(x+1));
			$("#s"+match).append(td);
			$("#s"+match+"spot"+(x+1)).text(matchSchedule[match][x]);
			if (parseInt(matchSchedule[match][x])==1540) {
				$("#s"+match+"spot"+(x+1)).css("background-color","#B6FF9E");
			}
		}
	}
}

//Updates The Tables
function updateTable() {
	var keys = Object.keys(accounts);
	for (x in keys) {
		var id = keys[x];
		$("#"+id+"num").text(scoutcount[id][0]);
		$("#"+id+"num2").text(scoutcount[id][1]);
		$("#"+id+"num3").text((parseInt(scoutcount[id][0]) / 2)+parseInt(scoutcount[id][1]));
		// Tristan's Edits
		if ($("#" + id + "num3").text() < 24) {
			// $('.err-table').append('<tr><td class="' + id + 'alert" style="color: red; font-weight: bold;"><!--<i class="fa fa-exclamation-triangle" style="color: red;"></i>--><a class="err-no-ten-' + id + '" data-toggle="tooltip" data-placement="right auto" style="text-decoration: none; color: red; cursor: pointer;" title="' + accounts[id] + ' has not scouted 10 matches">&#215;</a></td></tr>');
		} else {
			$(".err-no-ten-" + id).replaceWith('<a class="err-no-ten-' + id + '" data-toggle="tooltip" data-placement="right auto" style="text-decoration: none; cursor: pointer;" title="' + accounts[id] + ' has scouted 24 matches">&#x1F44D;</a>');
		}
		var exempt = JSON.parse(fs.readFileSync('exempt.json', 'utf-8'));
		var ePeople = Object.keys(exempt);
		for (i in ePeople) {
			if (id == ePeople[i]) {
				if (exempt[ePeople[i]][1] == 0) {} else {
					if ($("#" + id + "num3").text() < exempt[ePeople[i]][1]) {
						$('#' + ePeople[i] + 'name').prepend('<span style="color: red; cursor: pointer;" data-toggle="tooltip" data-placement="right auto" title="' + exempt[ePeople[i]][0] + ' has not scouted ' + exempt[ePeople[i]][1] + ' matches">&#215;</span>&nbsp;');
					} else {
						$('#' + ePeople[i] + 'name').prepend('<span style="cursor: pointer;" data-toggle="tooltip" data-placement="right auto" title="' + exempt[ePeople[i]][0] + ' has met the minimum requirement">&#x1F44D;</span>&nbsp;');
					}
				}
			}
		}
	}
	for (x in teams) {
		$("#r"+teams[x]+"stand").text(0);
	}
	for (x in manifest_stand) {
		var match = manifest_stand[x];
		if (fs.existsSync("data-collect/stand-scouting/"+match)) {
			var file = JSON.parse(fs.readFileSync("data-collect/stand-scouting/"+match));
			var scout = file.matchNumber;
			var role = file.role;
			var team = file.teamNumber;
			var text = $("#m"+scout+role).text();
			var num = $("#r"+team+"stand").text();
			$("#m"+scout+role).text("True");
			$("#m"+scout+role).css("background-color","blue");//"#CFFFBF");
			$("#m"+scout+role).css("color","white");//"#CFFFBF");
			$("#r"+team+"stand").text(parseInt(num)+1);
		}
	}
	for (x in manifest_pit) {
		var pit = manifest_pit[x];
		if (fs.existsSync("data-collect/pit-scouting/"+pit)) {
			var file = JSON.parse(fs.readFileSync("data-collect/pit-scouting/"+pit));
			var team = file.teamNumber;
			$("#r"+team+"pit").text("True");
			$("#r"+team+"pit").css("background-color","#d1ffde");
		}
	}
}

//Allows Uploading Of More Pit and Stand Data
function newFlash() {
	$("#impPit").removeClass("disabled");
	$("#impStand").removeClass("disabled");
	$("#export").removeClass("disabled");
	$("#new").addClass("disabled");
}

//Buttons
$("#impPit").click(function(){
	if (!$(this).hasClass("disabled")) {
		importPit();
	}
});
$("#impStand").click(function(){
	if (!$(this).hasClass("disabled")) {
		importStand();
	}
});
$("#export").click(function(){
	if (!$(this).hasClass("disabled")) {
		exportData();
	}
});
$("#new").click(function(){
	if (!$(this).hasClass("disabled")) {
		newFlash();
	}
});
$("#toggleMembers").click(function(){
	$("#members").show();
	$("#matches").hide();
	$("#teams").hide();
	$("#matchSched").hide();
	$("#toggleMembers").addClass("act");
	$("#toggleTeams").removeClass("act");
	$("#toggleMatches").removeClass("act");
	$("#toggleSchedule").removeClass("act");
// 	window.scrollTo(0,0);
});
$("#toggleTeams").click(function(){
	$("#teams").show();
	$("#matches").hide();
	$("#members").hide();
	$("#matchSched").hide();
	$("#toggleTeams").addClass("act");
	$("#toggleMatches").removeClass("act");
	$("#toggleMembers").removeClass("act");
	$("#toggleSchedule").removeClass("act");
// 	window.scrollTo(0,1605);
});
$("#toggleMatches").click(function(){
	$("#matches").show();
	$("#teams").hide();
	$("#members").hide();
	$("#matchSched").hide();
	$("#toggleMatches").addClass("act");
	$("#toggleTeams").removeClass("act");
	$("#toggleMembers").removeClass("act");
	$("#toggleSchedule").removeClass("act");
// 	window.scrollTo(0,3210);
});
$("#toggleSchedule").click(function(){
	$("#matchSched").show();
	$("#teams").hide();
	$("#members").hide();
	$("#matches").hide();
	$("#toggleSchedule").addClass("act");
	$("#toggleTeams").removeClass("act");
	$("#toggleMatches").removeClass("act");
	$("#toggleMembers").removeClass("act");
// 	window.scrollTo(0,3210);
});

//Runs At Start
start();

//For copying as a default
var scores = {
	"98": 0,
	"50": 0,
	"60": 0,
	"64": 0,
	"66": 0,
	"81": 0,
	"24": 0,
	"25": 0,
	"20": 0,
	"21": 0,
	"22": 0,
	"23": 0,
	"44": 0,
	"40": 0,
	"41": 0,
	"96": 0,
	"77": 0,
	"76": 0,
	"72": 0,
	"97": 0,
	"58": 0,
	"99": 0,
	"13": 0,
	"12": 0,
	"15": 0,
	"14": 0,
	"17": 0,
	"16": 0,
	"19": 0,
	"18": 0,
	"30": 0,
	"37": 0,
	"36": 0,
	"34": 0,
	"33": 0,
	"55": 0,
	"48": 0
}

// Tristan's Edits
var exempt = JSON.parse(fs.readFileSync('exempt.json', 'utf-8'));
var ePeople = Object.keys(exempt);
for (i in ePeople) {
	if (exempt[ePeople[i]][1] == 0) {
		$('.err-no-ten-' + ePeople[i]).replaceWith('<a class="exempted-' + ePeople[i] + '" data-toggle="tooltip" data-placement="right auto" style="text-decoration: none; color: green; cursor: pointer;" title="' + exempt[ePeople[i]][0] + ' is exempted">&#10003;</a>');
	} else {
		$('.err-no-ten-' + ePeople[i]).replaceWith('<a class="exempted-' + ePeople[i] + '" data-toggle="tooltip" data-placement="right auto" style="text-decoration: none; color: green; cursor: pointer;" title="' + exempt[ePeople[i]][0] + ' is exempted but has to scout ' + exempt[ePeople[i]][1] + ' matches">&#10003;</a>');
	}
}
$('[data-toggle="tooltip"]').tooltip();
