import {BoundItemBase} from './BoundItemBase';
import {UkuleleUtil} from '../util/UkuleleUtil';
export class BoundItemRepeat extends BoundItemBase {
	constructor(attrName, element, uku) {
		super(attrName, element, uku);
		this.expression = itemName;

		this.renderTemplate = element.outerHTML;
		this.parentElement = element.parentNode;

		this.beginCommentString = undefined;
		this.endCommentString = undefined;
	}
	render(controller) {
		let finalValue = UkuleleUtil.getFinalValue(this.uku, controller, this.attributeName);
		if (!finalValue) {
			return;
		}
		let self = this;
		if (this.element && this.element.parentNode) {
			//create repeate begin comment
			this.beginCommentString = "begin uku-repeat: " + this.expression + " in " + this.attributeName;
			let beginComment = document.createComment(this.beginCommentString);
			this.element.parentNode.insertBefore(beginComment, this.element);
			//create repeate end comment
			this.endCommentString = "end uku-repeat: " + this.expression + " in " + this.attributeName;
			let endComment = document.createComment(this.endCommentString);
			this.element.parentNode.insertBefore(endComment, this.element.nextSibling);
			//remove definition dom
			this.element.parentNode.removeChild(this.element);

		}
		let treeWalker = document.createTreeWalker(this.parentElement,
			NodeFilter.SHOW_COMMENT,
			filter,
			false);

		function filter(node) {
			if (node.nodeValue === self.beginCommentString) {
				return (NodeFilter.FILTER_ACCEPT);
			}
			return (NodeFilter.FILTER_SKIP);
		}

		function generateTempContainer() {
			let index = UkuleleUtil.searchHtmlTag(self.renderTemplate, "tr");
			if (index === -1) {
				return document.createElement("div");
			} else {
				return document.createElement("tbody");
			}
		}

		while (treeWalker.nextNode()) {
			let commentNode = treeWalker.currentNode;
			if (commentNode && commentNode.nodeValue === this.beginCommentString) {
				//remove overtime dom.
				while (commentNode.nextSibling && commentNode.nextSibling.nodeValue !== this.endCommentString) {
					commentNode.parentNode.removeChild(commentNode.nextSibling);
				}
				//create new dom
				let tempDiv = generateTempContainer();
				let blankDiv = generateTempContainer();
				commentNode.parentNode.insertBefore(blankDiv, commentNode.nextSibling);
				for (let i = 0; i < finalValue.length; i++) {

					tempDiv.insertAdjacentHTML('beforeEnd', this.renderTemplate);
					if (i === finalValue.length - 1) {
						let childrenHTML = tempDiv.innerHTML;
						blankDiv.insertAdjacentHTML('beforeBegin', childrenHTML);
						commentNode.parentNode.removeChild(blankDiv);
						tempDiv = null;
						blankDiv = null;
					}
				}

				let child = commentNode.nextSibling;
				for (let j = 0; j < finalValue.length; j++) {
					child.removeAttribute("uku-repeat");
					let ukulele = new Ukulele();
					ukulele.parentUku = this.uku;
					ukulele.registerController(this.expression, finalValue[j]);
					ukulele.dealWithElement(child);
					child = child.nextSibling;
				}
			}
		}

		if (this.element.tagName === "OPTION") {
			let expression = this.parentElement.getAttribute("uku-selected");
			let tempArr = expression.split("|");
			expression = tempArr[0];
			key = tempArr[1];
			let value = this.uku.getFinalValueByExpression(expression);
			if (key) {
				this.parentElement.value = value[key];
			} else {
				this.parentElement.value = value;
			}
		}
	}
}