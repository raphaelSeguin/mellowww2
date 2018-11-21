import React, { Component } from 'react';
import './App.css';

import Controls from './Controls.js';
import Keyboard from './Keyboard.js';

import audio from './audio.js';

import {btnMaxDist, sliderWidth} from './constants.js'

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bank: '',
            instrument: 'flute',
            volume: 0.8,
            tone: 0.5,
            pitch: 0.5,
            cursor: 0.1,
            keysPressed: [],
            lastKeyPressed: null,
            selectParam: '',
            selectValue: 0,
            selectOrigin: [null, null]
        }
        // methods binding
        this.changeParam = this.changeParam.bind(this);
        this.clickHandler = this.clickHandler.bind(this);
    }
    // methods
    changeParam(param, val) {
        this.setState({
            [param]: val
        })
    }
    handleKeyboard(keyNumber, type) {
        const releaseKey = key => {
            this.setState({
                keysPressed: this.state.keysPressed.filter( n => n !== key)
            })
        }
        if (type === 'mousedown') {
            this.setState({
                keysPressed: this.state.keysPressed.concat(keyNumber),
                lastKeyPressed: keyNumber
            })
            //
            // JUSTE POUR VOIR  => => => utiliser this.state pour déclencher les notes 
            // à partir de componentDidUpdate (... ou pas si c'est trop lent...)
            console.log('noteOn');
            audio.noteOn(keyNumber);
            //
            //
        }
        else if (type === 'mouseleave' || type === 'mouseout' || type === 'mouseup') {
            releaseKey(this.state.lastKeyPressed);
            //
            //
            console.log('noteOff');
            audio.noteOff(keyNumber);
            //
            //
        }
    }
    clickHandler(e) {
        //e.persist();
        const target = e.target.id;
        const type = e.type;
        if (target.slice(0, 3) === 'key') {
            this.handleKeyboard(parseInt(target.slice(4), 10), type);
        }
        switch (type) {
            case 'mousedown':
                this.setState({
                    selectParam: target,
                    selectOrigin: [e.clientX, e.clientY],
                    selectValue: this.state[target]
                });
                break;
            case 'mouseup':
                this.setState({
                    selectParam: null
                });
                break;
            case 'mousemove':
                if ( this.state.selectParam ) {
                    if( ['volume', 'tone', 'pitch'].includes(this.state.selectParam) ) {
                        const dist = this.state.selectOrigin[1] - e.clientY;
                        let newValue = this.state.selectValue + dist/btnMaxDist;
                        newValue = Math.max(0, newValue);
                        newValue = Math.min(1, newValue);
                        this.setState({
                            [this.state.selectParam]: newValue
                        })
                    } else if ( ['cursor'].includes(this.state.selectParam) ) {
                        const dist = e.clientX - this.state.selectOrigin[0];
                        let newValue = this.state.selectValue + dist/sliderWidth;
                        newValue = Math.max(0, newValue);
                        newValue = Math.min(1, newValue);
                        this.setState({
                            [this.state.selectParam]: newValue
                        })
                    }
                }
                break;
            case 'mouseleave':
                this.setState({
                    selectParam: null
                })
                break;
            default:
                break;
        }
    }
    // lifecycle
    componentDidMount() {
        audio.loadSamples();
        this.componentDidUpdate(null, this.state);
    }
    componentDidUpdate(prevProps, prevState) {
        // update audio parameters volume, tone, filter, etc.
        audio.setPitch(prevState.pitch);
        audio.setInstrument(prevState.instrument);
        audio.setVolume(prevState.volume);
        audio.setTone(prevState.tone);
    }
    render() {
        return (
            <div
                className="App"
                onMouseDown={this.clickHandler}
                onMouseMove={this.clickHandler}
                onMouseUp={this.clickHandler} 
                onMouseLeave={this.clickHandler}>
                <Controls
                    handler={this.changeParam}
                    state={this.state} />
                <Keyboard
                    state={this.state} 
                    onMouseDown={this.clickHandler}
                    onMouseMove={this.clickHandler}
                    onMouseUp={this.clickHandler}
                    onMouseLeave={this.clickHandler}
                    handler={this.clickHandler}/>
            </div>
        );
    }
}

export default App;
