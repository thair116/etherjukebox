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
const CrossOut = styled.span`
    text-decoration:line-through;
`
const Header = () => {
    return (
    <div>
        <Title>ETH Jukebox</Title>
        <SubText>Run the Jukebox for the price of a cup of coffee!</SubText>
    </div>

    )
}

export default Header;