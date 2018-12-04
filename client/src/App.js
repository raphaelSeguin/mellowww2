import React, { Component } from 'react';
import './App.css';

import Controls from './Controls.js';
import Keyboard from './Keyboard.js';

import audioFactory from './audio.js';
import {btnMaxDist, sliderWidth} from './constants.js';

const audio = audioFactory();

// helpers
// diff between old and new array
const addedItems = (oldArray, newArray) => 
    newArray.reduce( (result, item, i) => 
            oldArray.includes(item) ? result : result.concat(item), []);

const removedItems = (oldArray, newArray) => addedItems(newArray, oldArray);

const removeDoubles = array => 
    array.reduce( (result, item, i, array) => 
        array.slice(i+1).includes(item) ? result : result.concat(item), []
    )

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bank: '',
            instrument: 'Flute', // attention si aucun instrument n'est selectionné au départ, ça crashe !
            volume: 0.8,
            tone: 0.5,
            pitch: 0.5,
            cursor: 0.1,
            prevKeysPressed: [],
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
        console.log('key : ', keyNumber, '|| type : ', type);
        const pushKey = key =>
            this.setState( 
                state => ({
                    keysPressed: state.keysPressed.concat(key)
                })
            )
        const releaseKey = key =>
            this.setState(
                state => ({
                    keysPressed: state.keysPressed.filter( n => n !== key)
                })
            )
        // switch à la place ? 
        if (type === 'mousedown' || type === 'touchstart') {
            this.setState(
                state => ({
                    keysPressed: state.keysPressed.concat(keyNumber),
                    lastKeyPressed: keyNumber
                })
            )
            //
            // JUSTE POUR VOIR  => => => utiliser this.state pour déclencher les notes 
            // à partir de componentDidUpdate (... ou pas si c'est trop lent...)
            //console.log('noteOn');
            audio.noteOn(keyNumber);
            //
            //
        }
        else if (type === 'mouseleave' || type === 'mouseout' || type === 'mouseup' || type === 'touchend') {
            releaseKey(this.state.lastKeyPressed);
            //
            //
            //console.log('noteOff');
            audio.noteOff(keyNumber);
            //
            //
        }
    }
    clickHandler(e) {
        //e.persist();
        e.preventDefault();
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
                onMouseLeave={this.clickHandler} 
                onTouchCancel={this.clickHandler} 
                onTouchEnd={this.clickHandler} 
                onTouchMove={this.clickHandler} 
                onTouchStart={this.clickHandler} >
                <Controls
                    handler={this.changeParam}
                    state={this.state} />
                <Keyboard
                    state={this.state}
                    handler={this.clickHandler}/>
            </div>
        );
    }
}

export default App;
