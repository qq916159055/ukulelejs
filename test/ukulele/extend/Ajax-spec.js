import {Ajax} from '../../../src/ukulele/extend/Ajax';
describe('Ajax Test Suite', function () {
	let handler;
	beforeAll(function(){
		handler = {
			success:function(result){
				
			},
			error:function(){
			
			}
		};
	});
	
	describe('test get success',function(){
		beforeAll(function(done){
			spyOn(handler,'success');
			Ajax.get('base/test/test.html',function(result){
				handler.success(result);
				done();
			},function(){
				handler.error();
				done();
			});
		});
		it('success handler should be called',function(done){
			expect(handler.success).toHaveBeenCalledWith('<div>success</div>');
			done();
		});
	});
	
	describe('test get fail', function(){
		beforeAll(function(done){
			spyOn(handler,'error');
			Ajax.get('base/test/test2.html',function(result){
				handler.success(result);
				done();
			},function(){
				handler.error();
				done();
			});
		});
		it('error handler should be called',function(done){
			expect(handler.error).toHaveBeenCalled();
			done();
		});
	});
});