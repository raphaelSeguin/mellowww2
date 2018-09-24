import React from 'react';
import Menu from './Menu';
import Panel from './Panel';
import Slider from './Slider';

const Controls = ({handler, state}) =>
    <div id="controls">
        <Menu handler={handler} state={state}/>
        <Panel handler={handler} state={state} />
        <Slider state={state}/>
    </div>

export default Controls;