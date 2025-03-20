export class AttributeManager {
    static setAttributes(el, attrs) {
        const { class: className, style, ...otherAttrs } = attrs;
        if (className) {
            AttributeManager.setClass(el, className);
        }
        if (style) {
            Object.entries(style).forEach(([prop, value]) => {
                AttributeManager.setStyle(el, prop, value);
            });
        }
        for (const [name, value] of Object.entries(otherAttrs)) {
            AttributeManager.setAttribute(el, name, value);
        }
    }

    static setClass(el, className) {
        el.className = '';
        if (typeof className === 'string') {
            el.className = className;
        }
        if (Array.isArray(className)) {
            el.classList.add(...className);
        }
    }

    static setStyle(el, name, value) {
        el.style[name] = value;
    }

    static removeStyle(el, name) {
        el.style[name] = null;
    }

    static setAttribute(el, name, value) {
        if (value == null) {
            AttributeManager.removeAttribute(el, name);
        } else if (name.startsWith('data-')) {
            el.setAttribute(name, value);
        } else {
            el[name] = value;
        }
    }

    static removeAttribute(el, name) {
        el[name] = null;
        el.removeAttribute(name);
    }
}

export const { setAttributes, setStyle, removeStyle, setAttribute, removeAttribute } = AttributeManager;
