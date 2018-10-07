import React from 'react';
import styled from 'styled-components';

const Title = styled.h1`
    font-family: 'Monoton', cursive;

    @media only screen and (max-width: 600px) {
        text-align:center;
    }
`
const SubText = styled.p`
    color: #444;

    @media only screen and (max-width: 600px) {
        text-align:center;
    }
`
const Header = () => {
    return (
    <div>
        <Title>ETH Jukebox</Title>
        <SubText>Pay 1 milliether to run the jukebox!</SubText>
    </div>

    )
}

export default Header;