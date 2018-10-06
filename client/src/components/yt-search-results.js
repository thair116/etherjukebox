import React from 'react';
import { Row, Col, Image, Button } from 'react-bootstrap';
import YouTube from 'simple-youtube-api';
const youtube = new YouTube('AIzaSyAEDEgyQ3YB5l3SiHnXgJvwJDvFuK6jAWY');

const ytSearchResults = ({ results, contract, accounts }) => {
    return (
        <Row>
            <Col xs={12}>
                {results.map((result, index) => {
                    return (
                        <Row key={result.id}>
                            <Col xs={12} md={3}>
                                <Image src={result.thumbnails.medium.url} rounded responsive />
                            </Col>
                            <Col xs={12} md={7}>
                                <h1>{result.title}</h1>
                                <span>{result.description}</span>
                            </Col>
                            <Col xs={12} md={2}>
                                <Button bsStyle="primary" onClick={async () => {
                                    const videoInfo = await youtube.getVideoByID(result.id);
                                    const duration = videoInfo.durationSeconds;

                                    console.log(`adding ${result.id} to queue with ${duration} duration`);
                                    contract.addToQueue(result.id, duration, { from: accounts[0] })
                                    }
                                }>Request</Button>
                            </Col>
                        </Row>
                    );
                })}
            </Col>
        </Row>
    )
};

export default ytSearchResults;
