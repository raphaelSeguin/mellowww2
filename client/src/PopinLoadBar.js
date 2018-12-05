import React from 'react';

export default ({progress}) => {
    console.log(progress);
    return (
        <div className={`popin-load-bar ${progress === 1 ? 'invisible' : ''}`}>
            <h1>LOADING...</h1>   
            <div className={`w-${Math.floor(parseInt(progress, 10)*10)*10}` }></div>
        </div>
    )
}