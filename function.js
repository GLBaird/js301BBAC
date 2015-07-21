// Model - Constructor
function Person(surname, forename, age) {
    this.surname = surname;
    this.forename = forename;
    this.age = age;
    Person.numberOfPeople++;
}

Person.prototype.surname = "";
Person.prototype.forename = "";
Person.prototype.age = 0;

Person.numberOfPeople = 0;

Person.prototype.getFullName = function() {
    return this.forename+" "+this.surname;
}




var leon = new Person("Baird", "Leon", 39);
leon.getFullName();

var bob = new Person("Bob", "Bob", 2000);