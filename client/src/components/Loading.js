import React from 'react';
import { Col } from 'react-bootstrap';

const Loading = () => {
    return (
        <Col xs={12} style={{ textAlign: 'center' }}>
            <div className="lds-grid"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
        </Col>
    )
}

export default Loading;