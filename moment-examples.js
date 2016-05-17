var moment = require('moment');
var now = moment();

console.log(now.format());
console.log(now.format('X'));
console.log(now.format('x'));

var timestamp=1463528183273;
var timestampMoment =moment.utc(timestamp);
timestampMoment.local();

console.log(timestampMoment.format('hh:mm a'));	//11:06 am

// now.subtract(1,'year');
// console.log(now.format());
// console.log(now.format('MMM Do YYYY, h:mm A'));		//Oct 5th 2015, 6:45 pm