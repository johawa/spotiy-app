import React, { Component } from 'react';
import { connect } from 'react-redux';
import { PlayButton, PauseButton } from 'react-player-controls'


import { player } from '../../../App';


// eslint-disable-next-line import/no-webpack-loader-syntax
import '!style-loader!css-loader!./Playbutton.css';





class Playbutton extends Component {


    togglePlay = () => {

        if (this.props.playing && this.props.playing_data !== false) {
            player.pause().then(() => {
                console.log('Paused!');
            });
        }



        else if (this.props.playing === false && this.props.playing_data !== true) {
            player.resume().then(() => {
                console.log('Resumed!');
            });
        }

        else {
            console.log('currently not playing')
        }

    }

    render() {

        let label = "Playbutton"

        if (this.props.playing && this.props.playing_data !== false) {
            label = "PAUSE"
        }

        return (

           
                <PlayButton
                    class={label}
                    onClick={this.togglePlay}
                    isEnabled={this.props.playing || this.props.playing_data}
                >

                    {this.props.playing ?
                        (<svg class="Icon PauseIcon" viewBox="0 0 100 100">
                            <g class="Icon-group">
                                <rect class="IconShape" x="58" y="11" width="21" height="78"></rect>
                                <rect class="IconShape" x="22" y="11" width="21" height="78"></rect>
                            </g>
                        </svg>)
                        :
                        (<svg className="Icon" viewBox="0 0 100 100"><polygon class="Shape" points="24 92 24 7 100 49.4955227"></polygon>
                            <polygon className="IconShape" points="24 92 24 7 100 49.4955227"></polygon>
                        </svg>)}

                </PlayButton>
           

        );
    }
};

const mapStateToProps = state => {
    return {
        playing: state.playing,
        playing_data: state.current_playback_data,
    };
}


export default connect(mapStateToProps)(Playbutton);