import React from "react";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import styled from "styled-components";
import axios from "axios";


//styled components for signup
const StyledContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: brigade; 
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

const StyledSignUpButton = styled.button`
    font-family: brigade; 
    margin: 10px;
    display:flex;
    justify-content: center; 
    width: 100px;
    min-width: 80px;
    padding: 10px;
    color: #20166E;
    font-size: 20px;
    border-radius: 15px;
    border: none;
    margin-top: 20px;

    background-color: #FFD343; 
    &:hover{
        opacity: 0.8;
    } 
    &:active{
        transform: scale(1.02);
    }
    &:focus{
        outline: none;
    }
`;

const StyledLogIn = styled(StyledButton)`
    background-color: #FFD343; 
    &:hover{
        opacity: 0.8;
    } 
    &:active{
        transform: scale(1.02);
    }
`;

const StyledMe = styled.span`
    color: #FFD343;
`;

const StyledMain = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding-top: 20vh;
    align-items: center;
    width: 100%;
`;

const StyledWelcomeTextBox = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    max-width: 40%;
    width: 40%;
    height: 65vh;
    margin-left: 40px;
`;

const StyledLoghub = styled.div`
    background: #271D7C;
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 40%;
    width: 30%;
    height: 65vh;
    margin-right: 60px;
    border-radius: 50px;
    padding-top: 10px;
    overflow: scroll;
`;


const StyledForm = styled(Form)`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const StyledField = styled(Field)`
    padding: 20px;
    max-width: 100%;
    margin-top: 10px;
    margin-bottom: 10px;
    background: #9B90FC;
    color: #F5EDD3;
    border-style: none;
    border-radius: 20px;
    &::placeholder {
       color: #F5EDD3;
    }
    &:focus{
        outline: none;
    }
    
`;

const StyledSignUpText = styled.h1`
    font-weight: normal;
    font-size: 50px;

`;

const StyledWelcomeText = styled.h1`
    font-weight: normal;
    color: #FFD343;
    font-size: 40px;

`;

const StyledSubtitle = styled.h2`
    font-weight: normal;
    font-size: 30px;
`;

const StyledSubsubtitle = styled.h3`
    font-weight: normal;
    font-size: 20px;
`;



const Signup = (props) => {

    //sends user to login page
    const goToLogin = () => {
        window.location.assign('/login');
    }

    //sends user to home page
    const goHome = () => {
        window.location.assign('/');
    }

    //sends user to dashboard
    const goToDashboard = () => {
        window.location.assign('/dashboard');
    }

    return(
        <StyledContainer>
            <StyledNav>
                <StyledLeftNav onClick = {goHome}> IMD<StyledMe>me</StyledMe> </StyledLeftNav>
                <StyledRightNav>    
                </StyledRightNav>
                
            </StyledNav>
            <StyledMain>
                <StyledWelcomeTextBox>
                    <StyledWelcomeText> Welcome! </StyledWelcomeText>
                    <StyledSubtitle> Create an account to start making, sharing, and exploring watchlists</StyledSubtitle>
                    <StyledSubsubtitle> Already have an account? </StyledSubsubtitle>
                    <StyledLogIn onClick = {goToLogin}> Login </StyledLogIn>
                </StyledWelcomeTextBox>
                <StyledLoghub>
                    <StyledSignUpText> Sign Up </StyledSignUpText>
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

                        /* posts the user data to the server
                            and redirects the user to their 
                            new dashboard if their signup
                            is successful */     
                        onSubmit={(values, { setSubmitting }) => {
                        setTimeout(() => {
                        axios.post('/signup', {
                            email: values.email,
                            password: values.password  
                          })
                          .then(function(response){
                              //if the signup was successful
                              if(response.data.userstatus){
                                  goToDashboard();
                             //if the signup was not successful
                              } else {
                                  alert("There's already a user with that email! Please go to login if you already have an account.");
                                  window.location.reload();
                              }
                            
                          });
                          setSubmitting(false);
                        }, 400);
                    }}
                     >
                    {({ isSubmitting }) => (
                        <StyledForm>
                            <ErrorMessage name="email" component="div" />
                             <StyledField type="email" name="email"  placeholder = "Email"/>
                             <ErrorMessage name="password" component="div" />
                             <StyledField type="password" name="password" placeholder = "Password" />
                             <StyledSignUpButton type="submit" disabled={isSubmitting}>
                                 Sign Up
                             </StyledSignUpButton>
                         </StyledForm>
                     )}
                    </Formik>  
                </StyledLoghub>   
            </StyledMain>
        </StyledContainer>
    );
};

export default Signup;
