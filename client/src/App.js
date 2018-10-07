import React, { Component } from "react";
import Jukebox from "./contracts/Jukebox.json";
import getWeb3 from "./utils/getWeb3";
import truffleContract from "truffle-contract";
import UpNextQueue from "./components/up-next-queue";
import {Row, Col} from "react-flexbox-grid";
import { Button } from 'react-bootstrap';
import ReactPlayer from 'react-player';
import ytSearch from 'youtube-search';
import YTSearchResults from './components/yt-search-results';
import Header from './components/Header';
import styled from 'styled-components';
import Media from 'react-media';


import "./App.css";

const ytOptions = {
  maxResults: 10,
  key: 'AIzaSyAEDEgyQ3YB5l3SiHnXgJvwJDvFuK6jAWY',
  videoEmbeddable: true,
  type: 'video'
};

// #fafafa
const Input = styled.input`
    width: 420px;
    height: 50px;
    margin: 20px 20px 20px 0;
    border-radius: 3px;
    border: none;
    padding: 0 15px;
    font-size: 1.5em;
    background-color: #efefef;

    @media only screen and (max-width: 600px) {
        width:100%;
    }
`
const SearchButton = styled(Button)`
  height: 50px;
  width: 100px;
  margin: 0;
  font-size: 1.3em;
`
const Queue = styled(Col)`
  background-color:#fefefe;
`

const HeaderContainer = styled(Row)`
  margin-bottom:40px;
  border-bottom: 2px solid #e7e7e7;
  background-color:white;
`

const SearchContainer = styled(Col)`
  text-align:center;
  border-bottom: 2px solid #e7e7e7;
  padding-bottom:30px;
  margin:30px 0 30px;

  @media only screen and (max-width: 600px) {
    margin:15px 0 15px;
  }
`
const AppContainer = styled.div`
  padding: 0 25px;

  @media only screen and (max-width: 600px) {
    padding: 0 5px;
}
`
const PlayerContainer = styled(Col)`
  @media only screen and (min-width: 601px) {
      iframe {
        box-shadow: rgba(0, 0, 0, 0.24) 0px 4px 15px;
    }
  }
`
class App extends Component {
  state = { 
    web3: null, 
    accounts: null, 
    contract: null, 
    currentSong: null,
    timeToSkip: 0,
    ytSearchResults: [], 
    videoIds: [] };

  componentDidMount = async () => {
    let web3;
    try {
      // Get network provider and web3 instance.
      web3 = await getWeb3();
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3 Check console for details.

        Make sure you have web3 in your browser and are connected to the ropsten testnet`
      );
      console.log(error);
    }

    try {
      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.accounts;
      console.log('accounts: ', accounts);
      console.log('web3.eth: ', web3.eth);

      // Get the contract instance.
      const Contract = truffleContract(Jukebox);
      Contract.setProvider(web3.currentProvider);
      const instance = await Contract.deployed();
      console.log('instance: ', instance);

      instance.QueueUpdated({}).watch((error, result) => {
        console.log('QueueUpdated result: ', result)
        // change the current song from the result of the event
        const videoIds = this.state.videoIds;
        videoIds.push(result.args.videoUrl);
        console.log('videoIds: ', videoIds);
        this.setState({ videoIds: videoIds });
      });

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.getSongToPlay);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load accounts. You can still view but you cannot post. 

        Make sure you have web3 in your browser and are connected to the ropsten testnet`
      );
      console.log(error);
    }
  };

  async getSongToPlay() {
    const { contract } = this.state;
    const length = await contract.chainLength();
    const indexesToRetrieve = [...Array(length.toNumber()).keys()]

    const functions = indexesToRetrieve.map(index => contract.chainItem(index))
    let results = await Promise.all(functions)


    let songToPlay;
    let howLongToPlay;
    let videoIds = [];
    let timeToSkip;
    for (const [url, startTime, duration] of results) {

        const startTimeObj = new Date(startTime.toNumber()*1000);
        const whenToSwitch = new Date(startTime.toNumber()*1000 + duration.toNumber()*1000);
        if (whenToSwitch > new Date()) {
          if (startTimeObj < new Date()) {
            songToPlay = url;
            howLongToPlay = whenToSwitch - new Date();
            timeToSkip = parseInt((new Date() - startTimeObj)/1000);
            console.log('played or playing:', url, startTimeObj.toLocaleTimeString(), whenToSwitch.toLocaleTimeString())
          } else { 
            videoIds.push(url);
            console.log('queued:', url, startTimeObj.toLocaleTimeString(), whenToSwitch.toLocaleTimeString())
          }
        }
        
    }
    this.setState({ currentSong: songToPlay, timeToSkip, videoIds: videoIds });

    setTimeout(() => {
      this.getSongToPlay()
    }, howLongToPlay)

  }

  render() {
    const { accounts, contract } = this.state;
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    let mainPlayerStyle = {
      margin: 'auto',
      height: '100%',
      width: '100%',
    };

    return (
      <AppContainer>
        <HeaderContainer>
          <Col xs={12}>
            <Header />
          </Col>
        </HeaderContainer>
        <Row>
          <PlayerContainer xs={12} lg={9} >
            <Media query="(max-width: 600px)">
              {matches =>
                        matches ? (
                          <ReactPlayer url={`https://www.youtube.com/watch?v=${this.state.currentSong}&t=${this.state.timeToSkip}`} width="375" height="375" style={mainPlayerStyle} playing />
                        ) : (
                        <ReactPlayer url={`https://www.youtube.com/watch?v=${this.state.currentSong}&t=${this.state.timeToSkip}`} style={mainPlayerStyle} playing />
                        )
                    }
                </Media>
          </PlayerContainer>
          <Queue xs={12} lg={3} >
            <UpNextQueue videoIds={this.state.videoIds}/>
          </Queue>
        </Row>
        <Row>
          <SearchContainer xs={12} lg={9} >
            <form onSubmit={async (e) => {
              e.preventDefault();
              try {
                const searchResults = await ytSearch(this.state.searchInput, ytOptions);
                console.log('searchResults: ', searchResults);
                this.setState({ ytSearchResults: searchResults.results });
              } catch(e) {
                console.log('yt search error: ', e);
                this.setState({ searchError: e });
              }
            }}>
              <Input placeholder="choose the next video" onChange={(e) => { this.setState({ searchInput: e.target.value })}} />
              <SearchButton type="submit" bsStyle="default">Search</SearchButton>
            </form>
          </SearchContainer>
          </Row>
          <YTSearchResults results={this.state.ytSearchResults} contract={contract} accounts={accounts} />
      </AppContainer>
    );
  }
}

export default App;
