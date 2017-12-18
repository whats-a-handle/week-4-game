const Game = function(){

	
	this.updateHeaderText = function(textValue){

		$(".page-header.text-center>h1").text(textValue);


	};
	
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

	this.updateCharacterPoolElement = function(characterName,pool){

			this.characterContainerElements[pool].append(this.characterMap[characterName].avatarElement);		
	};

	this.emptyCharacterContainer = function(container){

		this.characterContainerElements[container].empty();


	}
	this.emptyCharacterContainers = function(){

		
		for(key in this.characterContainerElements){

			this.characterContainerElements[key].empty();
		}		

	}
	this.regeneratePoolElements = function(avatarList,pool){

		for(let i = 0; i < avatarList.length; i++){

			this.characterContainerElements[pool].append(avatarList[i].avatarElement);
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
	this.nextEnemy = function (defender){

		this.emptyCharacterContainer("defender");
		delete this.characterMap[defender.characterName];
		this.enemySelected = false;
		this.updateHeaderText("Click to choose a new enemy!");

	};

	this.fight = function(attacker,defender){
		if(attacker.currentHealthPoints> 0 && defender.currentHealthPoints > 0){
			attacker.attack(defender);
		}
		else{
			console.log("one of the characters is dead lol...");
		}
		

	};
	this.checkWinner = function(attacker,defender){

		if(attacker.currentHealthPoints <= 0 && defender.currentHealthPoints <= 0){ //attacker and defender dead is a Tie
			attacker.isDead = true;
			defender.isDead = true;
		} 
		else if(attacker.currentHealthPoints <= 0){ //attacker dead is a game lost
			attacker.isDead = true;
			this.loseGame(attacker);
		}	
		else if(defender.currentHealthPoints <= 0){ //defender dead is choose next enemy

			defender.isDead = true;
			//we already check if attacker health is > 0 in our outter if-statement so no need to do it again
			console.log(Object.keys(this.characterMap).length);
			if(Object.keys(this.characterMap).length > 1 ){
				this.nextEnemy(defender);
				console.log(Object.keys(this.characterMap).length);
			}

			 if(Object.keys(this.characterMap).length === 1 ){
				this.winGame(attacker);
			} 
			
		}
		

	}
	//used to start and or reset the game
	this.initialize = function(){

	const luke = new Character("luke",100,10,25);
	const jarjar = new Character("jarjar", 90,5,40);
	const vader = new Character("vader", 150,20,10);
	const mace = new Character("mace",200, 40, 30);
	//const characterList = [luke, jarjar,vader,mace];
	const characterList = [luke,mace];
	this.playerSelected = false;
	this.enemySelected = false;
	this.playerCharacterName = "NONE";
	this.enemyName = "NONE";
	this.characterMap = {}; //empty characterMap
	this.addCharacters(characterList);//adds default characters to map
	this.mapCharacterContainers(); //add the characterContainer elements e.g. $(".classname") to object for easy lookup
	this.emptyCharacterContainers(); //empty the characterContainers of children
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
		this.avatar = "./assets/images/"+ characterName + ".jpg";
		this.classes = [ "img-fluid","character-avatar"];
		//Create an image element with the avatars photo, styling and assign the characterName as the value to be returned
		this.avatarElement = $("<img src=" + this.avatar + " class=\"" + this.classes.join(" ") + "\" " 
								+"value=\"" + characterName + "\"" +  "alt=\"Responsive image\">");
		this.baseAttackPower = baseAttackPower;
		this.currentAttackPower = baseAttackPower;
		this.counterAttackPower = counterAttackPower;
		this.isAttacker = false;
		this.isDead = false;

		//---------------------CHARACTER FUNCTIONS---------------------------------------------------
		//attack and pass in defender object 
		//inner functions pass in references rather than value
		//character attacks
		//defender defends (damage calculation)
		//defender counterAttacks 
		//counterAttack is passed the Attacker object and the Attacker calls the defend function
		this.attack = function(defendingCharacter){

			this.isAttacker = true;
			console.log( this.characterName + " attacks " + defendingCharacter.characterName);
			defendingCharacter.defend(this); //enemy defends - takes damage
			defendingCharacter.counterAttack(this); //enemy counter attacks 
			this.isAttacker = false;


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
			

		};
		//Attack the original attacker (character who called the "attack" function)
		//we call the defend function because this is the only function that calculates damage
		this.counterAttack = function(attackingCharacter){

			attackingCharacter.defend(this);
			console.log(this.characterName + " counter-attacks for " + this.counterAttackPower + " points of damage");

		};
	};
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////

$( document ).ready(function(){
	
	
	const newGame = new Game();


	$(document).on('click', '.character-avatar.img-fluid', function(){
		
		const clickValue = $(this).attr("value");

		if(!newGame.playerSelected){		
			newGame.setPlayerName(clickValue);
			newGame.updateCharacterPoolElement(newGame.getPlayerName(), "attacker");
			newGame.updateHeaderText("Select your enemy!");
		}
		else if(!newGame.enemySelected && clickValue !== newGame.getPlayerName()){		
			newGame.setEnemyName(clickValue);
			newGame.updateCharacterPoolElement(newGame.getEnemyName(), "defender");
			newGame.updateHeaderText("Click FIGHT!");
		}

	});

	$(document).on('click', '.btn.btn-default', function(){
	
		const clickValue = $(this).attr("value");

		if(newGame.playerSelected && newGame.enemySelected && clickValue === "attack"){
			
			const attacker = newGame.characterMap[newGame.playerCharacterName];
			const defender = newGame.characterMap[newGame.enemyName];

			newGame.fight(attacker, defender);	
			newGame.checkWinner(attacker,defender);

			console.log("Player: " + attacker.currentHealthPoints)
			console.log("Enemy: " + defender.currentHealthPoints);	
		}
		else if (clickValue === "restart"){
			newGame.initialize();							
		}

	
	});

	
	

	
	
	

});
