class ElementWrapper {
  constructor(type) {
    this.root = document.createElement(type);
  }
  setAttribute(name, value) {
    this.root.setAttribute(name, value);
  }
  // 是一个虚拟的child
  appendChild(vchild) {
    vchild.mounTo(this.root);
  }
  // 真实 parent
  mounTo(parent) {
    parent.appendChild(this.root);
  }
}

class TextWrapper {
  constructor(content) {
    this.root = document.createTextNode(content);
  }
  mounTo(parent) {
    parent.appendChild(this.root);
  }
}

export class Component {
  constructor() {
    this.children = [];
  }
  setAttribute(name, value) {
    this[name] = value;
  }
  mounTo(parent) {
    let vdom = this.render();
    vdom.mounTo(parent);
  }
  appendChild(vchild) {
    this.children.push(vchild);
  }
}

export let ToyReact = {
  /**
   * 
   * @param {*} type 组件名
   * @param {*} attributes 参数
   * @param  {...any} children 子节点数组
   */
  createElement(type, attributes, ...children) {
    let element;
    if (typeof type === "string") {
      element = new ElementWrapper(type);
    } else {
      element = new type();
    }

    for (let name in attributes) {
      element.setAttribute(name, attributes[name]);
    }

    let insertChildren = (children) => {
      for (let child of children) {
        if (typeof child === "object" && child instanceof Array) {
          insertChildren(child);
        } else {
          // 无法识别的直接转为字符串, 如:对象
          if (
            !(child instanceof ElementWrapper) &&
            !(child instanceof TextWrapper) &&
            !(child instanceof Component)
          ) {
            child = `${child}`;
          }
          if (typeof child === "string") {
            child = new TextWrapper(child);
          }

          element.appendChild(child);
        }
      }
    };
    insertChildren(children);
    return element;
  },
  render(vdom, element) {
    vdom.mounTo(element);
  },
};
