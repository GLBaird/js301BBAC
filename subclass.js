function Person(surname, forename) {
    this.surname = surname;
    this.forename = forename;
    this.date = new Date();
    console.log("Person created!");
}

Person.prototype.getFullName = function() {
    return this.forename + " " + this.surname;
}



function EvilPerson(surname, forename, evil) {
    Person.call(this, surname, forename);
    this.evilLevel = evil;
}

EvilPerson.prototype = new Person;

EvilPerson.prototype.doEvilThings = function() {
    console.log("AGG EVIL THINGS " + this.evilLevel);
}

// overide get name
EvilPerson.prototype.getFullName = function() {
    return Person.prototype.getFullName.call(this) + " Evil";
}


var bob = new EvilPerson("Bob", "Bob", 5);
bob.getFullName(); // Bob Bob Evil
bob.date // Today date
bob.doEvilThings() // evil things 5