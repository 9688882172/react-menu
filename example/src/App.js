import React, { useState } from 'react'

import { Menu, MenuItem, SubMenu, MenuButton, MenuRadioGroup } from '@szhsin/react-menu'
import '@szhsin/react-menu/dist/index.css'

const App = () => {
  const [count, setCount] = useState(0);
  const [checkBoxs, setCheckBoxs] = useState([true, false]);
  const [radioValue, setRadioValue] = useState(2);

  const handleMenuClick = (e) => {
    switch (e.value) {
      case 'check1':
        setCheckBoxs(c => [e.checked, c[1]]);
        break;

      case 'check2':
        setCheckBoxs(c => [c[0], e.checked]);
        break;

      default:
        console.log(e.value);
        break;
    }
  }



  return (
    <div className="container">
      <button onClick={() => setCount(c => c + 1)}>count: {count}</button>
      <div><textarea rows="5" /></div>

      <Menu menuButton={<MenuButton>Open menu</MenuButton>}
        onClick={handleMenuClick}>
        <MenuItem>item 1</MenuItem>
        <MenuItem>item 2</MenuItem>
        <SubMenu label="item 3 (A long item)">
          <MenuItem>item 3.1</MenuItem>
          <SubMenu label="item 3.2">
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
            <MenuItem value={323}>item 3.2.3</MenuItem>
          </SubMenu>
          <MenuItem>item 3.3</MenuItem>
        </SubMenu>
        <MenuItem type="checkbox" value={'check1'} checked={checkBoxs[0]}>Bold</MenuItem>
        <MenuItem type="checkbox" value={'check2'} checked={checkBoxs[1]}>Italic</MenuItem>
        <MenuItem type="radi2o">item 4</MenuItem>
      </Menu>

      <div><input /></div>

      <Menu menuButton={<button>Customisable button</button>} onClick={handleMenuClick}>
        {[1, 2, 3, 4].map(i => <MenuItem key={i}>{`Item ${i}`}</MenuItem>)}
        <SubMenu label="font size">
          <MenuRadioGroup value={radioValue} onChange={(e) => setRadioValue(e.value)}>
            {[1, 2, 3].map(i => <MenuItem value={i} key={i} type="checkbox">{`Radio Item ${i}`}</MenuItem>)}
          </MenuRadioGroup>
        </SubMenu>
        <MenuItem>item 5</MenuItem>
      </Menu>

      <button onClick={e => console.log('Button clicked')}>Click me</button>

    </div>
  );
}

export default App
