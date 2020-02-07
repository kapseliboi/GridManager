const typeMap = {
    '[object String]': 'string',
    '[object Boolean]': 'boolean',
    '[object Undefined]': 'undefined',
    '[object Number]': 'number',
    '[object Object]': 'object',
    '[object Error]': 'error',
    '[object Function]': 'function',
    '[object Date]': 'date',
    '[object Array]': 'array',
    '[object RegExp]': 'regexp',
    '[object Null]': 'null',
    '[object NodeList]': 'nodeList',
    '[object Arguments]': 'arguments',
    '[object Window]': 'window',
    '[object HTMLDocument]': 'document'
};

export const isWindow = object => {
    return object !== null && object === object.window;
};

export const type = value => {
    return typeMap[Object.prototype.toString.call(value)] || (value instanceof Element ? 'element' : '');
};

export const noop = () => {};

export const each = (object, callback) => {
    // 当前为jTool对象,循环目标更换为jTool.DOMList
    if (object && object.jTool) {
        object = object.DOMList;
    }

    const objType = type(object);

    // 为类数组时, 返回: index, value
    if (objType === 'array' || objType === 'nodeList' || objType === 'arguments') {
        // 由于存在类数组 NodeList, 所以不能直接调用 every 方法
        [].every.call(object, (v, i) => {
            // 处理jTool 对象
            if (!isWindow(v) && v.jTool) {
                console.log(v);
                v = v.get(0);
            }
            return callback.call(v, i, v) !== false;
        });
    } else if (objType === 'object') {
        for(const i in object) {
            if(callback.call(object[i], i, object[i]) === false) {
                break;
            }
        }
    }
};

// 获取节点样式: key为空时则返回全部
export const getStyle = (dom, key) => {
    return key ? window.getComputedStyle(dom)[key] : window.getComputedStyle(dom);
};

// 通过html字符串, 生成DOM.  返回生成后的子节点
// 该方法无处处理包含table标签的字符串,但是可以处理table下属的标签
export const createDOM = htmlString => {
    let jToolDOM = document.querySelector('#jTool-create-dom');
    if (!jToolDOM || jToolDOM.length === 0) {
        // table标签 可以在新建element时可以更好的容错.
        // div标签, 添加thead,tbody等表格标签时,只会对中间的文本进行创建
        // table标签,在添加任务标签时,都会成功生成.且会对table类标签进行自动补全
        const el = document.createElement('table');
        el.id = 'jTool-create-dom';
        el.style.display = 'none';
        document.body.appendChild(el);
        jToolDOM = document.querySelector('#jTool-create-dom');
    }

    jToolDOM.innerHTML = htmlString || '';
    let childNodes = jToolDOM.childNodes;

    // 进行table类标签清理, 原因是在增加如th,td等table类标签时,浏览器会自动补全节点.
    if (childNodes.length === 1 && !/<tbody|<TBODY/.test(htmlString) && childNodes[0].nodeName === 'TBODY') {
        childNodes = childNodes[0].childNodes;
    }
    if (childNodes.length === 1 && !/<thead|<THEAD/.test(htmlString) && childNodes[0].nodeName === 'THEAD') {
        childNodes = childNodes[0].childNodes;
    }
    if (childNodes.length === 1 && !/<tr|<TR/.test(htmlString) &&  childNodes[0].nodeName === 'TR') {
        childNodes = childNodes[0].childNodes;
    }
    if (childNodes.length === 1 && !/<td|<TD/.test(htmlString) && childNodes[0].nodeName === 'TD') {
        childNodes = childNodes[0].childNodes;
    }
    if (childNodes.length === 1 && !/<th|<TH/.test(htmlString) && childNodes[0].nodeName === 'TH') {
        childNodes = childNodes[0].childNodes;
    }
    document.body.removeChild(jToolDOM);
    return childNodes;
};

/**
 * 是否为 undefined
 * @param o
 * @returns {boolean}
 */
export const isUndefined = o => {
    return type(o) === 'undefined';
};

/**
 * 是否为 null
 * @param o
 * @returns {boolean}
 */
export const isNull = o => {
    return type(o) === 'null';
};
/**
 * 是否为 string
 * @param o
 * @returns {boolean}
 */
export const isString = o => {
    return type(o) === 'string';
};

/**
 * 是否为 function
 * @param o
 * @returns {boolean}
 */
export const isFunction = o => {
    return type(o) === 'function';
};

/**
 * 是否为 number
 * @param o
 * @returns {boolean}
 */
export const isNumber = o => {
    return type(o) === 'number';
};

/**
 * 是否为 boolean
 * @param o
 * @returns {boolean}
 */
export const isBoolean = o => {
    return type(o) === 'boolean';
};

/**
 * 是否为 object
 * @param o
 * @returns {boolean}
 */
export const isObject = o => {
    return type(o) === 'object';
};

/**
 * 是否为空对像
 * @param o
 * @returns {boolean}
 */
export const isEmptyObject = obj => {
    let isEmptyObj = true;
    for (const pro in obj) {
        if(obj.hasOwnProperty(pro)) {
            isEmptyObj = false;
        }
    }
    return isEmptyObj;
};

/**
 * 是否为 array
 * @param o
 * @returns {boolean}
 */
export const isArray = o => {
    return type(o) === 'array';
};

/**
 * 是否为 element
 * @param o
 * @returns {boolean}
 */
export const isElement = o => {
    return type(o) === 'element';
};

/**
 * 是否为 nodeList
 * @param o
 * @returns {boolean}
 */
export const isNodeList = o => {
    return type(o) === 'nodeList';
};

export default {
    isWindow,
    noop,
    type,
    getStyle,
    isEmptyObject,
    each
};
