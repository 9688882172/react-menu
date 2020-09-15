import React, { useRef, useMemo } from 'react';
import {
    safeCall,
    bem,
    menuContainerClass,
    CloseReason,
    KeyCodes,
    EventHandlersContext,
    SettingsContext
} from '../utils';
import { MenuList } from './MenuList';


export const useMenuList = (
    menuListProps,
    id,
    animation,
    debugging,
    children,
    onClick,
    onClose,
    skipClick) => {

    const containerRef = useRef(null);

    const settings = useMemo(() => ({
        animation,
        debugging
    }), [animation, debugging]);

    const eventHandlers = useMemo(() => ({
        handleClick(event, isStopPropagation, isCheckorRadio) {
            // According to WAI-ARIA Authoring Practices 1.1
            // Keep menu open when check or radio is invoked by SPACE key
            if (!isCheckorRadio || event.keyCode !== KeyCodes.SPACE) {
                safeCall(onClose, { keyCode: event.keyCode, reason: CloseReason.CLICK });
            }

            if (!isStopPropagation) safeCall(onClick, event);
        }
    }), [onClick, onClose]);

    const handleKeyDown = ({ keyCode }) => {
        switch (keyCode) {
            case KeyCodes.ESC:
                safeCall(onClose, { keyCode, reason: CloseReason.CANCEL });
                break;
        }
    };

    const handleBlur = e => {
        if (menuListProps.isOpen
            && !e.currentTarget.contains(e.relatedTarget)
            && !debugging) {
            safeCall(onClose, { reason: CloseReason.BLUR });

            // If a user clicks on the menu button when a menu is open, we need to close the menu.
            // However, a blur event will be fired prior to the click event on menu button,
            // which makes the menu first close and then open again.
            // If this happen, e.relatedTarget is incorrectly set to null instead of the button in Safari and Firefox,
            // and makes it difficult to determine whether onBlur is fired because of clicking on menu button.
            // This is a workaround approach which sets a flag to skip a following click event.
            if (skipClick) {
                skipClick.current = true;
                setTimeout(() => skipClick.current = false, 300);
            }
        }
    };

    return (
        <div id={id}
            className={bem(menuContainerClass)()}
            role="presentation"
            ref={containerRef}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}>

            <SettingsContext.Provider value={settings}>
                <EventHandlersContext.Provider value={eventHandlers}>
                    <MenuList {...menuListProps} containerRef={containerRef}>
                        {children}
                    </MenuList>
                </EventHandlersContext.Provider>
            </SettingsContext.Provider>
        </div>
    );
}
