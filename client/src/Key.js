import React from 'react';

const Key = ({n, cursor, handler, pressed}) => {
    const keyMap = {
        0: {
            name: 'G',
            color: 'white',
            index: 0
        },
        1: {
            name: 'Gsharp',
            color: 'black',
            index: 0
        },
        2: {
            name: 'A',
            color: 'white',
            index: 1
        },
        3: {
            name: 'Asharp',
            color: 'black',
            index: 1
        },
        4: {
            name: 'B',
            color: 'white',
            index: 2
        },
        5: {
            name: 'C',
            color: 'white',
            index: 3
        },
        6: {
            name: 'Csharp',
            color: 'black',
            index: 3
        },
        7: {
            name: 'D',
            color: 'white',
            index: 4
        },
        8: {
            name: 'Dsharp',
            color: 'black',
            index: 4
        },
        9: {
            name: 'E',
            color: 'white',
            index: 5
        },
        10: {
            name: 'F',
            color: 'white',
            index: 6
        },
        11: {
            name: 'Fsharp',
            color: 'black',
            index: 6
        }
    }

    const number = parseInt(n, 10);

    const left = keyMap[number%12].color === 'white'
        ? ( keyMap[number%12].index + (Math.floor(number/12) * 7)) * 77 - (cursor * 593)
        : ( keyMap[number%12].index + (Math.floor(number/12) * 7)) * 77 + 57.5 - (cursor * 593);
    
    return (
        <div
            id={`key-${n}`}
            style={{left}}
            className={
                `key 
                ${keyMap[number%12].color} 
                ${keyMap[number%12].name} 
                ${number === 0 ? 'first-key' : number === 34 ? 'last-key': ''}
                ${pressed ? 'pressed' : ''}`
            }
            onMouseOut={handler}
        >
        </div>
    )
}

export default Key;