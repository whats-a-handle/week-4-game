const Game = function(){

	this.playerCharacterName = "NONE";
	this.playerSelected = false;
	this.enemySelected = false;
	this.enemyName = "NONE";
	this.round = 1;
	this.characterMap = {}; // will be used for characterName : characterObj  "key-value" pairs for jQuery onClick return values
	this.poolElements = {

		neutral : $(".neutral.character-container"),
		attacker : $(".attacker.character-container"),
		defender  : $(".defender.character-container")

	} ;
	
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

	this.addCharacter = function(characterObj){

		this.characterMap[characterObj.characterName] = characterObj;
	};

	this.addCharacters = function(characterPool){

		for(let i = 0 ; i < characterPool.length; i++){

			this.characterMap[characterPool[i].characterName] = characterPool[i];
		}
	};

	this.updateCharacterPoolElement = function(characterName,pool){

			this.poolElements[pool].append(this.characterMap[characterName].avatarElement);		
	};

	this.regeneratePoolElements = function(avatarList,pool){

		for(let i = 0; i < avatarList.length; i++){

			this.poolElements[pool].append(avatarList[i].avatarElement);
		}

	}

	//STARTS and also RESETS the game
	this.resetGame = function(){

	var luke = new Character("luke",100,10,25);
	var jarjar = new Character("jarjar", 90,5,40);
	var vader = new Character("vader", 150,20,10);
	var mace = new Character("mace",200, 40, 30);
	var characterList = [luke, jarjar,vader,mace];
	this.addCharacters(characterList);
	this.regeneratePoolElements(characterList, "neutral");

	};

	//We want a newGame to be created with this default info
	//Set the game up upon instantiation
	this.resetGame();
	
	

};


const Character = function(characterName,baseHealthPoints,baseAttackPower,
					counterAttackPower){
		//--------------CHARACTER ATTRIBUTES-------------------------------------------------------
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

			//TODO
			//check if defender was original attacker
			//If defender is original attacker, they should take counterAttack damage
			//If defender is not original attacker they should take currentAttackPower damage
			let attackDamage = 0;
			let attackType = "normal attack";
			
			if(this.isAttacker){

				this.currentHealthPoints -= attackingCharacter.counterAttackPower;
				attackDamage = attackingCharacter.counterAttackPower;
				
			}
			else if(!this.isAttacker){
				this.currentHealthPoints -= attackingCharacter.currentAttackPower;
				attackDamage = attackingCharacter.currentAttackPower;
				
			}
			
			console.log(this.characterName + " takes " + attackDamage + " points of damage from a "  + attackType);
			

		};
		//Attack the original attacker (character who called the "attack" function)

		this.counterAttack = function(attackingCharacter){

			attackingCharacter.defend(this);
			console.log(this.characterName + " counter-attacks for " + this.counterAttackPower + " points of damage");

		};

	




	};

 function startNewGame(){

 	var newGame = new Game();

 	return newGame
 };


$( document ).ready(function(){
	
	
	var newGame = startNewGame();



	$(".character-avatar.img-fluid").click(function(){


		if(!newGame.playerSelected)
		{
		console.log("Player has chosen a character from our character map!" + $(this).attr("value"));
		newGame.setPlayerName($(this).attr("value"));
		newGame.updateCharacterPoolElement(newGame.getPlayerName(), "attacker");

		}
		else if(!newGame.enemySelected){
			console.log("Player has chosen an enemy character from our character map!");
			newGame.setEnemyName($(this).attr("value"));
			newGame.updateCharacterPoolElement(newGame.getEnemyName(), "defender");
		}
		


	});
	
	
	
	

});
