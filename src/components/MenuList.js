import React, { useState, useLayoutEffect, useRef, useMemo, useCallback } from 'react';
import './styles/index.scss';
import { bem, menuClass, ActiveIndexContext, keyCodes } from '../utils';


export const MenuList = React.memo(({
    isOpen,
    isMounted,
    isKeyboardEvent,
    containerRef,
    anchorRef,
    children,
    direction }) => {

    // console.log(`MenuList render`);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [activeIndex, setActiveIndex] = useState(-1);
    const menuRef = useRef(null);

    const handleMouseEnter = useCallback((index) => {
        setActiveIndex(index);
    }, []);

    const menuItems = useMemo(() => {
        // isMounted && console.log(`MenuList re-create children`);
        return isMounted
            && React.Children.map(children, (child, index) => {
                return React.cloneElement(child, {
                    index,
                    onMouseEnter: handleMouseEnter
                })
            });
    }, [isMounted, children, handleMouseEnter]);

    const handleKeyDown = e => {
        const childrenCount = React.Children.count(children);
        let handled = false;

        switch (e.keyCode) {
            case keyCodes.UP:
                setActiveIndex(i => {
                    i--;
                    if (i < 0) i = childrenCount - 1;
                    return i;
                });
                handled = true;
                break;

            case keyCodes.DOWN:
                setActiveIndex(i => {
                    i++;
                    if (i >= childrenCount) i = 0;
                    return i;
                });
                handled = true;
                break;

            // prevent browser from scrolling the page when pressing SPACE or RETURN
            case keyCodes.SPACE:
            case keyCodes.RETURN:
                if (e.currentTarget.contains(e.target)) e.preventDefault();
                break;
        }

        if (handled) {
            e.preventDefault();
            e.stopPropagation();
        }
    }

    useLayoutEffect(() => {
        if (isOpen) {
            menuRef.current.focus();
            const containerRect = containerRef.current.getBoundingClientRect();
            const anchorRect = anchorRef.current.getBoundingClientRect();

            let newPosition;
            switch (direction) {
                case 'inline-end':
                    newPosition = {
                        x: anchorRect.right - containerRect.left,
                        y: anchorRect.top - containerRect.top
                    };
                    break;

                case 'block-end':
                default:
                    newPosition = {
                        x: anchorRect.left - containerRect.left,
                        y: anchorRect.bottom - containerRect.top
                    };
            }
            setPosition(newPosition);
            if (isKeyboardEvent) setActiveIndex(0);
        } else {
            setActiveIndex(-1);
        }
    }, [isOpen, containerRef, anchorRef, direction]);

    return (
        <React.Fragment>
            {isMounted &&
                <ul className={bem(menuClass, null, ['open', isOpen])}
                    role="menu" tabIndex="-1" ref={menuRef}
                    onKeyDown={handleKeyDown}
                    style={{
                        left: position.x,
                        top: position.y
                    }}>
                    <ActiveIndexContext.Provider value={activeIndex}>
                        {menuItems}
                    </ActiveIndexContext.Provider>
                </ul>}
        </React.Fragment>
    );
});