import React, {useState, useEffect} from "react";
import { Formik, Form, Field, ErrorMessage } from 'formik';
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

const StyledLoginButton = styled.button`
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
    flex-direction: row;
    justify-content: space-evenly;
    padding-top: 20vh;
    align-items: center;
    width: 100%;
`;




const Signup = (props) => {

    return(
        <StyledContainer>
            <StyledNav>
                <StyledLeftNav> IMD<StyledMe>me</StyledMe> </StyledLeftNav>
                <StyledRightNav>
                    
                    
                </StyledRightNav>
                
            </StyledNav>
            <StyledMain>
                <div className = "Welcometext">
                    <h1> Welcome! </h1>
                    <h2> Create an account to start making, sharing, and exploring watchlists</h2>
                    <h3> Already have an account? </h3>
                    <StyledSignUp> Login </StyledSignUp>
                </div>
                <div className = "Loghub">
                    <h1> Sign Up </h1>
                    <Formik
                        //just checking that the email is there and valid
                        initialValues={{ email: '', password: '' }}
                            validate={values => {
                             const errors = {};
                                 if (!values.email) {
                                    errors.email = 'Required';
                                } else if (
                                    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                                 ) {
                                    errors.email = 'Invalid email address';
                                   }
                                 return errors;
                             }}

                        //Need to replace this with stuff retrieved by backend!     
                        onSubmit={(values, { setSubmitting }) => {
                        setTimeout(() => {
                         alert(JSON.stringify(values, null, 2));
                        setSubmitting(false);
                        }, 400);
                    }}
                     >
                    {({ isSubmitting }) => (
                        <Form>
                            <ErrorMessage name="email" component="div" />
                             <Field type="email" name="email"  placeholder = "Email"/>
                             <ErrorMessage name="password" component="div" />
                             <Field type="password" name="password" placeholder = "Password" />
                             <StyledLoginButton type="submit" disabled={isSubmitting}>
                                 Sign Up
                             </StyledLoginButton>
                         </Form>
                     )}
                    </Formik>  
                </div>   
            </StyledMain>
        </StyledContainer>
    );
};

export default Signup;