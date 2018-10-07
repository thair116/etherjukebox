import React from 'react';
import { Row } from 'react-bootstrap';
import styled from 'styled-components';

import UpNextQueueItem from './up-next-queue-item';

const Title = styled.h3`
    color:#444;
    font-weight:500;    
    border-bottom: 2px solid #e7e7e7;
    width:100%;
    padding:0 0 10px;
    margin:0;

    @media only screen and (max-width: 600px) {
        padding: 10px 10px 10px;
    }
`
const Container = styled(Row)`
    
`
const UpNextQueue = ({ videoIds }) => {
	return (
		<Container>
			<Title>Up next</Title>
			{videoIds.map((videoId, index) => {
				return <UpNextQueueItem key={index} videoId={videoId} />
			})}
		</Container>
	);

}

export default UpNextQueue;