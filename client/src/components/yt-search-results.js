import React from 'react';
import { Row, Col, Image, Button } from 'react-bootstrap';
import YouTube from 'simple-youtube-api';
import styled from 'styled-components';
const youtube = new YouTube('AIzaSyAEDEgyQ3YB5l3SiHnXgJvwJDvFuK6jAWY');

const Result = styled(Row)`
    margin:20px;
    display:flex;
    justify-content:center;

    @media only screen and (max-width: 600px) {
        border-bottom: 2px solid #e7e7e7;
        padding-bottom:10px;
    }
`
const RequestButton = styled(Button)`
    background-color: #fc0d1b !important;
    border:none;
    border-radius:3px;
    height:50px;
    width:150px;
    font-size:1.3em;

    @media only screen and (max-width: 600px) {
        margin: 10px auto;
        width:50%;
        border-radius: 50px;
        height:45px;
    }
`
const Title = styled.h3`
    margin:0 0 5px;
    font-size:1.5em;
`
const RequestContainer = styled(Col)`
    display:flex;
    align-items:center;
`
const Details = styled(Col)`
    margin:0 20px;

    span {
        color:#555;
    }
    @media only screen and (max-width: 600px) {
        margin:0;
    }
`
const Thumbnail = styled(Image)`
    @media only screen and (max-width: 600px) {
        height:100px;
    }
`
const ytSearchResults = ({ results, contract, accounts }) => {
    return (
        <Row>
            <Col xs={12} lg={9}>
                {results.map((result, index) => {
                    return (
                        <Result key={result.id}>
                            <Col xs={6} md={3}>
                                <Thumbnail src={result.thumbnails.medium.url} responsive />
                            </Col>
                            <Details xs={6} md={3}>
                                <Title>{result.title}</Title>
                                <span>{result.channelTitle}</span>
                            </Details>
                            <RequestContainer xs={12} md={2}>
                                <RequestButton bsStyle="primary" onClick={async () => {
                                    const videoInfo = await youtube.getVideoByID(result.id);
                                    const duration = videoInfo.durationSeconds;

                                    console.log(`adding ${result.id} to queue with ${duration} duration`);
                                    contract.addToQueue.sendTransaction(result.id, duration, { from: accounts[0], value: 20000000000000000})
                                    }
                                }>Play next &rarr;</RequestButton>
                            </RequestContainer>
                        </Result>
                    );
                })}
            </Col>
        </Row>
    )
};

export default ytSearchResults;
