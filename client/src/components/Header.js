import React from 'react';
import styled from 'styled-components';

const Title = styled.h1`
    font-family: 'Monoton', cursive;
`
const SubText = styled.p`
    color: #444;
`
const Header = () => {
    return (
    <div>
        <Title>ETH Jukebox</Title>
        <p>Pay 1 eth to run the jukebox!</p>
    </div>

    )
}

export default Header;