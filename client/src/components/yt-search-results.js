import React from 'react';
import { Row, Col, Image, Button } from 'react-bootstrap';

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
                                <Button bsStyle="primary" onClick={() => contract.addToQueue(result.id, 60, { from: accounts[0] })}>Request</Button>
                            </Col>
                        </Row>
                    );
                })}
            </Col>
        </Row>
    )
};

export default ytSearchResults;
