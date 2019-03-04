import React from 'react';

const Key = ({n, cursor, handler, pressed}) => {
    const keyMap = {
        0: {
            name: 'G',
            color: 'white',
            index: 0,
        },
        1: {
            name: 'Gsharp',
            color: 'black',
            index: 0,
        },
        2: {
            name: 'A',
            color: 'white',
            index: 1,
        },
        3: {
            name: 'Asharp',
            color: 'black',
            index: 1,
        },
        4: {
            name: 'B',
            color: 'white',
            index: 2,
        },
        5: {
            name: 'C',
            color: 'white',
            index: 3,
        },
        6: {
            name: 'Csharp',
            color: 'black',
            index: 3,
        },
        7: {
            name: 'D',
            color: 'white',
            index: 4,
        },
        8: {
            name: 'Dsharp',
            color: 'black',
            index: 4,
        },
        9: {
            name: 'E',
            color: 'white',
            index: 5,
        },
        10: {
            name: 'F',
            color: 'white',
            index: 6,
        },
        11: {
            name: 'Fsharp',
            color: 'black',
            index: 6,
        }
    }

    const number = parseInt(n, 10);

    let keysWidth = [
        0,
        77,
        40,
        78,
        38,
        76,
        77,
        40,
        78,
        38,
        77,
        78,
        40,
        78,
        39,
        80,
        39,
        77,
        78,
        41,
        77,
        39,
        78,
        78,
        40,
        78,
        39,
        79,
        39,
        77,
        77,
        41,
        78,
        38,
        77,
        78
    ]

    const keysLeft = [
        0, 57, 77, 136, 155,
        230, 288, 307, 366, 384, 460, 518, 
        537, 596, 614, 675, 693,
        770, 828, 848, 906, 924, 1001, 1058,
        1077, 1135, 1155, 1215, 1233,
        1310, 1367, 1386, 1445, 1463, 1539, 1628
    ]


    const left = keysLeft[number] - (cursor * 593);
    
    
    // keyMap[number%12].color === 'white'
    //     ? ( keyMap[number%12].index + whiteKeysWidth[number] - (cursor * 593) )
    //     : ( keyMap[number%12].index + (Math.floor(number/12) * 7)) * 77 + 57.5 - (cursor * 593);

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