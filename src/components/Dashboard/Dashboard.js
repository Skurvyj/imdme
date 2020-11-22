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

const StyledLeftNavText = styled.h3`
    font-weight: normal;
    font-size: 40px;
    margin-left: 15px;
`;

const StyledRightNavText = styled.h3`
    font-weight: normal;
    font-size: 30px;
    margin-right: 15px;
    color: #FFD343;
`;

const StyledMe = styled.span`
    color: #FFD343;
`;

const StyledMain = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    padding-top: 20vh;
    align-items: center;
    width: 100%;
`;

const Dashboard = (props) => {
    return(
        <StyledContainer>
            <StyledNav>
                <StyledLeftNavText> IMD<StyledMe>me</StyledMe> </StyledLeftNavText>
                <StyledRightNavText> Your Dashboard </StyledRightNavText>
                  
            </StyledNav>
            <StyledMain>
                <div className = "listNav">
                    <h2> Watchlists</h2>
                </div>
                <div className = "movieNav">
                    <h2> placeholder </h2>

                </div>
                 
            </StyledMain>


        </StyledContainer>
    );
};

export default Dashboard;