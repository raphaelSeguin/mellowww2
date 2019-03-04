import React from 'react';

export default ({progress}) => {
    const progressPercentage = progress * 100;
    return (
        <div className={`popin-load-bar ${progress === 1 ? 'invisible' : ''}`}>
            <h1>LOADING...</h1>
            <div style={{width: `${progressPercentage}%` }}></div>
        </div>
    )
}