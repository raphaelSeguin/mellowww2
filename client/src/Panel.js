import React from 'react';
import RotPot from './RotPot';

const Panel = ({handler, state}) => 
    <div id="panel">
        <h1>Mellowsound<span className=""> by fingerlab</span></h1>
        
        <RotPot 
            id="volume" 
            paramHandler={val => handler('volume', val)}
            state={state}
        />
        <span className="label" id="label-volume">
            VOLUME
        </span>
        <RotPot 
            id="tone" 
            paramHandler={val => handler('tone', val)}
            state={state}
        />
        <span className="label" id="label-tone">
            TONE
        </span>

        <RotPot 
            id="pitch" 
            paramHandler={val => handler('pitch', val)}
            state={state}
        />
        <span className="label" id="label-pitch">
            PITCH
        </span>
    </div>

export default Panel;