var Ukulele = require('Ukulele');
var uku;
if(Ukulele){
	uku = new Ukulele();
	console.log('successs');
}else{
	console.log('undefined');
}