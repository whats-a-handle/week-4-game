
function play(){

	//FOR TESTING ONLY
	console.log("Starting game...");
	console.log("Creating Game object");
	var newGame = new Game();
	console.log("Creating characters");
	//console.log("Adding to pool...");
	//console.log("Ready");

	//Create two test characters
	var char1 = new Character("char1");
	var char2 = new Character("char2");

	console.log("Test Battle Function");
	//TEST BATTLE FUNCTION 

	char1.attack(char2);
	console.log("------------------");
	console.log(char1.characterName + " has " + char1.currentHealthPoints + " health remaining");
	console.log(char2.characterName + " has "  + char2.currentHealthPoints +  " health remaining");
	console.log("------------------");
	char2.attack(char1);
	console.log("------------------");
	console.log(char1.characterName + " has " + char1.currentHealthPoints + " health remaining");
	console.log(char2.characterName + " has "  + char2.currentHealthPoints +  " health remaining");
}

const Game = function(){

	this.characterPool = [];
	this.playerCharacter = "NONE";
	this.round = 1;

	addCharacter = function(Character){

	this.characterPool.push(Character);

	}
	

};


const Character = function(characterName,baseHealthPoints,baseAttackPower,
					counterAttackPower){
		//--------------CHARACTER ATTRIBUTES-------------------------------------------------------
		this.characterName = characterName;
		this.baseHealthPoints = baseHealthPoints 
		this.currentHealthPoints = 100;//this.baseHealthPoints;

		this.baseAttackPower = baseAttackPower;
		this.currentAttackPower = 5;//this.baseAttackPower;
		this.counterAttackPower = 10;//counterAttackPower;

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
			//this.defend(defendingCharacter); //calling this function doubles the damage, since we already take damage within counter attack.
			this.isAttacker = false;


		};
		
		//Take Damage and check if DEAD
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
			
			/*
			if(this.currentHealthPoints === 0){

				this.isDead = true;

				console.log(this.characterName + " has DIED");

			}*/

		};
		//Attack the original attacker (character who called the "attack" function)

		this.counterAttack = function(attackingCharacter){
			//TODO
			//the counterAttack function should not directly change the health value of the target (original attacker)
			//See TODO on the Defend function
			//attackingCharacter.currentHealthPoints -= this.currentAttackPower;

			attackingCharacter.defend(this);
			console.log(this.characterName + " counter-attacks for " + this.counterAttackPower + " points of damage");

		};

	




	};

/*
var newGame = new Game();

console.log("GAME: " );

var char1 = new Character("Char 1");
var char2 = new Character("Char 2");

char1.attack(char2);
char2.attack(char1);

*/