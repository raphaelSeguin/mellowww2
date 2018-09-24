import React from 'react';
import Key from './Key';

const Keyboard = ({state, handler}) => 
    <div id="keyboard">
        {
            [...Array(35)].map( (_, i) => {
                return (
                    <Key key={i} n={i} cursor={state.cursor} handler={handler} />
                )
            })
        }
    </div>

export default Keyboard;