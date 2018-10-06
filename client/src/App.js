import React, { Component } from "react";
import Jukebox from "./contracts/Jukebox.json";
import getWeb3 from "./utils/getWeb3";
import truffleContract from "truffle-contract";

import "./App.css";

class App extends Component {
  state = { web3: null, accounts: null, contract: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();
      console.log('web3: ', web3);

      // Use web3 to get the user's accounts.
      let accounts;
      web3.eth.getAccounts((test1, test2) => {
        accounts = test2;
        console.log('test1: ', test1);
        console.log('test2: ', test2);
      });
      console.log('accounts: ', accounts);

      // Get the contract instance.
      const Contract = truffleContract(Jukebox);
      Contract.setProvider(web3.currentProvider);
      const instance = await Contract.deployed();
      console.log('instance: ', instance);
      instance.SongChanged({}, { fromBlock: 0, toBlock: 'latest' }).watch((error, result) => {
        console.log("on watch");
        console.log('error: ', error);
        console.log('result: ', result);
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
    console.log('hits getVideoUrl');

    // Update state with the result.
    this.setState({ currentSong: response });
  };

  render() {
    const { accounts, contract } = this.state;
    console.log('contract: ', contract)
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
      blah blah blah
        <div>
          <iframe title="jukebox-video" width="863" height="647" src={`https://www.youtube.com/embed/${this.state.currentSong}?autoplay=1`} frameBorder="0" allow="autoplay" allowFullScreen></iframe>
        </div>

        <div>{this.state.currentSong}</div>

      <input type="text" value={this.state.userInput} onChange={(val, test) => {
        console.log('userInput val: ', val.target.value)
        this.setState({userInput: val.target.value})
        }} />
        <button onClick={() => {
          contract.setVideoUrl(this.state.userInput, { from: accounts[0] });
        }}>Submit</button>
      </div>
    );
  }
}

export default App;
