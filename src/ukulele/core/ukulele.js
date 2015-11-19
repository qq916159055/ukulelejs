import {UkuleleUtil} from '../util/UkuleleUtil';
import {ObjectUtil} from '../util/ObjectUtil';
import {Selector} from '../extend/Selector';
import {elementChangedBinder} from '../core/ElementActionBinder';
import {ControllerModel} from '../model/ControllerModel';
import {BoundItemAttribute} from '../model/BoundItemAttribute';
import {BoundItemExpression} from '../model/BoundItemExpression';
import {BoundItemInnerText} from '../model/BoundItemInnerText';
import {BoundItemRepeat} from '../model/BoundItemRepeat';
export function Ukulele() {
    let controllersDefinition = {};
    let copyControllers = {};
    let self = this;  
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
        let controllerModel = new ControllerModel(instanceName, controllerInst);
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
        let controller = this.getControllerModelByName(expression).controllerInstance;
        return UkuleleUtil.getFinalValue(this, controller, expression);
    };

    /**
     * @description watch a model, when it was changed, watch would toggle a handler
     * @param {string} target object
     * @param {function} callback function 
     */
    this.watch = function (expression, callback) {
        let controllerModel = getBoundControllerModelByName(expression);
        if (controllerModel) {
            let boundItem = new BoundItemAttribute(attr, tagName, element, self);
            controllerModel.addBoundItem(boundItem);
            boundItem.render(controllerModel.controllerInstance);

            elementChangedBinder(element, tagName, controllerModel, runDirtyChecking);
        }
    };
    /**
     * @description unwatch a model, when it has been add a watch
     * @param {object} target object
     * @param {function} handler function 
     */
    this.unwatch = function (obj, handler) {

    };

    //脏检测
    function runDirtyChecking(ctrlAliasName, excludeElement) {
        if (ctrlAliasName) {
            if (typeof (ctrlAliasName) === "string") {
                watchController(ctrlAliasName);
            } else if (ObjectUtil.isArray(ctrlAliasName)) {
                for (let i = 0; i < ctrlAliasName.length; i++) {
                    watchController(ctrlAliasName[i]);
                }
            }
        } else {
            for (let alias in controllersDefinition) {
                watchController(alias);
            }
        }

        function watchController(alias) {
            let controllerModel = controllersDefinition[alias];
            if (!controllerModel) {
                if (self.parentUku) {
                    self.parentUku.refresh(alias);
                }
                return;
            }
            let controller = controllerModel.controllerInstance;
            let previousCtrlModel = copyControllers[alias];
            for (let i = 0; i < controllerModel.boundItems.length; i++) {
                let boundItem = controllerModel.boundItems[i];
                let attrName = boundItem.attributeName;
                if (previousCtrlModel) {
                    if (boundItem.ukuTag === "selected") {
                        attrName = attrName.split("|")[0];
                    }
                    let finalValue = UkuleleUtil.getFinalValue(self, controller, attrName);
                    let previousFinalValue = UkuleleUtil.getFinalValue(self, previousCtrlModel, attrName);
                    if (!ObjectUtil.compare(previousFinalValue, finalValue)) {
                        attrName = boundItem.attributeName;
                        let changedBoundItems = controllerModel.getBoundItemsByName(attrName);
                        for (let j = 0; j < changedBoundItems.length; j++) {
                            let changedBoundItem = changedBoundItems[j];
							if(changedBoundItem.element !== excludeElement){
								changedBoundItem.render(controller);
							}
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
        for (let alias in controllersDefinition) {
            let controllerModel = controllersDefinition[alias];
            let controller = controllerModel.controllerInstance;
            copyControllerInstance(controller, alias);
        }
    }

    function copyControllerInstance(controller, alias) {
        let previousCtrlModel = ObjectUtil.deepClone(controller);
        delete copyControllers[alias];
        copyControllers[alias] = previousCtrlModel;
    }


    //解析html中各个uku的tag
    function analyizeElement(element) {
        let onloadHandlerQueue = [];
        searchIncludeTag(element, function () {
            let subElements = [];
            //scan element which has uku-* tag
            let isSelfHasUkuTag = Selector.fuzzyFind(element, 'uku-');
            if (isSelfHasUkuTag) {
                subElements.push(isSelfHasUkuTag);
            }
            let allChildren = element.querySelectorAll("*");
            for (let i = 0; i < allChildren.length; i++) {
                let child = allChildren[i];
                let matchElement = Selector.fuzzyFind(child, 'uku-');
                if (matchElement && !UkuleleUtil.isInRepeat(matchElement)) {
                    subElements.push(matchElement);
                }
            }
            searchExpression(element);
            //解析绑定 attribute，注册event
            for (let n = 0; n < subElements.length; n++) {
                let subElement = subElements[n];
                let orderAttrs = sortAttributes(subElement);
                for (let j = 0; j < orderAttrs.length; j++) {
                    let attribute = orderAttrs[j];
                    if (UkuleleUtil.searchUkuAttrTag(attribute.nodeName) > -1) {
                        let tempArr = attribute.nodeName.split('-');
                        tempArr.shift();
                        let attrName = tempArr.join('-');
                        if (attrName !== "application") {
                            if (attrName.search('on') === 0) {
                                //is an event
                                if (!UkuleleUtil.isRepeat(subElement) && !UkuleleUtil.isInRepeat(subElement)) {
                                    dealWithEvent(subElement, attrName);
                                }
                            } else if (attrName.search('repeat') !== -1) {
                                //is an repeat
                                dealWithRepeat(subElement);
                            } else {
                                //is an attribute
                                if (!UkuleleUtil.isRepeat(subElement) && !UkuleleUtil.isInRepeat(subElement)) {
                                    if(attrName !== "text")
                                    {
                                        dealWithAttribute(subElement, attrName);        
                                    }else{
                                        dealWithInnerText(subElement);
                                    }
                                    
                                }
                            }
                        }
                    }
                }
            }
			copyAllController();
            while (onloadHandlerQueue.length > 0) {
                let handler = onloadHandlerQueue.pop();
                handler.func.apply(this, handler.args);
            }

            if (self.refreshHandler) {
                self.refreshHandler.call(self);
            }
            if (self.initHandler) {
                self.initHandler.call(self, element);
            }
            function sortAttributes(subElement) {
                let orderAttrs = [];
                for (let i = 0; i < subElement.attributes.length; i++) {
                    let attribute = subElement.attributes[i];
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
            let tags = element.querySelectorAll('.uku-include');
            let index = 0;
            if (index < tags.length) {
                dealWithInclude(index);
            } else {
                retFunc();
            }

            function dealWithInclude(index) {
                let tag = tags[index];
                let isLoad = tag.getAttribute("load");
                if (isLoad === "false") {
                    index++;
                    if (index < tags.length) {
                        dealWithInclude(index);
                    } else {
                        retFunc();
                    }
                } else {
                    let src = tag.getAttribute("src");
                    let replace = tag.getAttribute("replace");
                    let replaceController = tag.getAttribute("replace-controller");
                    let ajax = new Ajax();
                    if (replace && replace === "true") {
                        (function (x) {
                            ajax.get(src, function (html) {
                                if (replaceController) {
                                    html = doReplace(html, replaceController);
                                }
                                x.insertAdjacentHTML('beforeBegin', html);
                                let htmlDom = x.previousElementSibling;
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
                    let expression = hostElement.getAttribute("uku-onload");
                    if (expression) {
                        if (replaceElement) {
                            getBoundAttributeValue(expression, [replaceElement]);
                        } else {
                            getBoundAttributeValue(expression, [hostElement]);
                        }
                    }
                }

                function doReplace(html, replaceController) {
                    let tempArr = replaceController.split("|");
                    if (tempArr && tempArr.length === 2) {
                        let oldCtrl = tempArr[0];
                        let newCtrl = tempArr[1];
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
            if (UkuleleUtil.searchUkuExpTag(Selector.directText(element)) !== -1) {
                if (!UkuleleUtil.isRepeat(element) && !UkuleleUtil.isInRepeat(element)) {
                    //normal expression
                    dealWithExpression(element);
                }
            }
            for (let i = 0; i < element.children.length; i++) {
                searchExpression(element.children[i]);
            }
        }
        //处理绑定的expression
        function dealWithExpression(element) {
            //通常的花括号声明方式
            let expression = Selector.directText(element);
            if (UkuleleUtil.searchUkuExpTag(expression) !== -1) {
                let attr = expression.slice(2, -2);
                let controllerModel = getBoundControllerModelByName(attr);
                if (controllerModel) {
                    let boundItem = new BoundItemExpression(attr, expression, element, self);
                    controllerModel.addBoundItem(boundItem);
                    boundItem.render(controllerModel.controllerInstance);
                }
            }
        }
        //处理绑定的attribute
        function dealWithAttribute(element, tagName) {
            let attr = element.getAttribute("uku-" + tagName);
            let elementName = element.tagName;
            let controllerModel = getBoundControllerModelByName(attr);
            if (controllerModel) {
                let boundItem = new BoundItemAttribute(attr, tagName, element, self);
                controllerModel.addBoundItem(boundItem);
                boundItem.render(controllerModel.controllerInstance);
                elementChangedBinder(element, tagName, controllerModel, runDirtyChecking);
            }
        }

        //
        function dealWithInnerText(element) {
            let attr = element.getAttribute("uku-text");
            if (attr) {
                let controllerModel = getBoundControllerModelByName(attr);
                if (controllerModel) {
                    let boundItem = new BoundItemInnerText(attr, element, self);
                    controllerModel.addBoundItem(boundItem);
                    boundItem.render(controllerModel.controllerInstance);
                }
            }
        }

        //处理 事件 event
        function dealWithEvent(element, eventName) {
            let expression = element.getAttribute("uku-" + eventName);
            let eventNameInListener = eventName.substring(2);
            let controllerModel = getBoundControllerModelByName(expression);
            if (controllerModel) {
                let controller = controllerModel.controllerInstance;
                let temArr = expression.split(".");
                let alias;
                if (temArr[0] === "parent") {
                    alias = temArr[1];
                } else {
                    alias = temArr[0];
                }
                element.addEventListener(eventNameInListener, function (event) {
                    copyControllerInstance(controller, alias);
                    getBoundAttributeValue(expression, arguments);
                    runDirtyChecking(alias, element);
                });
            }
        }
        //处理 repeat
        function dealWithRepeat(element) {
            let repeatExpression = element.getAttribute("uku-repeat");
            let tempArr = repeatExpression.split(' in ');
            let itemName = tempArr[0];
            let attr = tempArr[1];
            let controllerModel = getBoundControllerModelByName(attr);
            if (controllerModel) {
                let controllerInst = controllerModel.controllerInstance;
                let boundItem = new BoundItemRepeat(attr, itemName, element, self);
                controllerModel.addBoundItem(boundItem);
                boundItem.render(controllerInst);
            }
        }
    }

    //根据attrName 确定对应的ControllerModel ，比如  parent.mgr.xxx.yyy来找到以mgr为别名的ControllerModel
    function getBoundControllerModelByName(attrName) {
        let instanceName = UkuleleUtil.getBoundModelInstantName(attrName);
        let controllerModel = controllersDefinition[instanceName];
        if (!controllerModel) {
            let tempArr = attrName.split(".");
            let isParentScope = tempArr[0];
            if (isParentScope === "parent" && self.parentUku) {
                tempArr.shift();
                attrName = tempArr.join(".");
                return self.parentUku.getControllerModelByName(attrName);
            }
        }
        return controllerModel;
    }

    function getBoundAttributeValue(attr, additionalArgu) {
        let controllerModel = getBoundControllerModelByName(attr);
        let controllerInst = controllerModel.controllerInstance;
        let result = UkuleleUtil.getFinalValue(self, controllerInst, attr, additionalArgu);
        return result;
    }

    function manageApplication() {
        let apps = document.querySelectorAll("[uku-application]");
        if (apps.length === 1) {
            analyizeElement(apps[0]);
        } else {
            throw new Error("Only one 'uku-application' can be declared in a whole html.");
        }
    }
}