import React, {useState, useEffect} from "react";
import styled from "styled-components";


const StyledContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: futura; 
    font-weight: normal;
    color: #F5EDD3;
    

`;
const StyledNav = styled.div`
    background-color: #271D7C;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
     width: 100%;
    height: 80px;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
`;

const StyledLeftNav = styled.h3`
    font-weight: normal;
    font-size: 40px;
    margin-left: 15px;
`;

const StyledRightNav = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    color: #271D7C; 
    width: 25%;
    margin-right: 5px;
`;

const StyledButton = styled.div`
    margin: 10px;
    display:flex;
    justify-content: center; 
    background-color: #F5EDD3;
    width: 80px;
    min-width: 80px;
    padding: 10px;
    color: #20166E;
    font-size: 20px;
    border-radius: 15px;
    border: none;
`;

const StyledSignUp = styled(StyledButton)`
    background-color: #FFD343; 
`;

const StyledMe = styled.span`
    color: #FFD343;
`;

const StyledMain = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    padding-top: 20vh;
    align-items: center;
    width: 100%;
`;

const StyledH1 = styled.h1`
    font-weight: normal;
    font-size: 70px;
    top: 10px;
`;

const StyledH2 = styled.h2`
    font-weight: normal;
    font-size: 35px;
`;

const StyledP = styled.p`
    font-weight: normal;
    font-size: 18px;
    width: 60%;
    text-align: center;
    margin-bottom: 10px;
`;

const StyledH4 = styled.h4`
    font-weight: normal;
    font-size: 25px;
    color: #FFD343;
`;



const HomePage = (props) => {

    return(
        <StyledContainer>
            <StyledNav>
                <StyledLeftNav> IMD<StyledMe>me</StyledMe> </StyledLeftNav>
                <StyledRightNav>
                    <StyledButton> Login </StyledButton>
                    <StyledSignUp> Sign Up </StyledSignUp>
                </StyledRightNav>
                
            </StyledNav>
            <StyledMain>
                <StyledH1> IMD<StyledMe>me</StyledMe> </StyledH1>
                <StyledH2> create, share, explore </StyledH2>
                <StyledP> Keep track of the movies you want to see, make a watchlist for movie night,
                    or check out what your friends are watching</StyledP>
                <StyledH4> Make an account to get started</StyledH4>   
            </StyledMain>


        </StyledContainer>
    );
};

export default HomePage;