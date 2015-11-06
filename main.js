require.config({
    paths: {
        Ukulele: 'dist/Ukulele'
    }
});

require(['Ukulele'],function(ukulib){
	var Uku = ukulib.Ukulele;
	console.log(new Uku());
});	