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


import "./App.css";

const ytOptions = {
  maxResults: 10,
  key: 'AIzaSyAEDEgyQ3YB5l3SiHnXgJvwJDvFuK6jAWY',
  videoEmbeddable: true
};

class App extends Component {
  state = { web3: null, accounts: null, contract: null, ytSearchResults: [], videoIds: ['c8rJxxHJIPg', 'OekWK7LorMw', 'jrGupGguAPo'] };

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
      instance.SongChanged({}, { fromBlock: 0, toBlock: 'latest' }).watch((error, result) => {
        // change the current song from the result of the event
        this.setState({ currentSong: result.args.videoUrl });
      });

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.log(error);
    }
  };

  runExample = async () => {
    const { contract } = this.state;
    const response = await contract.getVideoUrl();
    // Update state with the result.
    this.setState({ currentSong: response });
  };

  render() {
    const { accounts, contract } = this.state;
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
        // <div>The stored value is: {this.state.storageValue}</div>
    let mainPlayerStyle = {
      margin: 'auto',
      height: '100%',
      width: '100%'
    };

    return (
      <div className="App">
        <Header />
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
          <Col xs={12} lg={9} >
            <ReactPlayer url={`https://www.youtube.com/watch?v=${this.state.currentSong}`} style={mainPlayerStyle} playing />
          </Col>
          <Col xs={12} lg={3} >
            <UpNextQueue videoIds={this.state.videoIds}/>
          </Col>
        </Row>
        <YTSearchResults results={this.state.ytSearchResults} contract={contract} accounts={accounts} />
      </div>
    );
  }
}

export default App;
