var Game = function(){

	this.characterPool = [];
	this.playerCharacter = "NONE";
	this.round = 1;



addCharacter = function(Character){

	this.characterPool.push(Character);

}
	

};


var Character = function(characterName,healthPoints,baseAttackPower,
					currentAttackPower,counterAttackPower){
		this.characterName = characterName;
		this.healthPoints = healthPoints;
		this.baseAttackPower = baseAttackPower;
		this.currentAttackPower = currentAttackPower;
		this.counterAttackPower = counterAttackPower;
		this.isAttacker = false;

		this.attack = function(defendingCharacter){

			console.log("You attack: " + defendingCharacter.characterName);
		};

		this.defend = function(attackingCharacter){
			console.log("You defend yourself from: " + attackingCharacter);
		};




	};


var newGame = new Game();

console.log("GAME: " );

var char1 = new Character("Char 1");
var char2 = new Character("Char 2");

char1.attack(char2);
char2.attack(char1);

