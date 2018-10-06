import React, { Component } from 'react';
import axios from 'axios';
import { Row, Col, Image } from 'react-bootstrap';
import Loading from './Loading';
import Error from './Error';

const youTubeApiRequestString = (videoId) => `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=AIzaSyAEDEgyQ3YB5l3SiHnXgJvwJDvFuK6jAWY&part=snippet,contentDetails,status`

const axiosOptions = {
	headers: { 'Access-Control-Allow-Origin': '*' }
}

class UpNextQueueItem extends Component {
	state = { loading: true, videoDetails: null }

	componentDidMount() {
		const { videoId } = this.props;
		console.log('hits componentDidMount: ', videoId);
		console.log('xxx: ', youTubeApiRequestString(videoId));
		axios({ ...axiosOptions, url: youTubeApiRequestString(videoId), method: 'get' }, { crossDomain: true })
		.then((videoDetails) => {
			console.log('videoDetails: ', videoDetails.data.items);
			this.setState({ loading: false, videoDetails: videoDetails.data.items[0].snippet });
		})
		
		
		.catch((err) => {
			console.log('err: ', err);
			this.setState({ error: true, errorMessage: err });
		});
	}

	render() {
		const { videoDetails } = this.state;

		return (
			this.state.loading ? <Loading /> :
			this.state.error ? <Error message={this.state.errorMessage} /> :
			<Row>
				<Col xs={3}>
					<Image src={videoDetails.thumbnails.medium.url} responsive rounded />
				</Col>
				<Col xs={9}>
					{videoDetails.title}
				</Col>
			</Row>
		);
	}
}

export default UpNextQueueItem;