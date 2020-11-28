import React, {useState, useEffect} from "react";
import styled from "styled-components";
import CreateWatchlist from"./CreateWatchlist";
import AddMovie from"./AddMovie";
import axios from "axios";


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
    justify-content: space-between;
    margin-top: 100px;
    margin-left: 10px;
    margin-right: 10px;
    align-items: top;
    width: 90vw;
    height: 80vh;
`;

const StyledWatchlist = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    background-color: #271D7C;
    border-radius: 50px;
    min-width: 200px;
    width: 20%;
    align-items: center;
    margin-right: 10px;

`;

const StyledMovieDisplay = styled.div`
    display: flex;
    flex-direction: column;
    background-color: #271D7C;
    min-width: 500px;
    width: 75%;
    border-radius: 50px;
    align-items: center;
    margin-left: 10px;
`;

const StyledH2 = styled.h2`
    font-weight: normal;
    letter-spacing: 1px;
    color: #FFD343;
`;

const StyledMovieBoxTitle = styled(StyledH2)`
    padding: 10px;
`

const StyledListBox = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    align-self: center;
    max-width: 80%;
    width: 80%;
    height: 70%; 
    letter-spacing: 1px;
    overflow: scroll;
    margin-bottom: 10px;
    text-align: center;
    overflow-wrap: normal;
`;



const StyledAddButton = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: #FFD343;
    width: 60px;
    height: 40px;
    margin-top: 15px;
    border-radius: 50px;
    color: #271D7C;
    font-size: 20px;
`;

const StyledPopUp = styled.div`
    position: absolute;
    top: 30%;
    left: 30%;
    z-index: 1000;

`;

const StyledWatchListItem = styled.p`
    &:active{
        color: #FFD343;
    }
`

const StyledMovieBox = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-content: flex-start;
    align-self: center;
    flex-wrap: wrap;
    max-width: 80%;
    width: 80%;
    height: 70%;
    max-height: 70%;
    overflow: scroll;

`;

const StyledPoster = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 10px;
    max-width: 105px;
    max-height: 200px;  
    text-align: center;
    overflow-wrap: normal; 
`

const Dashboard = (props) => {
    //add a state for current watchlist, watchlists!

    /*handles whether we want to show the creation popups, and the current watchlist
    1) initial values for the creation popups are false since we only want to show them
    upon user interaction. 
    2) currentWL will correspond to its ID, since -1 is an impossible ID it's our default */

    /*{watchlists.map(watchlist => (
                            <p key = {watchlist.id}> {watchlist.wl_title} </p>
                        ))}*/
    
    const [showCreateWL, setCreateWL] = useState(false);
    const [showAddMovie, setAddMovie] = useState(false);
    const [currentWL, setCurrentWL] = useState(undefined);
    const [watchlists, setWatchlists] = useState([])
    const [currentMovs, setCurrentMovs] = useState(undefined)
    //const [watchlistNonEmpty, setWLNonEmpty] = useState(false);
    const [getDashData, setGetDashData] = useState(true)



    const handleSetWLClick = () => {
        setCreateWL(true);
    }

    const noShowWL = (popUpData) => {
        setCreateWL(popUpData)
    }

    const noShowAM = (popUpData) => {
        setAddMovie(popUpData)
    }
    const handleAddMovieClick = () => {
        setAddMovie(true);
    }

    const addNewWatchlist = (newWatchlist) => {
        setWatchlists(watchlists.concat(newWatchlist))
    }

    const addNewMovie = (newMov) => {
        setCurrentMovs(currentMovs.concat(newMov))
        currentWL.movies = currentWL.movies.concat(newMov);   
    }

    useEffect(() =>  {
        if(getDashData){
            axios.get('/api/dashdata')
            .then(function(response){ 
                //if the user has already created watchlists
                if(response.data.watchlists.length > 0){
                    setWatchlists(response.data.watchlists)
                    setCurrentWL(response.data.watchlists[0])
                    setCurrentMovs(response.data.watchlists[0].movies)           
                }
                  
            });
          setGetDashData(false); 
        }  
    })

    const loadmovies = (wl) => {
        setCurrentWL(wl);
        setCurrentMovs(wl.movies);
    }

    let currentWLMovsDisplay = undefined;
    if(currentMovs!== undefined){
        currentWLMovsDisplay = currentMovs.map((movie) => 
            <StyledPoster>
                <img src= {movie.poster_link} alt="Poster" width = "100" height = "150"/>
                <p> {movie.movie_title}</p>
            </StyledPoster>
        );
    }
    
    //formats the watchlist titles to put into
    const watchlistTitles = watchlists.map((watchlist) => 
        <StyledWatchListItem key ={watchlist.id} onClick = {() => loadmovies(watchlist)}>{watchlist.wl_title}</StyledWatchListItem>                
     );
    
    
    return(
        <StyledContainer>
            <StyledNav>
                <StyledLeftNavText> IMD<StyledMe>me</StyledMe> </StyledLeftNavText>
                <StyledRightNavText> Your Dashboard </StyledRightNavText>
                  
            </StyledNav>
            <StyledMain>
                {showCreateWL ? 
                  <StyledPopUp>
                        <CreateWatchlist handleDontShowWL = {noShowWL} updateWatchlists = {addNewWatchlist}> 
                        </CreateWatchlist>
                  </StyledPopUp>   
                 :undefined
                }

                {showAddMovie ? 
                  <StyledPopUp>
                        <AddMovie handleDontShowAM = {noShowAM} currentWLID = {currentWL.id} updateMovies = {addNewMovie}> 
                        </AddMovie>
                  </StyledPopUp>   
                 :undefined
                }
                <StyledWatchlist>
                    <StyledH2> Watchlists</StyledH2>
                    <StyledListBox>
                        {watchlistTitles}
                    </StyledListBox>
                    <StyledAddButton onClick = {handleSetWLClick}> 
                        <p> + </p>
                    </StyledAddButton>

                </StyledWatchlist>
                <StyledMovieDisplay>
                    <StyledMovieBoxTitle> 
                        {currentWL !== undefined ? 
                          currentWL.wl_title
                        : "Create a Watchlist to Get Started!"} 
                        </StyledMovieBoxTitle>
                    <StyledMovieBox>
                        {currentWLMovsDisplay}
                    </StyledMovieBox>
                    {currentWL != null ?
                    <StyledAddButton onClick = {handleAddMovieClick}>
                        <p> + </p>
                    </StyledAddButton>
                    : undefined 
                    }
                </StyledMovieDisplay>
                 
            </StyledMain>
        </StyledContainer>
    );
};

export default Dashboard;