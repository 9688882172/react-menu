export const codeExamples = [
    {
        title: 'Basic menu',

        desc: 'The Basic menu',

        source:
            `<Menu menuButton={<MenuButton>Open menu</MenuButton>}>
        <MenuItem>Open File</MenuItem>
        <MenuItem>Save</MenuItem>
        <MenuItem>Close Window</MenuItem>
</Menu>`,

        fullSource:
            `import React from 'react';
import {
    Menu,
    MenuItem,
    MenuButton
} from '@szhsin/react-menu';

<Menu menuButton={<MenuButton>Open menu</MenuButton>}>
        <MenuItem>Open File</MenuItem>
        <MenuItem>Save</MenuItem>
        <MenuItem>Close Window</MenuItem>
</Menu>`
    }
];