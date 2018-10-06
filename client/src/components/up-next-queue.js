import React from 'react';
import { Row } from 'react-bootstrap';

import UpNextQueueItem from './up-next-queue-item';

const UpNextQueue = ({ videoIds }) => {
	return (
		<Row>
			Up Next
			{videoIds.map((videoId, index) => {
				return <UpNextQueueItem key={index} videoId={videoId} />
			})}
		</Row>
	);

}

export default UpNextQueue;