import React, { Component } from 'react';
import './App.css';

import Controls from './Controls.js';
import Keyboard from './Keyboard.js';
import PopinLoadBar from './PopinLoadBar.js';

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
        array.slice(i+1).includes(item) ? result : result.concat(item), [])

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
            keyDown: false,
            selectParam: '',
            selectValue: 0,
            selectOrigin: [null, null],
            loadingProgression: 0
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
        //console.log('key : ', keyNumber, '|| type : ', type);
        const pushKey = key =>
            this.setState( 
                prevState => ({
                    keysPressed: prevState.keysPressed.concat(key)
                })
            )
        const releaseKey = key =>
            this.setState(
                prevState => ({
                    keysPressed: prevState.keysPressed.filter( n => n !== key)
                })
            )

        if (type === 'mousedown' || type === 'touchstart') {
            this.setState({ lastKeyPressed: keyNumber });
            pushKey(keyNumber);
        }
        else if (type === 'mouseleave' || type === 'mouseout' || type === 'mouseup' || type === 'touchend') {
            releaseKey(this.state.lastKeyPressed);
        }
        if ( type === 'mousedown') {
            this.setState({ keyDown: true});
        } else if ( type === 'mouseup') {
            this.setState({ keyDown: false});
        }
        if (type === 'mouseover' && this.state.keyDown) {
            pushKey(keyNumber);
            this.setState({ lastKeyPressed: keyNumber})
        }
    }
    clickHandler(e) {
        e.preventDefault();
        const target = e.target.id;
        const type = e.type;
        if (target.slice(0, 3) === 'key') {
            this.handleKeyboard(parseInt(target.slice(4), 10), type);
        }
        switch (type) {
            case 'mousedown':
            //case 'touchstart':
                this.setState({
                    selectParam: target,
                    selectOrigin: [e.clientX, e.clientY],
                    selectValue: this.state[target]
                });
                break;
            case 'mouseup':
            //case 'touchend':
                this.setState({
                    selectParam: null
                });
                break;
            case 'mousemove':
            //case 'touchmove':
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
    scrollHandler(e) {
        e.preventDefault();
    }

    // lifecycle
    componentDidMount() {
        audio.subscribeLoadingProgression( val => this.setState({ loadingProgression: val }) );
        audio.loadSamples();
        this.componentDidUpdate(null, this.state);
    }
    componentDidUpdate(prevProps, prevState) {
        // update audio parameters volume, tone, filter, etc.
        audio.setPitch(prevState.pitch);
        audio.setInstrument(prevState.instrument);
        audio.setVolume(prevState.volume);
        audio.setTone(prevState.tone);

        // comparer this.state.keysPressed et prevState.keysPressed
        // 
        const newKeysPressed = this.state.keysPressed.reduce( (result, key) => prevState.keysPressed.includes(key) ? result : [...result, key], []);
        
        newKeysPressed.forEach( audio.noteOn );

        const newKeysReleased = prevState.keysPressed.reduce( (result, key) => this.state.keysPressed.includes(key) ? result : [...result, key], []);

        newKeysReleased.forEach( audio.noteOff );
    }
    render() {
        return (
            <div
                className="App"
                onMouseDown={this.clickHandler}
                onMouseMove={this.clickHandler}
                onMouseUp={this.clickHandler} 
                onMouseLeave={this.clickHandler} 
                onMouseOver={this.clickHandler} 

                //onClick={this.clickHandler} 
                //onDoubleClick={this.clickHandler} 
                onMouseOut={this.clickHandler} 

                onTouchCancel={this.clickHandler} 
                onTouchEnd={this.clickHandler} 
                onTouchMove={this.clickHandler} 
                onTouchStart={this.clickHandler} 

                onScroll={this.scrollHandler} >
                <PopinLoadBar progress={this.state.loadingProgression} />
                <div className="shade"></div>
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
