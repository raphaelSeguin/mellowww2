import React from 'react';

import {sliderWidth} from './constants.js'

const Slider = ({cursorDrag, state}) => 
    <div id="slider">
        <div id="cursor" style={{left: state.cursor * sliderWidth}}></div>
    </div>

export default Slider;