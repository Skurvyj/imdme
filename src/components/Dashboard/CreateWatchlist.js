import React, {useState} from "react";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import styled from "styled-components";
import axios from "axios";


const StyledWrapper = styled.div`
    background: #9B90FC;
    display: flex;
    flex-direction: column;
    padding: 30px;
    width: 300px;
    justify-content: space-around;
    align-items: center;
    border-radius: 50px;


`;
const StyledSubmit = styled.button`
    margin: 10px;
    display:flex;
    justify-content: center; 
    background-color: #FFD343;
    width: 80px;
    min-width: 80px;
    padding: 12px;
    color: #20166E;
    font-size: 20px;
    border-radius: 15px;
    border: none;
    margin-top: 20px;
    &:hover{
        opacity: 0.8;
    } 
    &:active{
        transform: scale(1.02);
        ou
    }
    &:focus{
        outline: none;
    }
`;

const StyledForm = styled(Form)`
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
`;

const StyledField = styled(Field)`
    padding: 20px;
    margin-top: 2px;
    max-width: 100%;
    background: #F5EDD3;
    color: ##20166E;
    border-style: none;
    border-radius: 20px;
    &::placeholder {
       color: ##20166E;
    }
    &:focus{
        outline: none;
    }
    
`;

const StyledCreateText = styled.h2`
    font-weight: normal;
    color: #271D7C;

`;

const StyledSubtitle = styled.h3`
    font-weight: normal;
    color: #271D7C;
`;

const CreateWatchlist = (props) => {

    const [showWL, setShowWL] = useState(false);

    const handleCreate = () => {
        setShowWL(false)
        props.handleDontShowWL(showWL);
    }

    const updateWL =(newWL) => {
        props.updateWatchlists(newWL)
    }
    return(   
    <StyledWrapper> 
        <StyledCreateText> Create Watchlist</StyledCreateText> 
        <StyledSubtitle> Title</StyledSubtitle> 
        <Formik
        //making sure the title exists and isn't gonna break the site
            initialValues={{ title: ''}}
                validate={values => {
                    const errors = {};
                        if (!values.title) {
                        errors.title = 'Required';
                    } else if (
                        !/\w+[a-zA-Z0-9 ]{1,20}/i.test(values.title)
                        ) {
                        errors.title = 'Invalid title';
                        }
                        return errors;
                    }}

        //Need to replace this with stuff retrieved by backend! 
            onSubmit={(values, { setSubmitting }) => {
                setTimeout(() => {
                    axios.post('/dashboard/createwatchlist', {
                        title: values.title, 
                      })
                      .then(function(response){  
                        updateWL(response.data)
                      });
                    setSubmitting(false);
                    handleCreate();
                }, 400);   
                }}    
        >
        {({ isSubmitting }) => (
            <StyledForm>
                <ErrorMessage name="title" component="div"/>
                    <StyledField type="title" name="title"  placeholder = "title"/>
                    <StyledSubmit type="submit" disabled={isSubmitting} >
                        Create
                    </StyledSubmit>
                </StyledForm>
     )}
      </Formik> 
    </StyledWrapper>
    );
};

export default CreateWatchlist;