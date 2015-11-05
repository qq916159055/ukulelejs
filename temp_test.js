import {Ajax} from './src/ukulele/extend/Ajax';
import {ObjectUtil} from './src/ukulele/util/ObjectUtil';

console.log(ObjectUtil.isArray([1,2,3]));

Ajax.get('test/test.html',function(result){
	
},function(){
	console.log('faild');
});