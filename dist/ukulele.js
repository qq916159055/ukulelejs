define("uku", [], function() { return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.Ukulele = Ukulele;

	var _UkuleleUtil = __webpack_require__(1);

	var _Selector = __webpack_require__(2);

	var _ElementActionBinder = __webpack_require__(3);

	var _ControllerModel = __webpack_require__(4);

	var _BoundItemAttribute = __webpack_require__(5);

	var _BoundItemExpression = __webpack_require__(7);

	var _BoundItemInnerText = __webpack_require__(8);

	var _BoundItemRepeat = __webpack_require__(9);

	function Ukulele() {
	    var controllersDefinition = {};
	    var copyControllers = {};
	    var self = this;
	    /**
	     * @access a callback function when view was refreshed.
	     */
	    this.refreshHandler = null;

	    /**
	     * @access a callback function when view was initialized.
	     */
	    this.initHandler = null;
	    /**
	     * @access When using uku-repeat, parentUku to reference the Parent controller model's uku
	     */
	    this.parentUku = null;
	    this.init = function () {
	        manageApplication();
	    };
	    /**
	     * @description Register a controller model which you want to bind with view
	     * @param {string} instanceName controller's alias
	     * @param {object}  controllerInst controller's instance
	     */
	    this.registerController = function (instanceName, controllerInst) {
	        var controllerModel = new _ControllerModel.ControllerModel(instanceName, controllerInst);
	        controllersDefinition[instanceName] = controllerModel;
	    };
	    /**
	     * @description deal with partial html element you want to manage by UkuleleJS
	     * @param {object} $element jquery html object e.g. $("#myButton")
	     * @param {boolean} watch whether refresh automatically or not
	     */
	    this.dealWithElement = function (element) {
	        analyizeElement(element);
	    };
	    /**
	     * @description deal with the uku-include componnent which need be to lazy loaded.
	     * @param {object} element dom
	     */
	    this.loadIncludeElement = function (element) {
	        if (element.getAttribute("load") === "false") {
	            element.setAttribute("load", true);
	            analyizeElement(element.parentNode);
	        }
	    };
	    /**
	     * @description get the controller model's instance by alias.
	     * @param {object} expression  controller model's alias.
	     * @returns {object} controller model's instance
	     */
	    this.getControllerModelByName = function (expression) {
	        return getBoundControllerModelByName(expression);
	    };
	    /**
	     * @description refresh the view manually, e.g. you can call refresh in sync request's callback.
	     */
	    this.refresh = function (alias) {
	        runDirtyChecking(alias);
	    };
	    /**
	     * @description get value by expression
	     * @param {string} expression
	     */
	    this.getFinalValueByExpression = function (expression) {
	        var controller = this.getControllerModelByName(expression).controllerInstance;
	        return _UkuleleUtil.UkuleleUtil.getFinalValue(this, controller, expression);
	    };

	    /**
	     * @description watch a model, when it was changed, watch would toggle a handler
	     * @param {string} target object
	     * @param {function} callback function 
	     */
	    this.watch = function (expression, callback) {
	        var controllerModel = getBoundControllerModelByName(expression);
	        if (controllerModel) {
	            var boundItem = new _BoundItemAttribute.BoundItemAttribute(attr, tagName, element, self);
	            controllerModel.addBoundItem(boundItem);
	            boundItem.render(controllerModel.controllerInstance);

	            (0, _ElementActionBinder.elementChangedBinder)(element, tagName, controllerModel, runDirtyChecking);
	        }
	    };
	    /**
	     * @description unwatch a model, when it has been add a watch
	     * @param {object} target object
	     * @param {function} handler function 
	     */
	    this.unwatch = function (obj, handler) {};

	    //脏检测
	    function runDirtyChecking(ctrlAliasName) {
	        if (ctrlAliasName) {
	            if (typeof ctrlAliasName === "string") {
	                watchController(ctrlAliasName);
	            } else if (ObjectUtil.isArray(ctrlAliasName)) {
	                for (var i = 0; i < ctrlAliasName.length; i++) {
	                    watchController(ctrlAliasName[i]);
	                }
	            }
	        } else {
	            for (var alias in controllersDefinition) {
	                watchController(alias);
	            }
	        }

	        function watchController(alias) {
	            var controllerModel = controllersDefinition[alias];
	            if (!controllerModel) {
	                if (self.parentUku) {
	                    self.parentUku.refresh(alias);
	                }
	                return;
	            }
	            var controller = controllerModel.controllerInstance;
	            var previousCtrlModel = copyControllers[alias];
	            for (var i = 0; i < controllerModel.boundItems.length; i++) {
	                var boundItem = controllerModel.boundItems[i];
	                var attrName = boundItem.attributeName;
	                if (previousCtrlModel) {
	                    if (boundItem.ukuTag === "selected") {
	                        attrName = attrName.split("|")[0];
	                    }
	                    var finalValue = _UkuleleUtil.UkuleleUtil.getFinalValue(self, controller, attrName);
	                    var previousFinalValue = _UkuleleUtil.UkuleleUtil.getFinalValue(self, previousCtrlModel, attrName);
	                    if (!ObjectUtil.compare(previousFinalValue, finalValue)) {
	                        attrName = boundItem.attributeName;
	                        var changedBoundItems = controllerModel.getBoundItemsByName(attrName);
	                        for (var j = 0; j < changedBoundItems.length; j++) {
	                            var changedBoundItem = changedBoundItems[j];
	                            changedBoundItem.render(controller);
	                        }
	                        if (self.refreshHandler) {
	                            self.refreshHandler.call(self);
	                        }
	                    }
	                }
	            }
	            copyControllerInstance(controller, alias);
	        }
	    }

	    function copyAllController() {
	        for (var alias in controllersDefinition) {
	            var controllerModel = controllersDefinition[alias];
	            var controller = controllerModel.controllerInstance;
	            copyControllerInstance(controller, alias);
	        }
	    }

	    function copyControllerInstance(controller, alias) {
	        var previousCtrlModel = ObjectUtil.deepClone(controller);
	        delete copyControllers[alias];
	        copyControllers[alias] = previousCtrlModel;
	    }

	    //解析html中各个uku的tag
	    function analyizeElement(element) {
	        var onloadHandlerQueue = [];
	        searchIncludeTag(element, function () {
	            var subElements = [];
	            //scan element which has uku-* tag
	            var isSelfHasUkuTag = _Selector.Selector.fuzzyFind(element, 'uku-');
	            if (isSelfHasUkuTag) {
	                subElements.push(isSelfHasUkuTag);
	            }
	            var allChildren = element.querySelectorAll("*");
	            for (var i = 0; i < allChildren.length; i++) {
	                var child = allChildren[i];
	                var matchElement = _Selector.Selector.fuzzyFind(child, 'uku-');
	                if (matchElement && !_UkuleleUtil.UkuleleUtil.isInRepeat(matchElement)) {
	                    subElements.push(matchElement);
	                }
	            }
	            searchExpression(element);
	            //解析绑定 attribute，注册event
	            for (var n = 0; n < subElements.length; n++) {
	                var subElement = subElements[n];
	                var orderAttrs = sortAttributes(subElement);
	                for (var j = 0; j < orderAttrs.length; j++) {
	                    var attribute = orderAttrs[j];
	                    if (_UkuleleUtil.UkuleleUtil.searchUkuAttrTag(attribute.nodeName) > -1) {
	                        var tempArr = attribute.nodeName.split('-');
	                        tempArr.shift();
	                        var attrName = tempArr.join('-');
	                        if (attrName !== "application") {
	                            if (attrName.search('on') === 0) {
	                                //is an event
	                                if (!_UkuleleUtil.UkuleleUtil.isRepeat(subElement) && !_UkuleleUtil.UkuleleUtil.isInRepeat(subElement)) {
	                                    dealWithEvent(subElement, attrName);
	                                }
	                            } else if (attrName.search('repeat') !== -1) {
	                                //is an repeat
	                                dealWithRepeat(subElement);
	                            } else {
	                                //is an attribute
	                                if (!_UkuleleUtil.UkuleleUtil.isRepeat(subElement) && !_UkuleleUtil.UkuleleUtil.isInRepeat(subElement)) {
	                                    if (attrName !== "text") {
	                                        dealWithAttribute(subElement, attrName);
	                                    } else {
	                                        dealWithInnerText(subElement);
	                                    }
	                                }
	                            }
	                        }
	                    }
	                }
	            }
	            while (onloadHandlerQueue.length > 0) {
	                var handler = onloadHandlerQueue.pop();
	                handler.func.apply(this, handler.args);
	            }

	            if (self.refreshHandler) {
	                self.refreshHandler.call(self);
	            }
	            if (self.initHandler) {
	                self.initHandler.call(self, element);
	            }
	            copyAllController();

	            function sortAttributes(subElement) {
	                var orderAttrs = [];
	                for (var i = 0; i < subElement.attributes.length; i++) {
	                    var attribute = subElement.attributes[i];
	                    if (attribute.nodeName.search("uku-on") !== -1) {
	                        orderAttrs.push(attribute);
	                    } else {
	                        orderAttrs.unshift(attribute);
	                    }
	                }
	                return orderAttrs;
	            }
	        });

	        function searchIncludeTag(element, retFunc) {
	            var tags = element.querySelectorAll('.uku-include');
	            var index = 0;
	            if (index < tags.length) {
	                dealWithInclude(index);
	            } else {
	                retFunc();
	            }

	            function dealWithInclude(index) {
	                var tag = tags[index];
	                var isLoad = tag.getAttribute("load");
	                if (isLoad === "false") {
	                    index++;
	                    if (index < tags.length) {
	                        dealWithInclude(index);
	                    } else {
	                        retFunc();
	                    }
	                } else {
	                    var src = tag.getAttribute("src");
	                    var replace = tag.getAttribute("replace");
	                    var replaceController = tag.getAttribute("replace-controller");
	                    var ajax = new Ajax();
	                    if (replace && replace === "true") {
	                        (function (x) {
	                            ajax.get(src, function (html) {
	                                if (replaceController) {
	                                    html = doReplace(html, replaceController);
	                                }
	                                x.insertAdjacentHTML('beforeBegin', html);
	                                var htmlDom = x.previousElementSibling;
	                                x.parentNode.removeChild(x);
	                                onloadHandlerQueue.push({
	                                    'func': runOnLoadFunc,
	                                    'args': [x, htmlDom]
	                                });
	                                searchIncludeTag(htmlDom, function () {
	                                    index++;
	                                    if (index < tags.length) {
	                                        dealWithInclude(index);
	                                    } else {
	                                        retFunc();
	                                    }
	                                });
	                            });
	                        })(tag);
	                    } else {
	                        (function (x) {
	                            ajax.get(src, function (html) {
	                                if (replaceController) {
	                                    html = doReplace(html, replaceController);
	                                }
	                                x.insertAdjacentHTML('afterBegin', html);
	                                x.classList.remove('uku-include');
	                                onloadHandlerQueue.push({
	                                    'func': runOnLoadFunc,
	                                    'args': [x]
	                                });
	                                searchIncludeTag(x, function () {
	                                    index++;
	                                    if (index < tags.length) {
	                                        dealWithInclude(index);
	                                    } else {
	                                        retFunc();
	                                    }
	                                });
	                            });
	                        })(tag);
	                    }
	                }

	                function runOnLoadFunc(hostElement, replaceElement) {
	                    var expression = hostElement.getAttribute("uku-onload");
	                    if (expression) {
	                        if (replaceElement) {
	                            getBoundAttributeValue(expression, [replaceElement]);
	                        } else {
	                            getBoundAttributeValue(expression, [hostElement]);
	                        }
	                    }
	                }

	                function doReplace(html, replaceController) {
	                    var tempArr = replaceController.split("|");
	                    if (tempArr && tempArr.length === 2) {
	                        var oldCtrl = tempArr[0];
	                        var newCtrl = tempArr[1];
	                        html = html.replace(new RegExp(oldCtrl, "gm"), newCtrl);
	                        return html;
	                    } else {
	                        return html;
	                    }
	                }
	            }
	        }

	        //scan element which has expression {{}}
	        function searchExpression(element) {
	            if (_UkuleleUtil.UkuleleUtil.searchUkuExpTag(_Selector.Selector.directText(element)) !== -1) {
	                if (!_UkuleleUtil.UkuleleUtil.isRepeat(element) && !_UkuleleUtil.UkuleleUtil.isInRepeat(element)) {
	                    //normal expression
	                    dealWithExpression(element);
	                }
	            }
	            for (var i = 0; i < element.children.length; i++) {
	                searchExpression(element.children[i]);
	            }
	        }
	        //处理绑定的expression
	        function dealWithExpression(element) {
	            //通常的花括号声明方式
	            var expression = _Selector.Selector.directText(element);
	            if (_UkuleleUtil.UkuleleUtil.searchUkuExpTag(expression) !== -1) {
	                var attr = expression.slice(2, -2);
	                var controllerModel = getBoundControllerModelByName(attr);
	                if (controllerModel) {
	                    var boundItem = new _BoundItemExpression.BoundItemExpression(attr, expression, element, self);
	                    controllerModel.addBoundItem(boundItem);
	                    boundItem.render(controllerModel.controllerInstance);
	                }
	            }
	        }
	        //处理绑定的attribute
	        function dealWithAttribute(element, tagName) {
	            var attr = element.getAttribute("uku-" + tagName);
	            var elementName = element.tagName;
	            var controllerModel = getBoundControllerModelByName(attr);
	            if (controllerModel) {
	                var boundItem = new _BoundItemAttribute.BoundItemAttribute(attr, tagName, element, self);
	                controllerModel.addBoundItem(boundItem);
	                boundItem.render(controllerModel.controllerInstance);
	                (0, _ElementActionBinder.elementChangedBinder)(element, tagName, controllerModel, runDirtyChecking);
	            }
	        }

	        //
	        function dealWithInnerText(element) {
	            var attr = element.getAttribute("uku-text");
	            if (attr) {
	                var controllerModel = getBoundControllerModelByName(attr);
	                if (controllerModel) {
	                    var boundItem = new _BoundItemInnerText.BoundItemInnerText(attr, element, self);
	                    controllerModel.addBoundItem(boundItem);
	                    boundItem.render(controllerModel.controllerInstance);
	                }
	            }
	        }

	        //处理 事件 event
	        function dealWithEvent(element, eventName) {
	            var expression = element.getAttribute("uku-" + eventName);
	            var eventNameInListener = eventName.substring(2);
	            var controllerModel = getBoundControllerModelByName(expression);
	            if (controllerModel) {
	                var controller = controllerModel.controllerInstance;
	                var temArr = expression.split(".");
	                var alias;
	                if (temArr[0] === "parent") {
	                    alias = temArr[1];
	                } else {
	                    alias = temArr[0];
	                }
	                element.addEventListener(eventNameInListener, function (event) {
	                    copyControllerInstance(controller, alias);
	                    getBoundAttributeValue(expression, arguments);
	                    runDirtyChecking(alias);
	                });
	            }
	        }
	        //处理 repeat
	        function dealWithRepeat(element) {
	            var repeatExpression = element.getAttribute("uku-repeat");
	            var tempArr = repeatExpression.split(' in ');
	            var itemName = tempArr[0];
	            var attr = tempArr[1];
	            var controllerModel = getBoundControllerModelByName(attr);
	            if (controllerModel) {
	                var controllerInst = controllerModel.controllerInstance;
	                var boundItem = new _BoundItemRepeat.BoundItemRepeat(attr, itemName, element, self);
	                controllerModel.addBoundItem(boundItem);
	                boundItem.render(controllerInst);
	            }
	        }
	    }

	    //根据attrName 确定对应的ControllerModel ，比如  parent.mgr.xxx.yyy来找到以mgr为别名的ControllerModel
	    function getBoundControllerModelByName(attrName) {
	        var instanceName = _UkuleleUtil.UkuleleUtil.getBoundModelInstantName(attrName);
	        var controllerModel = controllersDefinition[instanceName];
	        if (!controllerModel) {
	            var tempArr = attrName.split(".");
	            var isParentScope = tempArr[0];
	            if (isParentScope === "parent" && self.parentUku) {
	                tempArr.shift();
	                attrName = tempArr.join(".");
	                return self.parentUku.getControllerModelByName(attrName);
	            }
	        }
	        return controllerModel;
	    }

	    function getBoundAttributeValue(attr, additionalArgu) {
	        var controllerModel = getBoundControllerModelByName(attr);
	        var controllerInst = controllerModel.controllerInstance;
	        var result = _UkuleleUtil.UkuleleUtil.getFinalValue(self, controllerInst, attr, additionalArgu);
	        return result;
	    }

	    function manageApplication() {
	        var apps = document.querySelectorAll("[uku-application]");
	        if (apps.length === 1) {
	            analyizeElement(apps[0]);
	        } else {
	            throw new Error("Only one 'uku-application' can be declared in a whole html.");
	        }
	    }
	}

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.UkuleleUtil = undefined;

	var _Selector = __webpack_require__(2);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var UkuleleUtil = exports.UkuleleUtil = (function () {
	    function UkuleleUtil() {
	        _classCallCheck(this, UkuleleUtil);
	    }

	    _createClass(UkuleleUtil, null, [{
	        key: "getFinalAttribute",
	        value: function getFinalAttribute(expression) {
	            var temp = expression.split(".");
	            var isParent = temp.shift();
	            if (isParent === "parent") {
	                return UkuleleUtil.getFinalAttribute(temp.join("."));
	            }
	            return temp.join(".");
	        }
	    }, {
	        key: "searchHtmlTag",
	        value: function searchHtmlTag(htmlString, tagName) {
	            var reTemp = "^<" + tagName + "\\s[\\s\\S]*</" + tagName + ">$";
	            var re = new RegExp(reTemp);
	            var index = htmlString.search(re);
	            return index;
	        }
	    }, {
	        key: "isStringArgument",
	        value: function isStringArgument(htmlString, tagName) {
	            var re1 = /^"[\s\S]*"$/;
	            var index = htmlString.search(re1);
	            var re2 = /^'[\s\S]*'$/;
	            if (index === 0) {
	                return true;
	            } else {
	                var index2 = htmlString.search(re2);
	                if (index2 === 0) {
	                    return true;
	                }
	            }
	            return false;
	        }
	    }, {
	        key: "searchUkuAttrTag",
	        value: function searchUkuAttrTag(htmlString) {
	            var re = /^uku\-.*/;
	            var index = htmlString.search(re);
	            return index;
	        }
	    }, {
	        key: "searchUkuExpTag",
	        value: function searchUkuExpTag(expression) {
	            var re = /^\{\{.*\}\}$/;
	            var index = expression.search(re);
	            return index;
	        }
	    }, {
	        key: "searchUkuFuncArg",
	        value: function searchUkuFuncArg(htmlString) {
	            var re = /\(.*\)$/;
	            var index = htmlString.search(re);
	            return index;
	        }
	    }, {
	        key: "isRepeat",
	        value: function isRepeat(element) {
	            if (element.getAttribute("uku-repeat")) {
	                return true;
	            }
	            return false;
	        }
	    }, {
	        key: "isInRepeat",
	        value: function isInRepeat(element) {
	            var parents = _Selector.Selector.parents(element);
	            for (var i = 0; i < parents.length; i++) {
	                var parent = parents[i];
	                var b = parent.getAttribute("uku-repeat");
	                if (b) {
	                    return true;
	                }
	            }
	            return false;
	        }
	    }, {
	        key: "getBoundModelInstantName",
	        value: function getBoundModelInstantName(expression) {
	            var controlInstName = expression.split('.')[0];
	            if (controlInstName) {
	                return controlInstName;
	            }
	            return null;
	        }
	    }, {
	        key: "getAttributeFinalValue",
	        value: function getAttributeFinalValue(object, attrName) {
	            var valueObject = UkuleleUtil.getAttributeFinalValueAndParent(object, attrName);
	            var value = valueObject.value;
	            return value;
	        }
	    }, {
	        key: "getAttributeFinalValueAndParent",
	        value: function getAttributeFinalValueAndParent(object, attrName) {
	            var finalValue = object;
	            var parentValue = undefined;
	            attrName = UkuleleUtil.getFinalAttribute(attrName);
	            var temp = attrName.split(".");
	            if (attrName !== "" && finalValue) {
	                for (var i = 0; i < temp.length; i++) {
	                    var property = temp[i];
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
	    }, {
	        key: "getFinalValue",
	        value: function getFinalValue(uku, object, attrName, additionalArgu) {
	            var index = UkuleleUtil.searchUkuFuncArg(attrName);
	            if (index === -1) {
	                //is attribute
	                return UkuleleUtil.getAttributeFinalValue(object, attrName);
	            } else {
	                //is function
	                var functionName = attrName.substring(0, index);
	                var finalValueObject = UkuleleUtil.getAttributeFinalValueAndParent(object, functionName);
	                var finalValue = finalValueObject.value;
	                if (finalValue === undefined) {
	                    return finalValue;
	                }
	                var new_arguments = [];
	                var _arguments = attrName.substring(index + 1, attrName.length - 1);
	                if (_arguments !== "") {
	                    var isStringArg = UkuleleUtil.isStringArgument(_arguments);
	                    if (isStringArg) {
	                        _arguments = [_arguments];
	                    } else {
	                        _arguments = _arguments.split(",");
	                    }

	                    for (var i = 0; i < _arguments.length; i++) {
	                        var temp = undefined;
	                        var argument = _arguments[i];
	                        var controllerModel = uku.getControllerModelByName(argument);
	                        if (controllerModel && controllerModel.controllerInstance) {
	                            var agrumentInst = controllerModel.controllerInstance;
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
	                            var re2 = /\'.*\'/;
	                            var index2 = argument.search(re2);
	                            var re3 = /\".*\"/;
	                            var index3 = argument.search(re3);
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
	                    var additionalArguArray = Array.prototype.slice.call(additionalArgu);
	                    new_arguments = new_arguments.concat(additionalArguArray);
	                }
	                finalValue = finalValue.apply(finalValueObject.parent, new_arguments);
	                return finalValue;
	            }
	        }
	    }]);

	    return UkuleleUtil;
	})();

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Selector = exports.Selector = (function () {
	    function Selector() {
	        _classCallCheck(this, Selector);
	    }

	    _createClass(Selector, null, [{
	        key: "fuzzyFind",
	        value: function fuzzyFind(element, text) {
	            if (element && element.attributes) {
	                for (var i = 0; i < element.attributes.length; i++) {
	                    var attr = element.attributes[i];
	                    if (attr.nodeName.search(text) > -1) {
	                        return element;
	                    }
	                }
	            }
	            return null;
	        }
	    }, {
	        key: "directText",
	        value: function directText(element, text) {
	            var o = "";
	            var nodes = element.childNodes;
	            for (var i = 0; i <= nodes.length - 1; i++) {
	                var node = nodes[i];
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
	    }, {
	        key: "parents",
	        value: function parents(element) {
	            var myParents = [];
	            while (element.parentNode && element.parentNode.tagName !== 'BODY') {
	                myParents.push(element.parentNode);
	                element = element.parentNode;
	            }
	            return myParents;
	        }
	    }]);

	    return Selector;
	})();

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.elementChangedBinder = undefined;

	var _UkuleleUtil = __webpack_require__(1);

	function elementChangedBinder(element, tagName, controllerModel, handler) {
	    var elementStrategies = [inputTextCase, textareaCase, selectCase, checkboxCase, radioCase];
	    for (var i = 0; i < elementStrategies.length; i++) {
	        var func = elementStrategies[i];
	        var goon = func.apply(this, arguments);
	        if (goon) {
	            break;
	        }
	    }
	}

	function inputTextCase(element, tagName, controllerModel, handler) {
	    var elementName = element.tagName;
	    if (elementName === "INPUT" && isSupportInputType(element) && tagName === "value") {
	        var eventType = 'change';
	        var inputType = element.getAttribute('type');
	        if (inputType === "text") {
	            eventType = 'input';
	        }
	        element.addEventListener(eventType, function (e) {
	            var attr = element.getAttribute("uku-" + tagName);
	            attr = _UkuleleUtil.UkuleleUtil.getFinalAttribute(attr);
	            var temp = attr.split(".");
	            var finalInstance = controllerModel.controllerInstance;
	            for (var i = 0; i < temp.length - 1; i++) {
	                finalInstance = finalInstance[temp[i]];
	            }
	            finalInstance[temp[temp.length - 1]] = element.value;
	            if (handler) {
	                handler(controllerModel.alias);
	            }
	        });
	        return true;
	    }
	    return false;
	}

	function isSupportInputType(element) {
	    var type = element.getAttribute("type");
	    if (type !== "checkbox" && type !== "radio") {
	        return true;
	    }
	    return false;
	}

	function textareaCase(element, tagName, controllerModel, handler) {
	    var elementName = element.tagName;
	    if (elementName === "TEXTAREA" && tagName === "value") {
	        element.addEventListener('input', function (e) {
	            var attr = element.getAttribute("uku-" + tagName);
	            attr = _UkuleleUtil.UkuleleUtil.getFinalAttribute(attr);
	            var temp = attr.split(".");
	            var finalInstance = controllerModel.controllerInstance;
	            for (var i = 0; i < temp.length - 1; i++) {
	                finalInstance = finalInstance[temp[i]];
	            }
	            finalInstance[temp[temp.length - 1]] = element.value;
	            if (handler) {
	                handler(controllerModel.alias);
	            }
	        });
	        return true;
	    }
	    return false;
	}

	function selectCase(element, tagName, controllerModel, handler) {
	    var elementName = element.tagName;
	    if (elementName === "SELECT" && tagName === "selected") {
	        element.addEventListener('change', function (e) {
	            var attr = element.getAttribute("uku-" + tagName);
	            var key;
	            var tmpArr = attr.split("|");
	            attr = tmpArr[0];
	            key = tmpArr[1];
	            attr = _UkuleleUtil.UkuleleUtil.getFinalAttribute(attr);
	            var temp = attr.split(".");
	            var finalInstance = controllerModel.controllerInstance;
	            for (var i = 0; i < temp.length - 1; i++) {
	                finalInstance = finalInstance[temp[i]];
	            }

	            var options = element.querySelectorAll("option");
	            for (var j = 0; j < options.length; j++) {
	                var option = options[j];
	                if (option.selected) {
	                    var selectedItem = JSON.parse(option.getAttribute("data-item"));
	                    finalInstance[temp[temp.length - 1]] = selectedItem;
	                }
	            }
	            if (handler) {
	                handler(controllerModel.alias);
	            }
	        });
	        return true;
	    }
	    return false;
	}

	function checkboxCase(element, tagName, controllerModel, handler) {
	    var elementName = element.tagName;

	    if (elementName === "INPUT" && tagName === "value" && element.getAttribute("type") === "checkbox") {
	        element.addEventListener('change', function (e) {
	            var attr = element.getAttribute("uku-" + tagName);
	            attr = _UkuleleUtil.UkuleleUtil.getFinalAttribute(attr);
	            var temp = attr.split(".");
	            var finalInstance = controllerModel.controllerInstance;
	            for (var i = 0; i < temp.length - 1; i++) {
	                finalInstance = finalInstance[temp[i]];
	            }
	            finalInstance[temp[temp.length - 1]] = element.checked;
	            if (handler) {
	                handler(controllerModel.alias);
	            }
	        });
	        return true;
	    }
	    return false;
	}

	function radioCase(element, tagName, controllerModel, handler) {
	    var elementName = element.tagName;

	    if (elementName === "INPUT" && tagName === "selected" && element.getAttribute("type") === "radio") {
	        element.addEventListener('change', function (e) {
	            var attr = element.getAttribute("uku-" + tagName);
	            attr = _UkuleleUtil.UkuleleUtil.getFinalAttribute(attr);
	            var temp = attr.split(".");
	            var finalInstance = controllerModel.controllerInstance;
	            for (var i = 0; i < temp.length - 1; i++) {
	                finalInstance = finalInstance[temp[i]];
	            }
	            if (element.checked) {
	                finalInstance[temp[temp.length - 1]] = element.value;
	                if (handler) {
	                    handler(controllerModel.alias);
	                }
	            }
	        });
	        return true;
	    }
	    return false;
	}

	exports.elementChangedBinder = elementChangedBinder;

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var ControllerModel = exports.ControllerModel = (function () {
		function ControllerModel(alias, ctrlInst) {
			_classCallCheck(this, ControllerModel);

			this.alias = alias;
			this.controllerInstance = ctrlInst;
			this.boundItems = [];
		}

		_createClass(ControllerModel, [{
			key: "addBoundItem",
			value: function addBoundItem(boundItem) {
				this.boundItems.push(boundItem);
			}
		}, {
			key: "getBoundItemsByName",
			value: function getBoundItemsByName(name) {
				var tempBoundItems = [];
				for (var i = 0; i < this.boundItems.length; i++) {
					var boundItem = this.boundItems[i];
					if (boundItem.attributeName === name) {
						tempBoundItems.push(boundItem);
					}
				}
				return tempBoundItems;
			}
		}]);

		return ControllerModel;
	})();

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.BoundItemAttribute = undefined;

	var _BoundItemBase2 = __webpack_require__(6);

	var _UkuleleUtil = __webpack_require__(1);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var BoundItemAttribute = exports.BoundItemAttribute = (function (_BoundItemBase) {
		_inherits(BoundItemAttribute, _BoundItemBase);

		function BoundItemAttribute(attrName, ukuTag, element, uku) {
			_classCallCheck(this, BoundItemAttribute);

			var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(BoundItemAttribute).call(this, attrName, element, uku));

			_this.ukuTag = ukuTag;
			return _this;
		}

		_createClass(BoundItemAttribute, [{
			key: 'render',
			value: function render(controller) {
				var attr = this.attributeName;
				var key = undefined;
				var elementName = this.element.tagName;
				if (this.ukuTag === "selected" && elementName === "SELECT") {
					var tempArr = this.attributeName.split("|");
					attr = tempArr[0];
					key = tempArr[1];
				}
				var finalValue = _UkuleleUtil.UkuleleUtil.getFinalValue(this.uku, controller, attr);
				if (this.ukuTag.search('data-item') !== -1) {
					finalValue = JSON.stringify(finalValue);
					this.element.setAttribute('data-item', finalValue);
				} else if (this.ukuTag === "selected" && elementName === "SELECT") {
					var value = undefined;
					if (key) {
						value = finalValue[key];
					} else {
						value = finalValue;
					}
					this.element.value = value;
				} else if (this.element.getAttribute("type") === "checkbox") {
					this.element.checked = finalValue;
				} else if (this.ukuTag === "value") {
					this.element.value = finalValue;
				} else if (this.element.getAttribute("type") === "radio") {
					if (this.element.value === finalValue) {
						this.element.setAttribute("checked", true);
					}
				} else if (this.element.nodeName === "IMG" && this.ukuTag === "src") {
					if (finalValue) {
						this.element.setAttribute(this.ukuTag, finalValue);
					}
				} else {
					if (this.ukuTag === "disabled") {
						this.element.disabled = finalValue;
					} else {
						this.element.setAttribute(this.ukuTag, finalValue);
					}
				}
			}
		}]);

		return BoundItemAttribute;
	})(_BoundItemBase2.BoundItemBase);

/***/ },
/* 6 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var BoundItemBase = exports.BoundItemBase = function BoundItemBase(attrName, element, uku) {
		_classCallCheck(this, BoundItemBase);

		this.attributeName = attrName;
		this.element = element;
		this.uku = uku;
	};

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.BoundItemExpression = undefined;

	var _BoundItemBase2 = __webpack_require__(6);

	var _UkuleleUtil = __webpack_require__(1);

	var _Selector = __webpack_require__(2);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var BoundItemExpression = exports.BoundItemExpression = (function (_BoundItemBase) {
		_inherits(BoundItemExpression, _BoundItemBase);

		function BoundItemExpression(attrName, expression, element, uku) {
			_classCallCheck(this, BoundItemExpression);

			var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(BoundItemExpression).call(this, attrName, element, uku));

			_this.expression = expression;
			return _this;
		}

		_createClass(BoundItemExpression, [{
			key: 'render',
			value: function render(controller) {
				var finalValue = _UkuleleUtil.UkuleleUtil.getFinalValue(this.uku, controller, this.attributeName);
				_Selector.Selector.directText(this.element, finalValue);
			}
		}]);

		return BoundItemExpression;
	})(_BoundItemBase2.BoundItemBase);

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.BoundItemInnerText = undefined;

	var _BoundItemBase2 = __webpack_require__(6);

	var _UkuleleUtil = __webpack_require__(1);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var BoundItemInnerText = exports.BoundItemInnerText = (function (_BoundItemBase) {
		_inherits(BoundItemInnerText, _BoundItemBase);

		function BoundItemInnerText(attrName, element, uku) {
			_classCallCheck(this, BoundItemInnerText);

			var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(BoundItemInnerText).call(this, attrName, element, uku));

			_this.tagName = 'text';
			return _this;
		}

		_createClass(BoundItemInnerText, [{
			key: 'render',
			value: function render(controller) {
				var finalValue = _UkuleleUtil.UkuleleUtil.getFinalValue(this.uku, controller, this.attributeName);
				this.element.innerHTML = finalValue;
			}
		}]);

		return BoundItemInnerText;
	})(_BoundItemBase2.BoundItemBase);

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.BoundItemRepeat = undefined;

	var _BoundItemBase2 = __webpack_require__(6);

	var _UkuleleUtil = __webpack_require__(1);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var BoundItemRepeat = exports.BoundItemRepeat = (function (_BoundItemBase) {
		_inherits(BoundItemRepeat, _BoundItemBase);

		function BoundItemRepeat(attrName, element, uku) {
			_classCallCheck(this, BoundItemRepeat);

			var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(BoundItemRepeat).call(this, attrName, element, uku));

			_this.expression = itemName;

			_this.renderTemplate = element.outerHTML;
			_this.parentElement = element.parentNode;

			_this.beginCommentString = undefined;
			_this.endCommentString = undefined;
			return _this;
		}

		_createClass(BoundItemRepeat, [{
			key: 'render',
			value: function render(controller) {
				var finalValue = _UkuleleUtil.UkuleleUtil.getFinalValue(this.uku, controller, this.attributeName);
				if (!finalValue) {
					return;
				}
				var self = this;
				if (this.element && this.element.parentNode) {
					//create repeate begin comment
					this.beginCommentString = "begin uku-repeat: " + this.expression + " in " + this.attributeName;
					var beginComment = document.createComment(this.beginCommentString);
					this.element.parentNode.insertBefore(beginComment, this.element);
					//create repeate end comment
					this.endCommentString = "end uku-repeat: " + this.expression + " in " + this.attributeName;
					var endComment = document.createComment(this.endCommentString);
					this.element.parentNode.insertBefore(endComment, this.element.nextSibling);
					//remove definition dom
					this.element.parentNode.removeChild(this.element);
				}
				var treeWalker = document.createTreeWalker(this.parentElement, NodeFilter.SHOW_COMMENT, filter, false);

				function filter(node) {
					if (node.nodeValue === self.beginCommentString) {
						return NodeFilter.FILTER_ACCEPT;
					}
					return NodeFilter.FILTER_SKIP;
				}

				function generateTempContainer() {
					var index = _UkuleleUtil.UkuleleUtil.searchHtmlTag(self.renderTemplate, "tr");
					if (index === -1) {
						return document.createElement("div");
					} else {
						return document.createElement("tbody");
					}
				}

				while (treeWalker.nextNode()) {
					var commentNode = treeWalker.currentNode;
					if (commentNode && commentNode.nodeValue === this.beginCommentString) {
						//remove overtime dom.
						while (commentNode.nextSibling && commentNode.nextSibling.nodeValue !== this.endCommentString) {
							commentNode.parentNode.removeChild(commentNode.nextSibling);
						}
						//create new dom
						var tempDiv = generateTempContainer();
						var blankDiv = generateTempContainer();
						commentNode.parentNode.insertBefore(blankDiv, commentNode.nextSibling);
						for (var i = 0; i < finalValue.length; i++) {

							tempDiv.insertAdjacentHTML('beforeEnd', this.renderTemplate);
							if (i === finalValue.length - 1) {
								var childrenHTML = tempDiv.innerHTML;
								blankDiv.insertAdjacentHTML('beforeBegin', childrenHTML);
								commentNode.parentNode.removeChild(blankDiv);
								tempDiv = null;
								blankDiv = null;
							}
						}

						var child = commentNode.nextSibling;
						for (var j = 0; j < finalValue.length; j++) {
							child.removeAttribute("uku-repeat");
							var ukulele = new Ukulele();
							ukulele.parentUku = this.uku;
							ukulele.registerController(this.expression, finalValue[j]);
							ukulele.dealWithElement(child);
							child = child.nextSibling;
						}
					}
				}

				if (this.element.tagName === "OPTION") {
					var expression = this.parentElement.getAttribute("uku-selected");
					var tempArr = expression.split("|");
					expression = tempArr[0];
					key = tempArr[1];
					var value = this.uku.getFinalValueByExpression(expression);
					if (key) {
						this.parentElement.value = value[key];
					} else {
						this.parentElement.value = value;
					}
				}
			}
		}]);

		return BoundItemRepeat;
	})(_BoundItemBase2.BoundItemBase);

/***/ }
/******/ ])});;