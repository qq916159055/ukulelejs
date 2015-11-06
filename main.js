require.config({
    paths: {
        Ukulele: 'dist/Ukulele.min'
    }
});

require(['Ukulele'],function(ukulib){
	var Ukulele = ukulib.Ukulele;
	var uku = new Ukulele();
	uku.registerController('myCtrl',new MyController());
	uku.init();
	
	function MyController(uku){
		this.message = 'hello webpack, hello babel, hello ukujs';
		this.changeHandler = function(){
			this.message = this.message + " +1";
		}
	}
});	