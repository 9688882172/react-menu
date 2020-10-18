import PropTypes from 'prop-types';

export const stylePropTypes = (name) => ({
    [name ? `${name}ClassName` : 'className']: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.func
    ]),
    [name ? `${name}Styles` : 'styles']: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.func
    ]),
});

export const sharedMenuPropTypes = {
    ...stylePropTypes(),
    ...stylePropTypes('arrow'),
    'aria-label': PropTypes.string,
    arrow: PropTypes.bool,
    offsetX: PropTypes.number,
    offsetY: PropTypes.number,
    align: PropTypes.oneOf(['start', 'center', 'end']),
    direction: PropTypes.oneOf(['left', 'right', 'top', 'bottom']),
    position: PropTypes.oneOf(['auto', 'anchor', 'initial']),
    overflow: PropTypes.oneOf(['auto', 'visible', 'hidden']),
    children: PropTypes.node.isRequired
}

export const menuPropTypesBase = {
    ...sharedMenuPropTypes,
    id: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    animation: PropTypes.bool,
    debugging: PropTypes.bool,
    viewScroll: PropTypes.oneOf(['auto', 'close', 'initial']),
    onClick: PropTypes.func
};

export const sharedMenuDefaultProp = {
    offsetX: 0,
    offsetY: 0,
    align: 'start',
    direction: 'bottom',
    position: 'auto',
    overflow: 'visible'
};

export const menuDefaultPropsBase = {
    ...sharedMenuDefaultProp,
    animation: true,
    viewScroll: 'initial'
};
