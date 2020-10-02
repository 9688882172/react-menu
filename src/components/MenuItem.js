import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import {
    defineName,
    safeCall,
    bem,
    flatStyles,
    stylePropTypes,
    menuClass,
    menuItemClass,
    EventHandlersContext,
    RadioGroupContext,
    KeyCodes,
    useActiveState,
    useItemState
} from '../utils';


export const MenuItem = defineName(React.memo(function MenuItem({
    className,
    styles,
    value,
    href,
    type,
    checked,
    disabled,
    index,
    children,
    onClick,
    ...restProps }) {

    const {
        ref,
        isHovering,
        isDisabled,
        setHover,
        unsetHover
    } = useItemState(disabled, index);
    const eventHandlers = useContext(EventHandlersContext);
    const radioGroup = useContext(RadioGroupContext);
    const { isActive, onKeyUp, onBlur, ...activeStateHandlers } = useActiveState();
    const isRadio = type === 'radio';
    const isCheckBox = type === 'checkbox';
    const isAnchor = href && !isDisabled && !isRadio && !isCheckBox;

    const handleClick = (keyCode) => {
        if (isDisabled) return;

        let isStopPropagation = false;
        const event = { value, keyCode };
        if (isCheckBox) {
            event.checked = !checked;
        }

        if (isRadio) {
            event.name = radioGroup.name;
            isStopPropagation = true;
            safeCall(radioGroup.onChange, event);
        } else {
            isStopPropagation = safeCall(onClick, event) === false;
        }

        eventHandlers.handleClick(
            event,
            isStopPropagation,
            isCheckBox || isRadio);
    }

    const handleKeyUp = e => {
        // Check 'isActive' to skip KeyUp when corresponding KeyDown was initiated in another menu item
        if (!isActive) return;

        onKeyUp(e);
        switch (e.keyCode) {
            case KeyCodes.SPACE:
            case KeyCodes.RETURN:
                if (isAnchor) {
                    ref.current.click();
                } else {
                    handleClick(e.keyCode);
                }
                break;
        }
    }

    const handleBlur = e => {
        onBlur(e);
        unsetHover(e);
    }

    const modifiers = Object.freeze({
        type,
        disabled: isDisabled,
        hover: isHovering,
        active: isActive && !isDisabled,
        checked: isRadio ? radioGroup.value === value : (isCheckBox ? !!checked : undefined),
        anchor: isAnchor
    });

    const menuItemProps = {
        className: bem(menuClass, menuItemClass, modifiers)(className),
        style: flatStyles(styles, modifiers),
        role: isRadio ? 'menuitemradio' : (isCheckBox ? 'menuitemcheckbox' : 'menuitem'),
        'aria-checked': modifiers.checked,
        'aria-disabled': isDisabled,
        tabIndex: isHovering ? 0 : -1,
        ref,
        onMouseEnter: setHover,
        onKeyUp: handleKeyUp,
        onBlur: handleBlur,
        onClick: () => handleClick(),
        ...activeStateHandlers
    };

    const renderChildren = safeCall(children, modifiers);

    if (isAnchor) {
        return (
            <li role="presentation">
                <a {...restProps} href={href} {...menuItemProps} >
                    {renderChildren}
                </a>
            </li>
        );
    } else {
        return (
            <li {...menuItemProps}>
                {renderChildren}
            </li>
        );
    }
}), 'MenuItem');

MenuItem.propTypes = {
    ...stylePropTypes,
    value: PropTypes.any,
    href: PropTypes.string,
    type: PropTypes.oneOf(['checkbox', 'radio']),
    checked: PropTypes.bool,
    disabled: PropTypes.bool,
    children: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.func
    ]).isRequired,
    onClick: PropTypes.func
};
