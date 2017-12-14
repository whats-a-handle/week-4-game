
//function play(){

	//FOR TESTING ONLY

//}

const Game = function(){

	this.characterPool = [];
	this.playerCharacter = "NONE";
	this.round = 1;

	
	this.addCharacter = function(characterObj){

	this.characterPool.push(characterObj);


	};

	this.updateCharacterPoolElement = function(characterObj){
		$(".neutral.character-container").append(characterObj.avatarElement);
	};
	

};


const Character = function(characterName,baseHealthPoints,baseAttackPower,
					counterAttackPower){
		//--------------CHARACTER ATTRIBUTES-------------------------------------------------------
		this.characterName = characterName;
		this.baseHealthPoints = baseHealthPoints 
		this.currentHealthPoints = baseHealthPoints;

		this.avatar = "./assets/images/"+ characterName + ".jpg";
		this.classes = ["character-avatar", "img-fluid"];
		this.avatarElement = $("<img src=" + this.avatar + " class=" + this.classes.join(" ") + " alt=Responsive image>");

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

$( document ).ready(function(){
console.log("Starting game...");
	console.log("Creating Game object");
	var newGame = new Game();
	console.log("Creating characters");

	var char1 = new Character("luke",100,10,25);
	var char2 = new Character("jarjar",90,5,10);

	newGame.addCharacter(char1);

	newGame.updateCharacterPoolElement(char1);
	newGame.updateCharacterPoolElement(char2);
	//newGame.updateCharacterPoolElement(char1);
	//console.log(newGame);
	
	
	

});
		
	//FOR TESTING ONLY
