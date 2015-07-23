/**
 * Class for storing moments
 * @argument data {{ name:string, type:string, date:Date, fileURL: string }}
 * @constructor
 */

function Moment(data) {
    for(var prop in data) {
        if (this.hasOwnProperty(prop)) {
            this[prop] = data[prop];
        }
    }
}

/**
 * For storing the name of the moment
 * @property name {string}
 */
Moment.prototype.name = "";
Moment.prototype.type = "";
Moment.prototype.Date = new Date();
Moment.prototype.fileURL = "";