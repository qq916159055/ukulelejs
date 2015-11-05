import {Selector} from '../../../src/ukulele/extend/Selector';
describe('Selector test suite',function(){
	it('test fuzzyFind', function(){
		let element = document.createElement('div');
		element.setAttribute('uku-test','test');
		expect(Selector.fuzzyFind(element,'uku-')).toBe(element);
		expect(Selector.fuzzyFind(element,'guitar-')).toBe(null);
	});
	
	it('test directText', function(){
		let element =  document.createElement('h1');
		element.innerHTML = 'test';
		expect(Selector.directText(element)).toBe('test');
		Selector.directText(element,'test1');
		expect(element.innerHTML).toBe('test1');
	});
	
	it('test parents', function(){
		let grandpParent = document.createElement('div');
		let parent = document.createElement('div');
		let child = document.createElement('div');
		grandpParent.appendChild(parent);
		parent.appendChild(child);
		let parents = Selector.parents(child);
		expect(parents.length).toBe(2);
		expect(parents[0]).toBe(parent);
		expect(parents[1]).toBe(grandpParent);
	});
});