const Game = function(){

	
	this.updateHeaderText = function(textValue){

		$(".page-header.text-center>h1").text(textValue);
	};
	//empties the container that avatar portraits are stored within
	//updates the caption element for related character
	//the updateCharacterPoolElement should be called after to update the container with the new avatar portrait and its caption
	this.updateCharacterCaption = function (characterObj, pool){

		$(this.characterContainerElements[pool]).empty();
		characterObj.avatarAttributesElement = $("<div class=\"caption\">" + characterObj.characterName.toUpperCase() +
												 " | HP: " + characterObj.currentHealthPoints +" | AP: " + characterObj.currentAttackPower+
												 " | cAP: " + characterObj.counterAttackPower + "</div>");
	}
	//easy way to lookup character containers/zones by passing a string
	this.mapCharacterContainers = function(){
		this.characterContainerElements = {
		neutral : $(".neutral.character-container"),
		attacker : $(".attacker.character-container"),
		defender  : $(".defender.character-container")
	}

	};

	this.setPlayerName = function(characterName){
		this.playerSelected = true;
		this.playerCharacterName = characterName;
	}

	this.getPlayerName = function(){

		return this.playerCharacterName;
	}

	this.setEnemyName = function(enemyName){
		this.enemySelected = true;
		this.enemyName = enemyName;
	}

	this.getEnemyName = function(){
		return this.enemyName;
	}

	this.addCharacters = function(characterPool){

		for(let i = 0 ; i < characterPool.length; i++){

			this.characterMap[characterPool[i].characterName] = characterPool[i];
		}
	};
	//adds a character object's avatar portrait and caption to a specific container
	this.updateCharacterPoolElement = function(characterObj,pool){
					
			this.characterContainerElements[pool].append(characterObj.avatarElement);
			this.characterContainerElements[pool].append(characterObj.avatarAttributesElement);		
	};
	//empties a specific container
	this.emptyCharacterContainer = function(container){

		this.characterContainerElements[container].empty();


	}
	//empties all containres for initialization
	this.emptyAllCharacterContainers = function(){

		
		for(key in this.characterContainerElements){

			this.characterContainerElements[key].empty();
		}		

	}
	//fills a specific pool with a list of character objects and their avatar elements and attributes
	this.regeneratePoolElements = function(avatarList,pool){

		for(let i = 0; i < avatarList.length; i++){

			this.characterContainerElements[pool].append(avatarList[i].avatarElement);
			this.characterContainerElements[pool].append(avatarList[i].avatarAttributesElement);
		}

	}

	this.winGame = function(characterObj){

		console.log(characterObj.characterName + " has won the game!");
		this.updateHeaderText(characterObj.characterName.toUpperCase() + " has WON! Press restart to play again.");
	};
	this.loseGame = function(characterObj){

		console.log(characterObj.characterName + " has lost the game!");
		this.updateHeaderText("Sorry, " + characterObj.characterName.toUpperCase() + " has LOST! Press restart to play again");
	}
	//Clears the defender/enemy container of avatar/caption
	//Deletes the enemy from the character map
	//resets the condition for enemy selected
	//updates instructions
	this.nextEnemy = function (defender){

		this.emptyCharacterContainer("defender");
		delete this.characterMap[defender.characterName];
		this.enemySelected = false;
		this.updateHeaderText("Click to choose a new enemy!");

	};
	//checks if attacker and defender are alive
	//begin the attack function

	this.fight = function(attacker,defender){
		if(!attacker.isDead && !defender.isDead){
			attacker.attack(defender);
		}
		
	};
	//check who won the previous battle
	//check who is dead and set tie if both dead
	//if attacker/player is dead, lose game function
	//if defender/enemy is dead, remove from characterMap
	//update instructions
	//if theres only 1 person remaining in the pool we safely presume it's the player since we checked elsewhere
	this.checkWinner = function(attacker,defender){

		if(attacker.isDead  && defender.isDead){ //attacker and defender dead is a Tie
			this.updateHeaderText("You both died! It's a TIE. Please restart to try again. PS this should never happen");
		} 
		else if(attacker.isDead){ //attacker dead is a game lost
			this.loseGame(attacker);
		}	
		else if(defender.isDead){ //defender dead is choose next enemy

			
			if(Object.keys(this.characterMap).length > 1 ){
				this.nextEnemy(defender);
				console.log(Object.keys(this.characterMap).length);
			}

			 if(Object.keys(this.characterMap).length === 1){
				this.winGame(attacker);
			} 
			
		}
		

	}
	//used to start and or reset the game
	this.initialize = function(){

	const luke = new Character("luke",120,8,25);
	const jarjar = new Character("jarjar", 100,15,5);
	const vader = new Character("vader", 150,20,10);
	const mace = new Character("mace",175, 40, 30);
	const characterList = [luke, jarjar,vader,mace];

	this.playerSelected = false;
	this.enemySelected = false;
	this.playerCharacterName = "NONE";
	this.enemyName = "NONE";
	this.characterMap = {}; //empty characterMap
	this.addCharacters(characterList);//adds default characters to map
	this.mapCharacterContainers(); //add the characterContainer elements e.g. $(".classname") to object for easy lookup
	this.emptyAllCharacterContainers(); //empty the characterContainers of children
	this.regeneratePoolElements(characterList, "neutral");//add avatars to the character pool/selection container
	this.updateHeaderText("Select your character");
	};
//-----------------------------------------------------------------------
//When constructor is called, initialize the object's values
	this.initialize();


};


const Character = function(characterName,baseHealthPoints,baseAttackPower,
					counterAttackPower){

		this.characterName = characterName;
		this.baseHealthPoints = baseHealthPoints 
		this.currentHealthPoints = baseHealthPoints;
		this.baseAttackPower = baseAttackPower;
		this.currentAttackPower = baseAttackPower;
		this.counterAttackPower = counterAttackPower;
		this.isAttacker = false;
		this.isDead = false;
		this.avatar = "./assets/images/"+ characterName + ".jpg";
		this.classes = [ "img-fluid","character-avatar"];
		//Create an image element with the avatars photo, styling and assign the characterName as the value to be returned

		this.avatarElement = $("<img src=" + this.avatar + " class=\"" + this.classes.join(" ") + "\" " 
								+"value=\"" + characterName + "\"" +  "alt=\"Responsive image\">");
		//Create a caption with the attributes of our avatar
		this.avatarAttributesElement = $("<div class=\"caption\">" + this.characterName.toUpperCase() +
												 " | HP: " + this.currentHealthPoints +" | AP: " + this.currentAttackPower+
												 " | cAP: " + this.counterAttackPower + "</div>");
		//---------------------CHARACTER FUNCTIONS---------------------------------------------------
		//attack and pass in defender object 
		//inner functions pass in references rather than value
		//character attacks
		//defender defends (damage calculation)
		//defender counterAttacks 
		//counterAttack is passed the Attacker object and the Attacker calls the defend function

		this.increaseAttackPower = function(){

			this.currentAttackPower += this.baseAttackPower;
		}
		this.attack = function(defendingCharacter){

			this.isAttacker = true;
			console.log( this.characterName + " attacks " + defendingCharacter.characterName);
			defendingCharacter.defend(this); //enemy defends - takes damage
			defendingCharacter.counterAttack(this); //enemy counter attacks 
			this.isAttacker = false;
			this.increaseAttackPower();



		};
		
		this.defend = function(attackingCharacter){

			let attackDamage = 0;
			let attackType;
			
			if(this.isAttacker){

				this.currentHealthPoints -= attackingCharacter.counterAttackPower;
				attackDamage = attackingCharacter.counterAttackPower;
				attackType = " counter-attack ";
				
			}
			else if(!this.isAttacker){

				this.currentHealthPoints -= attackingCharacter.currentAttackPower;
				attackDamage = attackingCharacter.currentAttackPower;
				attackType = " normal attack "
			}
			


			console.log(this.characterName + " takes " + attackDamage + " points of damage from a "  + attackType);

			if(this.currentHealthPoints <= 0){
				this.isDead = true;
				console.log(this.characterName + " has DIED");
			}

		};
		//Attack the original attacker (character who called the "attack" function)
		//we call the defend function because this is the only function that calculates damage
		this.counterAttack = function(attackingCharacter){

			if(this.currentHealthPoints > 0){
				attackingCharacter.defend(this);
			}
			
			

		};
	};
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////

$( document ).ready(function(){
	
	
	const newGame = new Game();


	$(document).on('click', '.character-avatar.img-fluid', function(){

		const clickValue = $(this).attr("value");

		if(!newGame.playerSelected){	
			const attacker = newGame.characterMap[clickValue];	
			newGame.setPlayerName(clickValue);
			newGame.updateCharacterPoolElement(attacker, "attacker");
			newGame.updateHeaderText("Select your enemy!");
		}
		else if(!newGame.enemySelected && clickValue !== newGame.getPlayerName()){	
			const defender = newGame.characterMap[clickValue];	
			newGame.setEnemyName(clickValue);
			newGame.updateCharacterPoolElement(defender, "defender");
			newGame.updateHeaderText("Click FIGHT!");
		}

	});

	$(document).on('click', '.btn.btn-default', function(){
	
		const clickValue = $(this).attr("value");

		if(newGame.playerSelected && newGame.enemySelected && clickValue === "attack"){
			
			const attacker = newGame.characterMap[newGame.playerCharacterName];
			const defender = newGame.characterMap[newGame.enemyName];

			newGame.fight(attacker, defender);	
			newGame.updateCharacterCaption(attacker,"attacker");
			newGame.updateCharacterCaption(defender,"defender");
			newGame.updateCharacterPoolElement(attacker,"attacker");
			newGame.updateCharacterPoolElement(defender,"defender");
			newGame.checkWinner(attacker,defender);

			console.log("Player: " + attacker.currentHealthPoints)
			console.log("Enemy: " + defender.currentHealthPoints);	
		}
		else if (clickValue === "restart"){
			newGame.initialize();							
		}

	
	});

});
