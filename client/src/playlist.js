import React, { Component } from "react";
import ReactPlayer from 'react-player';

const songs = ['https://www.youtube.com/embed/o2AGxxzZQwk',
	'https://www.youtube.com/watch?v=7wXD5ab2VVQ', 
	'https://www.youtube.com/watch?v=F4oHuML9U2A']

class PlayListElement extends Component {
	state = {index: 0};

	constructor(props) {
		super();
		this.state.index = props.index;
	}

	render() {
		let divStyle = {
			'padding': '5px 0 5px 5px',
		};

		return (
			<div style={divStyle}>
				<ReactPlayer url={songs[this.state.index]} controls width={320} height={180} />
			</div>
		);
	}
}

class PlayList extends Component {

	elements = [];

	constructor() {
		super();
		this.elements = songs.map((url, currentIndex) => <PlayListElement index={currentIndex} />);
	}

	render() {
		let playListStyle = {
			'border-left-style': 'solid',
			'border-color': 'grey',
		};

		let centerStyle = {
			'text-align': 'center',
		};

		return (
			<div style={playListStyle}>
				<p style={centerStyle}>playlist</p>
				{this.elements}
			</div>);
	}
}

export default PlayList;