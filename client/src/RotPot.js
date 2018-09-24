import React from 'react';

const RotPot = ({id, paramHandler, state}) => {
    let rotationAngle =  state[id] * 275;
    return (
        <div 
            className="RotPot"
            id={id}
            style={{transform: `rotate(${rotationAngle}deg)`}}
        >
        </div>
    )
}

export default RotPot;