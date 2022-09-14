var gameData = {
	seedData: {},
	inventoryData: {},
	marketInventory: {},
	activePlots: [],
	achievements: {},
	multipliers: {
		growSpeed: [1],
		waterSpeed: [1],
		harvestSpeed: [2.5],
	},
	speed: {water: 0.25, harvest: 0.1},
	currentAction: null,
	currentSeed: null,
	currentPlot: null,
	sellAmt: 1,
	gold: 1,
	researchPlants: [],
	acheivementData: null,
}

var modals = {"acheivementsModal": false};

var media = window.matchMedia("(min-width: 768px)");

function addResearchPlants(){
	gameData.researchPlants.push({plant: "Potato", type: "Nutrient Needs", need: "potatoes", cost: 100, unlock: ['inventoryData','Potato','amt']});
	gameData.researchPlants.push({plant: "Potato", type: "Grow Rate",need: "potato seeds", cost: 50, unlock: ['seedData','potatoSeeds','amt']});
}

const seedBaseData = {
	"potatoSeeds": {name: "Potato", amt: 0, cost: 1, buyAmt: 10, kNeed: 10, kStDv: 2, kDeposit: -1, pNeed: 50, pStDv: 15, pDeposit: 1, nNeed: 12, nStDv: 2, nDeposit: 0, waterNeed: 100, maxHarvest: 100, growRate: 3000},	
	"tomatoSeeds": {name: "Tomato", amt: 0, cost: 3, buyAmt: 8, kNeed: 40, kStDv: 16, kDeposit: 2, pNeed: 9, pStDv: 1, pDeposit: -1, nNeed: 15, nStDv: 3, nDeposit: -2, waterNeed: 70, maxHarvest: 80, growRate: 5000},	
	"watermelonSeeds": {name: "Watermelon", amt: 0, cost: 10, buyAmt: 3, kNeed: 40, kStDv: 16, kDeposit: 2, pNeed: 9, pStDv: 1, pDeposit: -1, nNeed: 15, nStDv: 3, nDeposit: -2, waterNeed: 80, maxHarvest: 110, growRate: 5000},	
	"grapeSeeds": {name: "Grape", amt: 0, cost: 15, buyAmt: 5, kNeed: 40, kStDv: 16, kDeposit: 2, pNeed: 9, pStDv: 1, pDeposit: -1, nNeed: 15, nStDv: 3, nDeposit: -2, waterNeed: 85, maxHarvest: 500, growRate: 5000},	
}

const plotBaseData = {
	"plotOne": {name: "plotOne", seed: null, k: 0, p: 0, n: 0, water: 50, growthProgress: 0, harvestProgress: 0, cost: 0, disabled: false},
	"plotTwo": {name: "plotTwo", seed: null, k: 0, p: 0, n: 0, water: 50, growthProgress: 0, harvestProgress: 0, cost: 50, disabled: false},
	'plotThree': {name: "plotThree", seed: null, k: 0, p: 0, n: 0, water: 50, growthProgress: 0, harvestProgress: 0, cost: 2000, disabled: false},
	"plotFour": {name: "plotFour", seed: null, k: 0, p: 0, n: 0, water: 50, growthProgress: 0, harvestProgress: 0, cost: 425000, disabled: false}
}

const plantBaseData = {
	"Potato": {name: "Potatoes", amt: 0, price: .10, baseSize: 1, specialSize: 20},
	"Tomato": {name: "Tomatoes", amt: 0, price: .50, baseSize: 1, specialSize: 15},
	"Watermelon": {name: "Watermelon", amt: 0, price: 1.50, baseSize: 1, specialSize: 15},
	"Grape": {name: "Grape", amt: 0, price: .10, baseSize: 1, specialSize: 15},
}

const achievements = {
	potatoFarmer: {name: "Potato Farmer", requirementObjects: [gameData.inventoryData.Potato], requirementSatisfaction: [10], toolTip: "Harvest 10 Potatoes"},
	tomatoFarmer: {name: "Tomato Farmer", requirementObjects: [gameData.inventoryData.Tomato], requirementSatisfaction: [10], toolTip: "Harvest 10 Tomatoes"},
}

const requirements = {
	"potatoSeeds": [{requirement: ['gold'], condition: "moreThan", fulfillment: 0}],
	"tomatoSeeds": [{requirement: ['seedData','potatoSeeds','amt'], condition: "moreThan", fulfillment: 10}],
	"watermelonSeeds": [{requirement: ['inventoryData','Potato','amt'], condition: "equalTo", fulfillment: 0},{requirement: ['seedData','potatoSeeds','amt'], condition: "moreThan", fulfillment: 10}],
	"grapeSeeds": [{requirement: ['inventoryData','Tomato','amt'], condition: "lessThan", fulfillment: 10}],
}

const researchPlants = [
	{plant: "Potato", type: "Nutrient Needs", need: "potatoes", cost: 100, unlock: ['inventoryData','Potato','amt']},
	{plant: "Potato", type: "Grow Rate", need: "potato seeds", cost: 50, unlock: ['seedData','potatoSeeds','amt']},
	{plant: "Potato", type: "Max Harvest", need: "potato seeds", cost: 50, unlock: ['seedData','potatoSeeds','amt']},
	{plant: "Potato", type: "Water Needs", need: "potato seeds", cost: 50, unlock: ['seedData','potatoSeeds','amt']},
];

const acheivementData = {
	"Potato Ward": {name: "Potato Ward", img: "img/trophy.png", hint: "Buy Tomato Seeds for the first time", hintUnlock: ['seedData','tomatoSeeds'], tooltip: "Harvest 100 potatoes", requirement: ['inventoryData','Potato','amt'], condition: 100, complete: false},
	"Tomato Dud": {name: "Tomato Dud", img: "img/tractor.gif", hint: "Buy Watermelon Seeds for the first time", hintUnlock: ['seedData','watermelonSeeds'], tooltip: "Harvest 100 tomatoes", requirement: ['inventoryData','tomato','amt'], condition: 100, complete: false},
}

function addAcheivementData(){
	gameData.acheivementData = acheivementData;
}

function addBaseData(){

	gameData.activePlots.push(plotBaseData.plotOne);
	
}

function addAcheivementItem(item,menu){
	const newItem = document.createElement('div');
	newItem.id = item.name;
	newItem.classList.add('acheivementItem');
	const newImg = document.createElement('img');
	newImg.src = item.img;
	newImg.setAttribute('style','max-width:100%');
	newImg.setAttribute('style','max-height:100%');
	if(item.complete){
		newItem.style.backgroundColor = "lightgreen";
	}
	newItem.onclick = function(){showBigAcheivement(item)};
	newItem.appendChild(newImg);
	document.getElementById(menu).appendChild(newItem);
}

function addPlantResearch(item,menu){
	const newItem = document.createElement('div');
	newItem.id = item.name;
	newItem.classList.add('researchItem');
	newItem.innerHTML = item.plant + " " + item.type + "</br>" + item.cost + " " + item.need;
	newItem.onclick = function(){buyResearch(item)};
	document.getElementById(menu).appendChild(newItem);
}

function addInventory(item,menu){
	const newItem = document.createElement('div');
	newItem.id = item.name;
	newItem.classList.add('inventoryItem');
	newItem.innerHTML = item.name + "</br>" + item.amt;
	if(menu == 'seeds'){
		newItem.onclick = function(){selectSeed(item.name)};
	}
	document.getElementById(menu).appendChild(newItem);
}

function addItemToMarket(item,name,menu){
	const newItem = document.createElement('div');
	newItem.classList.add('marketItem');
	if(menu == 'seedsForSale'){
		newItem.innerHTML = item.name + "</br>" + item.buyAmt + "/" + item.cost + "g";
		newItem.onclick = function(){buySeed(item,name)};
	}else if(menu == 'inventoryToSell'){
		//do the math to see how much total
		for(key in gameData.multipliers){
			if(key == item.name){
				var multiplier = speedMultiplier(gameData.multipliers[key]);
			}else{
				var multiplier = 1;
			}
		}
		var finalPrice = item.price * multiplier * gameData.sellAmt;
		var display = finalPrice;
		if(!Number.isInteger(finalPrice)){
			display = Number(finalPrice).toFixed(2);
		}
		newItem.innerHTML = item.name + "</br>" + gameData.sellAmt + " x " + display + "g";
		newItem.onclick = function(){sellInventory(item,gameData.sellAmt,finalPrice)};
	}
	document.getElementById(menu).appendChild(newItem);
}

function addLibrary(){ //<div id="libraryButton" class="locationButton" onclick="selectLocation('library');">Library</div>
	const newItem = document.createElement('div');
	newItem.id = "libraryButton";
	newItem.classList.add('locationButton');
	newItem.innerHTML = "Library";
	newItem.onclick = function(){selectLocation('library')};
	document.getElementById('locationMenu').appendChild(newItem);
}

function updateGold(){
	document.getElementById('gold').innerHTML = gameData.gold + 'g';
}

function updatePlot(plot){
	
}

function speedMultiplier(speed){
	var speed = speed.reduce((a,b) => a*b);
	return speed
}

function getSum(total, num){
	return total * num;
}

function increaseGrowth(){
	for (let i = 0; i < gameData.activePlots.length; i++){
		var plot = gameData.activePlots[i];
		var plotProgress = plot.name + "Progress";
		var progressBar = document.getElementById(plotProgress);
		var plotWaterProgress = plot.name + "Water";
		var waterProgressBar = document.getElementById(plotWaterProgress);
		if(plot.seed){
			//figure out how to make growRate == 100%
			if(plot.growthProgress < 100){
				var multiplier = speedMultiplier(gameData.multipliers.growSpeed)
				var timeToGrow = plot.seed.growRate/100;
				var increment = 100/timeToGrow;
				plot.growthProgress += increment*multiplier;
				plot.water--;
				if(plot.water < 0){
					plot.water = 0;
				}
				var percent = plot.growthProgress/plot.seed.growRate;
				progressBar.style.height = plot.growthProgress + "%"; //whatever multipliers we have
				waterProgressBar.style.height = plot.water + "%"; //whatever multipliers we have
			}else if(plot.harvestProgress != 0){
				var check = progressBar.classList.contains("dark");
				if(!check){
					progressBar.classList.add('dark');
					waterProgressBar.classList.add('dark');
				}
			}
			if(plot.growthProgress > 100){
				plot.growthProgress = 100;
				progressBar.style.height = plot.growthProgress + "%";
			}
		}
	}
}

function selectAction(action){
	var actionID = action + "Action";
	var selection = document.getElementById(actionID);
	var items = document.getElementsByClassName('actionButton');
	for(let i = 0; i < items.length; i++){
		items[i].classList.remove('pressed');
		items[i].style.borderColor = 'black';
	}
	if(gameData.currentAction != action){
		selection.classList.add('pressed');
		selection.style.borderColor = 'white';
		gameData.currentAction = action;
	}else{
		gameData.currentAction = null;
	}
}

function selectLocation(place){
	var buttonID = place + "Button";
	var selection = document.getElementById(buttonID);
	var locationID = place + "Space";
	var selectedLocation = document.getElementById(locationID);
	var items = document.getElementsByClassName('locationButton');
	for(let i = 0; i < items.length; i++){
		items[i].classList.remove('pressed');
		items[i].style.borderColor = 'black';
	}
	var places = document.getElementsByClassName('locationSpace');
	for(let j = 0; j < places.length; j++){
		places[j].classList.add('hidden');
	}
	selectedLocation.classList.remove('hidden');
	selection.classList.add('pressed');
	selection.style.borderColor = 'white';
	if(place == "market"){
		clearMarket('marketSpace');
		displaySeedsForSale();
		displayInventoryToSell();
	}
	if(place == "library"){
		clearMarket('librarySpace');
		displayPlantResearch();
	}
}

function selectPlot(plot){
	
	if(gameData.currentPlot == null || gameData.currentPlot.name != plot){
		for(let j = 0; j < gameData.activePlots.length; j++){
			if(gameData.activePlots[j].name == plot){
				var selection = document.getElementById(plot);
				var items = document.getElementsByClassName('gardenPlot');
				for(let i = 0; i < items.length; i++){
					items[i].style.borderWidth = '1px';
				}
				selection.style.borderWidth = '3px';
				gameData.currentPlot = gameData.activePlots[j];
				return
			}
		}
		for(key in plotBaseData){
			if(key == plot){
				if(gameData.gold >= plotBaseData[key].cost){
					gameData.activePlots.push(plotBaseData[key]);
					gameData.gold -= plotBaseData[key].cost;
					updateInventory(gameData.seedData);
					var lockID = plot + 'Locked';
					var lock = document.getElementById(lockID);
					lock.remove();
					selectPlot(plot);
				}
			}
		}
	}else{
		gameData.currentPlot = null;
		var selection = document.getElementById(plot);
		var items = document.getElementsByClassName('gardenPlot');
		for(let i = 0; i < items.length; i++){
			items[i].style.borderWidth = '1px';
		}
	}
}

function selectSeed(seed){
	var selection = document.getElementById(seed);
	var items = document.getElementsByClassName('inventoryItem');
	for(let i = 0; i < items.length; i++){
		items[i].style.borderWidth = '1px';
	}
	if(gameData.currentSeed == null || gameData.currentSeed.name != seed){
		selection.style.borderWidth = '3px';
		
		for(let j in gameData.seedData){
			
			if(gameData.seedData[j].name == seed){
				gameData.currentSeed = gameData.seedData[j];
				return
			}
		}
	}else{
		gameData.currentSeed = null;
	}
}

function checkRequirements(key){
	
		for(let i = 0; i < requirements[key].length; i++){
			var check = getData(requirements[key][i].requirement);
			if(requirements[key][i].condition == "moreThan" && !(check > requirements[key][i].fulfillment)){
				return 
			}else if(requirements[key][i].condition == "equalTo" && check != requirements[key][i].fulfillment){
				return 
			}else if(requirements[key][i].condition == "lessThan" && !(check < requirements[key][i].fulfillment)){
				return 
			}
		}
		return key
}

function getData(value){
	var check = gameData;
	var test;
	for(let i = 0; i < value.length; i++){
		var x = value[i];
		for(key in check){
			if(key == x){
				
				test = check[key];
				check = test;
			}
		}
	}
	return test
}

function findSeedToDisplay(seed){
	for(key in seedBaseData){
		if(key == seed){
			return seedBaseData[key]
		}
	}
}

function checkInventory(plant){
	for(key in gameData.inventoryData){
		if(key == plant){
			return true
		}else{
			return false
		}
	}
}

function displayPlantResearch(){
	for(let i = 0; i < gameData.researchPlants.length; i++){
		var check = checkInventory(gameData.researchPlants[i].plant);
		if(check){
			addPlantResearch(gameData.researchPlants[i],'libraryItems');
		}
	}
}

function displaySeedsForSale(){
	//check all seed requirements
	for(key in requirements){	
		var seed = findSeedToDisplay(checkRequirements(key));
		
		if(seed){
			addItemToMarket(seed,key,'seedsForSale');
		}
	}
	//if fulfilled, create element 
}

function displayInventoryToSell(){
	for(key in gameData.inventoryData){
		if(gameData.inventoryData[key].amt > 0){
			addItemToMarket(gameData.inventoryData[key],key,'inventoryToSell');
		}
	}
}

function displayAcheivements(){
	console.log(gameData.acheivementData);
	for(key in gameData.acheivementData){
		addAcheivementItem(gameData.acheivementData[key],'acheivementSpace');
	}
}

function clearMarket(div){
	var space = document.getElementsByClassName(div);
	
	for(let i = 0; i < space.length; i++){
		while(space[i].hasChildNodes()){
			space[i].removeChild(space[i].firstChild);
		}
	}
}

function buySeed(seed,seedName){
	if(gameData.gold >= seed.cost){
		if(!(seedName in gameData.seedData)){
				gameData.seedData[seedName] = {name: seed.name, amt: seed.buyAmt, buyAmt: seed.buyAmt, cost: seed.cost, maxHarvest: seed.maxHarvest, growRate: seed.growRate};
				addInventory(gameData.seedData[seedName],'seeds');
				gameData.gold -= gameData.seedData[seedName].cost;
				updateInventory(gameData.seedData);
			
		}else{
			for(let x in gameData.seedData){
					if(gameData.gold >= gameData.seedData[seedName].cost){
						gameData.seedData[seedName].amt += seed.buyAmt;
						gameData.gold -= gameData.seedData[seedName].cost;
						updateInventory(gameData.seedData);
					}
				}
		}
	}	
}


function sellInventory(inv,amt,gold){
	if(inv.amt > 0){
		inv.amt -= amt;
		gameData.gold += gold;
		updateInventory(gameData.inventoryData);
	}
}

function buyResearch(item){
	if(item.type == "Nutrient Needs"){
		//unlock tool tips.
	}
}

function showBigAcheivement(item){
	var div = document.getElementById('highlightedAcheivement');
	var icon = document.getElementById('highlightedIcon');
	var info = document.getElementById('highlightedInfo');
	if(media.matches){
		if(div.style.width == 0){
			div.style.width = '30%';
		}
	}else{
		if(div.style.height == 0){
			div.style.height = '30%';
		}
	}
	icon.src = item.img;
	if(!item.hint){
		info.innerHTML = "<span style='font-size: 25px'>" + item.name + "</span></br>" + item.tooltip;
	}else {
		info.innerHTML = "<span style='font-size: 25px'>" + item.name + "</span></br>Hint: " + item.hint;
	}
	toggleModal('acheivementsModal');
}


function updateInventory(menu){
	var items = document.getElementsByClassName('inventoryItem');
	for(let i = 0; i < items.length; i++){
		for(let x in menu){
		
			if(menu[x].name == items[i].id){
				items[i].innerHTML = menu[x].name + "</br>" + menu[x].amt;
			}
		}
	}
	var gold = Math.round(gameData.gold*100)/100;
	
	if(!Number.isInteger(gold)){
		gold = Number(gold).toFixed(2);
	}
	document.getElementById('gold').innerHTML = gold + 'g';
}

function findDepositNeeds(seed){
	for(key in seedBaseData){
		if(seedBaseData[key].name == seed.name){
			var needs = {
				kNeed: seedBaseData[key].kNeed, kStDv: seedBaseData[key].kStDv, pNeed: seedBaseData[key].pNeed, pStDv: seedBaseData[key].pStDv, nNeed: seedBaseData[key].nNeed, nStDv: seedBaseData[key].nStDv, waterNeed: seedBaseData[key].waterNeed
			}
			return needs
		}
	}
}

function findDeposits(plot){
	for(key in seedBaseData){
		if(seedBaseData[key].name == plot.seed.name){
			var deposits = {
				kDeposit: seedBaseData[key].kDeposit, pDeposit: seedBaseData[key].pDeposit, nDeposit: seedBaseData[key].nDeposit
			}
			return deposits
		}
	}
}

function subtractDeposits(plot){
	var deposits = findDeposits(plot);
	plot.k += deposits.kDeposit;
	plot.p += deposits.pDeposit;
	plot.n += deposits.nDeposit;
	if(plot.k < 0){
		plot.k = 0;
	}
	if(plot.p < 0){
		plot.p = 0;
	}
	if(plot.n < 0){
		plot.n = 0;
	}
}

function calculateWaterMultiplier(need,actual){
	//add for higher than need
	if(actual == need || (actual < need+8 && actual > need-2)){
		return 1
	}else if(actual < need && actual >= need*.9){
		return .7
	}else if(actual < need*.9 && actual >= need*.75){
		return .5
	}else if(actual < need*.75 && actual >= need*.5){
		return .25
	}else if(actual < need*.5 && actual >= need*.25){
		return .2
	}else if(actual < need*.25){
		return .1
	}else{
		var tooMuch = 92 - actual;
		if(actual > ((tooMuch - (tooMuch*.75)) + need) && actual <= ((tooMuch - (tooMuch*.5)) + need)){
			return .7
		}else if(actual > ((tooMuch - (tooMuch*.5)) + need) && actual <= ((tooMuch - (tooMuch*.25)) + need)){
			return .5
		}else if(actual > ((tooMuch - (tooMuch*.25)) + need)){
			return .3
		}
	}
}

function calculateHarvestAmt(plot){
	if(plot.water == 0){
		var harvestAmt = plot.seed.maxHarvest * .05;
		return harvestAmt
	}
	//find all the needs
	var needs = findDepositNeeds(plot.seed);
	//find all the currents
	if(needs.kNeed != 0){
		var kMult = ((needs.kNeed - plot.k)/needs.kStDv)/10;
	}else{
		var kMult = 1;
	}
	if(needs.pNeed != 0){
		var pMult = ((needs.pNeed - plot.p)/needs.pStDv)/10;
	}else{
		var pMult = 1;
	}
	if(needs.nNeed != 0){
		var nMult = ((needs.nNeed - plot.n)/needs.nStDv)/10;
	}else{
		var nMult = 1;
	}
	var waterMult = calculateWaterMultiplier(needs.waterNeed,plot.water);
	var harvestAmt = plot.seed.maxHarvest*kMult*pMult*nMult*waterMult;
	harvestAmt = Math.floor(harvestAmt);
	if(harvestAmt <= 0){
		harvestAmt = plot.seed.maxHarvest * .05;
	}
	return harvestAmt

}

function checkValue(value){
	if(value){
		return value
	}
}

function showstuff(){
	console.log(gameData);
}

function toggleModal(spot){
	
	var div = document.getElementById(spot);
	for(key in modals){
		if(key == spot){
			if(!modals[key]){
				clearMarket('acheivementSpace');
				displayAcheivements();
				div.style.display = "block";
				console.log(modals,key);
				modals[spot] = true;
						

			}else{
				div.style.display = "none";
				modals[key] = false;
			}
		}
	}
}

function checkAcheivements(){
	
}

//88888888rhh8h

function doThePlotThings(){
	//check each plot for needed growth. and increase the progress bar and decrease water progress bar. if harvestGrowth is started, check if has class "harvest"
	increaseGrowth();
	//check if there is a selected plot.
	if(!gameData.currentPlot){
		return
	}else{
		var plotWaterProgress = gameData.currentPlot.name + "Water";
		var waterProgressBar = document.getElementById(plotWaterProgress);
		if(gameData.currentPlot.growthProgress < 100 && gameData.currentAction == 'water' && gameData.currentPlot.seed){			
			var multiplier = speedMultiplier(gameData.multipliers.waterSpeed);
			if(gameData.currentPlot.water < 100){
				gameData.currentPlot.water += 2*multiplier;
			}
		}else if(gameData.currentPlot.growthProgress >= 100){
			if(gameData.currentAction == 'water'){
				selectAction('water');
			}else if(gameData.currentAction == 'harvest'){
				var plotHarvestProgress = gameData.currentPlot.name + "Harvest";
				var harvestProgressBar = document.getElementById(plotHarvestProgress);
				var multiplier = speedMultiplier(gameData.multipliers.harvestSpeed);
				var check = harvestProgressBar.classList.contains('hidden');
				if(check){
					harvestProgressBar.classList.remove('hidden');
				}
				if(gameData.currentPlot.harvestProgress < 100){
					gameData.currentPlot.harvestProgress += 1*multiplier;
					harvestProgressBar.style.height = gameData.currentPlot.harvestProgress + "%";
				}else{
					//calculate inventory add
					var harvestAmt = calculateHarvestAmt(gameData.currentPlot);
					subtractDeposits(gameData.currentPlot);
					var name = gameData.currentPlot.seed.name;
					if(!(name in gameData.inventoryData)){
						gameData.inventoryData[name] = {name: plantBaseData[name].name, amt: harvestAmt, price: plantBaseData[name].price};
						addInventory(gameData.inventoryData[name],'inventory');
					}else{
						gameData.inventoryData[name].amt += harvestAmt;
						updateInventory(gameData.inventoryData);
					}
					selectAction('harvest');
					var plotProgress = gameData.currentPlot.name + "Progress";
					var progressBar = document.getElementById(plotProgress);
					gameData.currentPlot.water = 50;
					gameData.currentPlot.growthProgress = 0;
					gameData.currentPlot.harvestProgress = 0;
					gameData.currentPlot.seed = null;
					progressBar.style.height = gameData.currentPlot.growthProgress + '%';
					waterProgressBar.style.height = gameData.currentPlot.water + '%';
					harvestProgressBar.style.height = gameData.currentPlot.harvestProgress + '%';
					progressBar.classList.remove('dark');
					waterProgressBar.classList.remove('dark');
					selectPlot(gameData.currentPlot.name);					
					//check if inventory exists, if not add inventory
					//add to inventory
					//reset levels
				}
			}
		}
	}
	//check status of plot. if all done, add to inventory, change nutrient levels and reset water/progress/harvest and classes.
	
				
	//check if current plot has seed or not. if not, check current seed, if so add seed to plot and start growing.
	if(gameData.currentPlot && gameData.currentSeed && !gameData.currentPlot.seed){
		gameData.currentPlot.seed = gameData.currentSeed;
		gameData.currentSeed.amt--;
		updateInventory(gameData.seedData);
	}
	
	checkAcheivements();
	//ooocvhgggggxzazdsswww55rrrrrrrrrrrrrrrrrrrrrrrhfffffffffffffrtybgddddde3hay
}

function saveGameData() {
    localStorage.setItem("gameDataSave", JSON.stringify(gameData))
	console.log('saved');
}

function loadGameData(){
	if(localStorage.getItem('gameDataSave')){
		var gameDataSave = JSON.parse(localStorage.getItem("gameDataSave"));
		gameData = gameDataSave;
		updateInventory(gameData.seedData);
		updateInventory(gameData.inventoryData);
		for(key in gameData.seedData){
			addInventory(gameData.seedData[key],'seeds');
		};
		for(key in gameData.inventoryData){
			addInventory(gameData.inventoryData[key],'inventory');
		};
		for(let i = 0; i < gameData.activePlots.length; i++){
			if(gameData.activePlots[i].growthProgress >= 100){
				var id = gameData.activePlots[i].name + "Progress";
				document.getElementById(id).style.height = "100%";
				var waterID = gameData.activePlots[i].name + "Water";
				document.getElementById(waterID).style.height = gameData.activePlots[i].water + "%";
			}
		}
		gameData.currentPlot = null;
		gameData.currentSeed = null;
		gameData.currentAction = null;
	}
}

function resetGameData(){
	localStorage.removeItem('gameDataSave');
	for(let i = 0; i < gameData.activePlots.length; i++){
		var id = gameData.activePlots[i].name + "Progress";
		document.getElementById(id).style.height = "0%";
		var waterID = gameData.activePlots[i].name + "Water";
		document.getElementById(waterID).style.height = "50%";
		var harvestID = gameData.activePlots[i].name + "Harvest";
		document.getElementById(harvestID).style.height = "0%";
	}
	gameData = {
		seedData: {},
		inventoryData: {},
		marketInventory: {},
		activePlots: [],
		achievements: {},
		multipliers: {
			growSpeed: [1],
			waterSpeed: [1],
			harvestSpeed: [2.5],
		},
		speed: {water: 0.25, harvest: 0.1},
		currentAction: null,
		currentSeed: null,
		currentPlot: null,
		sellAmt: 1,
		gold: 1,
		researchPlants: [],
		acheivementData: null,
	}
	addBaseData();
	addResearchPlants();
	updateGold();
	selectLocation('garden');
	clearMarket('itemSpace');
	addAcheivementData();
}

addBaseData();
addResearchPlants();
addAcheivementData();
updateGold();
selectLocation('garden');
addLibrary();
loadGameData();


setInterval(doThePlotThings,100);
setInterval(saveGameData,30000);


//