import React, { Component } from "react";
import Jukebox from "./contracts/Jukebox.json";
import getWeb3 from "./utils/getWeb3";
import truffleContract from "truffle-contract";
import PlayList from "./components/playlist";
import {Row, Col} from "react-flexbox-grid";
import { Button, Image } from 'react-bootstrap';
import ReactPlayer from 'react-player';
import ytSearch from 'youtube-search';
import YTSearchResults from './components/yt-search-results';


import "./App.css";

const ytOptions = {
  maxResults: 10,
  key: 'AIzaSyAEDEgyQ3YB5l3SiHnXgJvwJDvFuK6jAWY'
};

class App extends Component {
  state = { web3: null, accounts: null, contract: null, ytSearchResults: [] };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.accounts;
      console.log('accounts: ', accounts);
      console.log('web3.eth: ', web3.eth);

      // Get the contract instance.
      const Contract = truffleContract(Jukebox);
      Contract.setProvider(web3.currentProvider);
      const instance = await Contract.deployed();
      console.log('instance: ', instance);

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.getSongToPlay);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
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
    for (const [url, startTime, duration] of results) {

        const startTimeObj = new Date(startTime.toNumber()*1000);
        const whenToSwitch = new Date(startTime.toNumber()*1000 + duration.toNumber()*1000)
        if (startTimeObj < new Date()) {
          songToPlay = url;
          howLongToPlay = duration.toNumber()*1000;
          console.log('played or playing:', url, startTimeObj.toLocaleTimeString(), whenToSwitch.toLocaleTimeString())
        } else { 
          console.log('queued:', url, startTimeObj.toLocaleTimeString(), whenToSwitch.toLocaleTimeString())
        }
    }
    this.setState({ currentSong: songToPlay });

    setTimeout(() => {
      this.getAllSongs()
    }, howLongToPlay)

  }

  render() {
    const { accounts, contract } = this.state;
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    let mainPlayerStyle = {
      margin: 'auto',
    };

    return (
      <div className="App">
        <h1>ETH Jukebox</h1>
        <p>Pay 1 eth to run the jukebox!</p>
        <Row>
          <Col xs={12}>
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
            <input onChange={(e) => { this.setState({ searchInput: e.target.value })}} />
              <Button type="submit" bsStyle="default">Search</Button>
            </form>
          </Col>
        </Row>
        <Row>
          <Col lg={9} >
            this is main player area
            <Row>
            <Col lg={2} />
            <Col lg={8} >
              <ReactPlayer url={`https://www.youtube.com/watch?v=${this.state.currentSong}`} style={mainPlayerStyle} playing />
            </Col>
            <Col lg={1} />
            </Row>
          </Col>
          <Col lg={1} >
            <PlayList/>
          </Col>
        </Row>
        <YTSearchResults results={this.state.ytSearchResults} contract={this.state.contract} accounts={this.state.accounts} />
      </div>
    );
  }
}

export default App;
