import React, { useRef, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
    safeCall,
    bem,
    menuContainerClass,
    menuPropTypesBase,
    EventHandlersContext,
    SettingsContext,
    CloseReason,
    KeyCodes,
    FocusPositions,
    useMenuState,
    useMenuList
} from '../utils';
import { MenuList } from './MenuList'


export const Menu = React.memo(function Menu({
    'aria-label': ariaLabel,
    className,
    styles,
    animation,
    debugging,
    keepMounted,
    align,
    direction,
    menuButton,
    children,
    onOpen,
    onClose,
    onClick }) {

    const buttonRef = useRef(null);
    const {
        isMounted, isOpen, menuItemFocus,
        openMenu, closeMenu
    } = useMenuState(keepMounted);

    const handleOpen = useCallback((menuItemFocus, e = {}) => {
        safeCall(onOpen, e);
        openMenu(menuItemFocus);
    }, [openMenu, onOpen]);

    const handleClose = useCallback((e = {}) => {
        closeMenu();
        if (e.keyCode) buttonRef.current.focus();
        safeCall(onClose, e);
    }, [closeMenu, onClose]);

    const {
        containerRef,
        settings,
        eventHandlers,
        ...otherHandlers
    } = useMenuList(animation, debugging, onClick, handleClose);

    const handleClick = useCallback(e => {
        if (isOpen) {
            handleClose({ reason: CloseReason.BUTTON });
        } else {
            // Focus (hover) the first menu item when onClick event is trigger by keyboard
            handleOpen(e.detail === 0
                ? FocusPositions.FIRST
                : FocusPositions.INITIAL);
        }
    }, [isOpen, handleOpen, handleClose]);

    const handleKeyDown = useCallback(e => {
        let handled = false;

        switch (e.keyCode) {
            case KeyCodes.UP:
                handleOpen(FocusPositions.LAST);
                handled = true;
                break;

            case KeyCodes.DOWN:
                handleOpen(FocusPositions.FIRST);
                handled = true;
                break;
        }

        if (handled) e.preventDefault();
    }, [handleOpen]);

    const button = safeCall(menuButton, { open: isOpen });

    const renderButton = useMemo(() => {
        if (!button) return null;

        const buttonProps = {
            ref: buttonRef,
            onClick: handleClick,
            onKeyDown: handleKeyDown
        };
        if (button.type.__name__ === 'MenuButton') {
            buttonProps.isOpen = isOpen;
        }
        return React.cloneElement(button, buttonProps);
    }, [button, isOpen, handleClick, handleKeyDown]);

    return (
        <div className={bem(menuContainerClass)()}
            role="presentation" ref={containerRef} {...otherHandlers}>
            {renderButton}

            <SettingsContext.Provider value={settings}>
                <EventHandlersContext.Provider value={eventHandlers}>
                    <MenuList
                        ariaLabel={
                            ariaLabel ||
                            (typeof button.props.children === 'string'
                                ? button.props.children
                                : 'Menu')}
                        className={className}
                        styles={styles}
                        anchorRef={buttonRef}
                        containerRef={containerRef}
                        align={align}
                        direction={direction}
                        isOpen={isOpen}
                        isMounted={isMounted}
                        menuItemFocus={menuItemFocus}>
                        {children}
                    </MenuList>
                </EventHandlersContext.Provider>
            </SettingsContext.Provider>
        </div>
    );
});

Menu.propTypes = {
    ...menuPropTypesBase,
    keepMounted: PropTypes.bool,
    menuButton: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.func
    ]).isRequired,
    onOpen: PropTypes.func
};

Menu.defaultProps = {
    animation: true,
    keepMounted: true
};
