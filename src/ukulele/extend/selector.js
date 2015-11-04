"use strict";
export class Selector {
    static fuzzyFind(element, text) {
        if (element && element.attributes) {
            for (let i = 0; i < element.attributes.length; i++) {
                let attr = element.attributes[i];
                if (attr.nodeName.search(text) > -1) {
                    return element;
                }
            }
        }
        return null;
    }

    static directText(element, text) {
        let o = "";
        let nodes = element.childNodes;
        for (let i = 0; i <= nodes.length - 1; i++) {
            let node = nodes[i];
            if (node.nodeType === 3) {

                if (text || text === "" || text === 0 || text === false) {
                    node.nodeValue = text;
                    return;
                } else {
                    o += node.nodeValue;
                }
            }
        }
        return o.trim();
    }

    static parents(element) {
        let myParents = [];
        while (element.parentNode && element.parentNode.tagName !== 'BODY') {
            myParents.push(element.parentNode);
            element = element.parentNode;
        }
        return myParents;
    }
}