import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Plyr from 'plyr';

class Player extends Component {
    componentDidMount() {
        if (!this.player) {
            this.player = new Plyr('.player', this.options ?? {});
        }
    }

    shouldComponentUpdate(nextProps) {
        return JSON.stringify(this.props.source) !== JSON.stringify(nextProps.source);
    }

    componentDidUpdate() {
        if (this.player) {
            this.player.source = this.props.source;
        }
    }

    componentWillUnmount() {
        return this.player?.destroy();
    }

    render() {
        return (
            <video
                className="player"
            />
        )
    }
}

Player.displayName = 'Player';

Player.defaultProps = {
    options: {
        controls: [
            'rewind',
            'play',
            'fast-forward',
            'progress',
            'current-time',
            'duration',
            'mute',
            'volume',
            'settings',
            'fullscreen',
        ],
        i18n: {
            restart: 'Restart',
            rewind: 'Rewind {seektime}s',
            play: 'Play',
            pause: 'Pause',
            fastForward: 'Forward {seektime}s',
            seek: 'Seek',
            seekLabel: '{currentTime} of {duration}',
            played: 'Played',
            buffered: 'Buffered',
            currentTime: 'Current time',
            duration: 'Duration',
            volume: 'Volume',
            mute: 'Mute',
            unmute: 'Unmute',
            enableCaptions: 'Enable captions',
            disableCaptions: 'Disable captions',
            download: 'Download',
            enterFullscreen: 'Enter fullscreen',
            exitFullscreen: 'Exit fullscreen',
            frameTitle: 'Player for {title}',
            captions: 'Captions',
            settings: 'Settings',
            menuBack: 'Go back to previous menu',
            speed: 'Speed',
            normal: 'Normal',
            quality: 'Quality',
            loop: 'Loop',
        },
    },
    source: {
        type: 'video',
        sources: [],
    },
}

Player.propTypes = {
    options: PropTypes.object,
    source: PropTypes.any,
}

export default Player;