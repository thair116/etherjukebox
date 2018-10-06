import React, { Component } from 'react';
import axios from 'axios';
import { Row, Col, Image } from 'react-bootstrap';
import Loading from './Loading';
import Error from './Error';

const youTubeApiRequestString = (videoId) => `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=AIzaSyAEDEgyQ3YB5l3SiHnXgJvwJDvFuK6jAWY&part=snippet,contentDetails,status`

class UpNextQueueItem extends Component {
	state = { loading: true, videoDetails: null }

	componentDidMount() {
		const { videoId } = this.props;
		axios.get(youTubeApiRequestString(videoId), { crossDomain: true }, (err, videoDetails) => {
			console.log('err: ', err);
			console.log('videoDetails: ', videoDetails);
			if(err) {
				this.setState({ error: true, errorMessage: err });
				return;
			 }
			this.setState({ loading: false, videoDetails: videoDetails });
		});
	}

	render() {
		const { videoDetails } = this.state;

		return (
			this.state.loading ? <Loading /> :
			this.state.error ? <Error message={this.state.errorMessage} /> :
			<Row>
				<Col xs={3}>
					<Image src={videoDetails.thumbnails.medium.url} />
				</Col>
				<Col xs={9}>
					{videoDetails.title}
				</Col>
			</Row>
		);
	}
}

export default UpNextQueueItem;