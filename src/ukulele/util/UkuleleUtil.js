"use strict";
import {Selector} from '../extend/Selector';
export class UkuleleUtil{
    static getFinalAttribute(expression){
        let temp = expression.split(".");
        let isParent = temp.shift();
        if (isParent === "parent") {
            return UkuleleUtil.getFinalAttribute(temp.join("."));
        }
        return temp.join(".");
    }
    
    static searchHtmlTag(htmlString, tagName) {
        let reTemp = "^<" + tagName + "\\s[\\s\\S]*</" + tagName + ">$";
        let re = new RegExp(reTemp);
        let index = htmlString.search(re);
        return index;
    }
    
    static isStringArgument(htmlString, tagName) {
        let re1 = /^"[\s\S]*"$/;
        let index = htmlString.search(re1);
        let re2 = /^'[\s\S]*'$/;
        if(index === 0){
            return true;
        }else{
            let index2 = htmlString.search(re2);
            if(index2 === 0){
                return true;
            }
        }
        return false;
    }
    
    static searchUkuAttrTag(htmlString) {
        let re = /^uku\-.*/;
        let index = htmlString.search(re);
        return index;
    }
    
    static searchUkuExpTag(expression) {
        let re = /^\{\{.*\}\}$/;
        let index = expression.search(re);
        return index;
    }
    
    static searchUkuFuncArg(htmlString) {
        let re = /\(.*\)$/;
        let index = htmlString.search(re);
        return index;
    }
    
    static isRepeat(element) {
        if (element.getAttribute("uku-repeat")) {
            return true;
        }
        return false;
    }
    static isInRepeat(element) {
        let parents = Selector.parents(element);
        for (let i = 0; i < parents.length; i++) {
            let parent = parents[i];
            let b = parent.getAttribute("uku-repeat");
            if (b) {
                return true;
            }
        }
        return false;
    }
    static getBoundModelInstantName(expression) {
        let controlInstName = expression.split('.')[0];
        if (controlInstName) {
            return controlInstName;
        }
        return null;
    }
    
    static getAttributeFinalValue(object, attrName) {
        let valueObject = UkuleleUtil.getAttributeFinalValueAndParent(object, attrName);
        let value = valueObject.value;
        return value;
    }
    
    static getAttributeFinalValueAndParent(object, attrName) {
        let finalValue = object;
        let parentValue;
        attrName = UkuleleUtil.getFinalAttribute(attrName);
        let temp = attrName.split(".");
        if (attrName !== "" && finalValue) {
            for (let i = 0; i < temp.length; i++) {
                let property = temp[i];
                parentValue = finalValue;
                finalValue = finalValue[property];
                if (finalValue === undefined || finalValue === null) {
                    break;
                }
            }
        }
        return {
            "value": finalValue,
            "parent": parentValue
        };
    }
    
    static getFinalValue(uku, object, attrName, additionalArgu) {
        let index = UkuleleUtil.searchUkuFuncArg(attrName);
        if (index === -1) {
            //is attribute
            return UkuleleUtil.getAttributeFinalValue(object, attrName);
        } else {
            //is function
            let functionName = attrName.substring(0, index);
            let finalValueObject = UkuleleUtil.getAttributeFinalValueAndParent(object, functionName);
            let finalValue = finalValueObject.value;
            if (finalValue === undefined) {
                return finalValue;
            }
            let new_arguments = [];
            let _arguments = attrName.substring(index + 1, attrName.length - 1);
            if (_arguments !== "") {
                let isStringArg = UkuleleUtil.isStringArgument(_arguments);
                if(isStringArg){
                    _arguments = [_arguments];
                }else{
                    _arguments = _arguments.split(",");
                }

                for (let i = 0; i < _arguments.length; i++) {
                    let temp;
                    let argument = _arguments[i];
                    let controllerModel = uku.getControllerModelByName(argument);
                    if (controllerModel && controllerModel.controllerInstance) {
                        let agrumentInst = controllerModel.controllerInstance;
                        if (argument.split(".").length === 1) {
                            temp = agrumentInst;
                        } else {
                            temp = UkuleleUtil.getFinalValue(uku, agrumentInst, argument);
                        }
                    } else {
                        temp = UkuleleUtil.getFinalValue(uku, object, argument);
                    }
                    if (temp !== object) {
                        new_arguments.push(temp);
                    } else {
                        let re2 = /\'.*\'/;
                        let index2 = argument.search(re2);
                        let re3 = /\".*\"/;
                        let index3 = argument.search(re3);
                        if (index2 !== -1) {
                            argument = argument.substring(1, argument.length - 1);
                            new_arguments.push(argument);
                        } else if (index3 !== -1) {
                            argument = argument.substring(1, argument.length - 1);
                            new_arguments.push(argument);
                        } else {
                            new_arguments.push(temp);
                        }
                    }
                }
            }

            if (additionalArgu) {
                let additionalArguArray = Array.prototype.slice.call(additionalArgu);
                new_arguments = new_arguments.concat(additionalArguArray);
            }
            finalValue = finalValue.apply(finalValueObject.parent, new_arguments);
            return finalValue;
        }
    }
}