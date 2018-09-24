import React from 'react';
import {samples} from './constants.js';

const Menu = ({handler, state}) => {
    const instrumentsList = Object.keys(samples);

    return (
        <div id="menu">
            {
                instrumentsList.map( (instr, i) =>
                    <p 
                        className={state.instrument === instr ? 'active' : ''}
                        onClick={() => handler('instrument', instr)}
                        key={i}
                    >{instr}</p>
                )
            }
        </div>
    )
}

export default Menu;