import React, { useState, useEffect, useRef } from 'react'

import {
  Menu, MenuItem, SubMenu, MenuButton,
  MenuRadioGroup, MenuDivider, MenuHeader, ContextMenu
} from '@szhsin/react-menu'
import '@szhsin/react-menu/dist/index.css'
import './index.css'

const App = () => {
  const [count, setCount] = useState(0);
  const [disabled, setDisabled] = useState(false);
  const [checkBoxs, setCheckBoxs] = useState([true, false]);
  const [radioValue, setRadioValue] = useState(1);
  const [isOpen, setOpen] = useState(false);
  const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 });
  const btnRef = useRef(null);

  const handleMenuClick = (e) => {
    switch (e.value) {
      case 'check1':
        setCheckBoxs(c => [e.checked, c[1]]);
        break;

      case 'check2':
        setCheckBoxs(c => [c[0], e.checked]);
        break;

      default:
        console.log('Menu click:', e.value);
        break;
    }
  }

  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault();
      setAnchorPoint({ x: e.clientX, y: e.clientY });
      setOpen(true);
    }

    window.addEventListener('contextmenu', handleContextMenu);

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
    }
  }, []);

  const specialClass = ({ active, hover }) => {
    // if (active) return 'special-item-active';
    // if (hover) return 'special-item-hover';
    // return 'special-item';
    return '';
  }

  return (
    <div className="container">
      <button onClick={() => setCount(c => c + 1)}>count: {count}</button>
      <button onClick={() => setDisabled(d => !d)}>Toggle disabled</button>
      <div><textarea rows="5" /></div>

      <Menu styles={{ border: '2px dashed purple' }}
        menuButton={({ isOpen }) => <MenuButton className="my-button">{isOpen ? 'Close' : 'Open'}</MenuButton>}
        onClick={handleMenuClick} direction="bottom" animation>
        <MenuItem value="1">item 1</MenuItem>
        <MenuItem className={specialClass} href="https://www.google.com/" target="_blank" value="google">Google</MenuItem>
        <MenuItem href="#" value="#" disabled={disabled}>item 2 (A long item)</MenuItem>
        <MenuItem disabled>item (disabled)</MenuItem>
        <SubMenu label="item 3" className={specialClass} menuClassName="my-menu">
          <MenuItem disabled={disabled}>item 3.1</MenuItem>
          <MenuDivider />
          <SubMenu label="item 3.2" disabled={disabled}>
            <MenuItem
              value="foo"
              onClick={e => console.log(`item 3.2.1 clicked: ${e}`)}>
              item 3.2.1
            </MenuItem>
            <MenuItem
              value="bar"
              onClick={e => {
                console.log(`item 3.2.2 clicked: ${e}`);
                return false;
              }}>
              item 3.2.2
            </MenuItem>
            <SubMenu label="more...">
              {[7, 8, 9].map(i => <MenuItem key={i} value={i}>{`Item ${i}`}</MenuItem>)}
            </SubMenu>
            <MenuItem value={323}>item 3.2.3</MenuItem>
          </SubMenu>
          <MenuItem href="https://github.com">Github</MenuItem>
          {[4, 5, 6].map(i => <MenuItem key={i} value={i}>{`Item ${i}`}</MenuItem>)}
        </SubMenu>
        <MenuDivider />
        <MenuItem type="checkbox" value={'check1'} checked={checkBoxs[0]}>Bold</MenuItem>
        <MenuItem type="checkbox" value={'check2'}
          checked={checkBoxs[1]} disabled={disabled}>
          Italic
        </MenuItem>
        <MenuDivider />
        <MenuHeader>Font size</MenuHeader>
        <MenuRadioGroup value={radioValue} onChange={(e) => setRadioValue(e.value)}>
          {[16, 24, 32].map((i) =>
            <MenuItem styles={{
              color: 'blue',
              type: { radio: { color: 'red' } },
              backgroundColor: 'yellow',
              hover: {
                backgroundColor: '#bd7810'
              },
              active: {
                backgroundColor: '#333',
                color: 'yellow'
              }
            }} value={i} key={i}>{`${i}px`}</MenuItem>)}
        </MenuRadioGroup>
        <MenuDivider />
        <MenuItem className={specialClass} styles={{
          color: 'blue',
          backgroundColor: 'yellow',
          hover: {
            backgroundColor: '#bd7810'
          },
          active: {
            backgroundColor: '#333',
            color: 'yellow'
          }
        }}>item 4 9</MenuItem>
      </Menu>

      <ContextMenu isOpen={isOpen} anchorPoint={anchorPoint} styles={{ border: '2px dashed green' }}
        onClose={e => {
          setOpen(false);
          if (e.keyCode) btnRef.current.focus();
        }}
        onClick={e => console.log('Context menu click:', e.value)} animation>
        <SubMenu label="more..." menuClassName="my-menu">
          {[1, 2, 3, 4].map(i => <MenuItem key={i} value={i}>{`Item ${i}`}</MenuItem>)}
        </SubMenu>
        <MenuItem styles={({ hover }) => hover ? { backgroundColor: '#980943' } : null}>Copy</MenuItem>
        <MenuItem className={specialClass}>Cut</MenuItem>
        <MenuItem>Paste</MenuItem>

      </ContextMenu>

      <div><input /></div>

      <Menu menuButton={({ isOpen }) => <button>{isOpen ? 'Close' : 'Open'}</button>}
        onClick={handleMenuClick}
        direction={'right'} align="center" animation>
        {[1, 2, 3].map(i => <MenuItem key={i}>{`Item ${i}`}</MenuItem>)}
        <SubMenu label="font size" className={({ open }) => open ? 'submenu-open' : ''}
          styles={{ active: { color: 'red' } }}
          menuStyles={{ border: '2px dashed green' }}>
          <MenuRadioGroup value={radioValue} onChange={(e) => setRadioValue(e.value)}>
            {[1, 2, 3].map(i => <MenuItem disabled={i === 1} value={i} key={i}>{`Radio Item ${i}`}</MenuItem>)}
          </MenuRadioGroup>
        </SubMenu>
      </Menu>

      <button onClick={e => console.log('Button clicked')} ref={btnRef}>Click me</button>

    </div>
  );
}

export default App
