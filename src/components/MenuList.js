import React, { useState, useLayoutEffect, useRef, useMemo } from 'react';
import './styles/index.scss';
import { bem, menuClass, ActiveIndexContext, keyCodes } from '../utils';


export const MenuList = React.memo(({
    isOpen,
    containerRef, 
    anchorRef, 
    children,
    direction }) => {

    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [activeIndex, setActiveIndex] = useState(-1);
    const menuRef = useRef(null);

    const handleMouseEnter = (index) => {
        setActiveIndex(index);
    }

    const menuItems = useMemo(() => {
        // isOpen && console.log(`MenuList re-create children`);
        return isOpen && React.Children.map(children, (child, index) => {
            return React.cloneElement(child, {
                index,
                onMouseEnter: handleMouseEnter
            })
        });
    }, [children, isOpen]);

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
        } else {
            setActiveIndex(-1);
        }
    }, [isOpen, containerRef, anchorRef, direction]);

    return (
        <React.Fragment>
            {isOpen &&
                <ul className={bem(menuClass)} role="menu" tabIndex="-1" ref={menuRef}
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
