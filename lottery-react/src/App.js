import React from "react";
// import logo from "./logo.svg";
import web3 from "./web3";
import lottery from "./lottery";
import "./App.css";

class App extends React.Component {
  state = {
    manager: "xManagerID",
    players: [],
    balance: "",
    value: "",
    message: "",
    account: "",
    manageBool: true
  };
  async componentDidMount() {
    const manager = await lottery.methods.manager().call();
    const accounts = await web3.eth.getAccounts();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    this.initPoll();
    this.setState({ manager, players, balance, account: accounts[0] });
  }

  initPoll = () => {
    if (!this.interval) {
      this.interval = setInterval(this.updateAccount, 1000);
    }
  };

  updateAccount = () => {
    window.ethereum.on("accountsChanged", accounts => {
      this.setState({
        account: web3.utils.toChecksumAddress(accounts[0]),
        message: ""
      });
    });
  };

  onSubmit = async event => {
    event.preventDefault();

    if (this.state.players.includes(this.state.account)) {
      this.setState({ message: "You have already entered!" });
      return;
    }

    if (this.state.value < 0.01) {
      this.setState({ message: "Enter amount greater than 0.01ETH" });
      return;
    }

    this.setState({ message: "Transaction is processing. Please wait..." });

    await lottery.methods.enter().send({
      from: this.state.account,
      value: web3.utils.toWei(this.state.value, "ether")
    });

    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

    this.setState({ message: "You have been entered!", players, balance });
  };

  onClick = async () => {
    this.setState({ message: "Winner picking in process", manageBool: false });

    await lottery.methods.pickWinner().send({
      from: this.state.account
    });

    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

    this.setState({ players, balance });

    this.setState({
      message: "Winner picked. Funds transferred!",
      manageBool: true
    });
  };

  renderManageOptions = () => {
    // console.log(this.state.account);
    // console.log(this.state.manager);
    // console.log(this.state.account === this.state.manager);

    if (
      this.state.account === this.state.manager &&
      this.state.manageBool &&
      this.state.players.length !== 0
    ) {
      return (
        <div>
          <h4>Ready to pick a winner?</h4>
          <button onClick={this.onClick}>Pick</button>
        </div>
      );
    }
  };

  render() {
    // console.log(this.state.accounts);
    return (
      <div>
        <h2>Ethereum Lottery</h2>
        <p>This contract is managed by {this.state.manager} </p>
        <p>
          There are currently {this.state.players.length} people entered,
          competing to win {web3.utils.fromWei(this.state.balance, "ether")}
          ETH.
        </p>
        <hr />
        <form onSubmit={this.onSubmit}>
          <h4>Want to try your luck {this.state.account}?</h4>
          <div>
            <label>Amount of ether to enter: </label>
            <input
              value={this.state.value}
              onChange={event => this.setState({ value: event.target.value })}
            />
          </div>
          <br />
          <button>Enter</button>
        </form>
        <hr />
        <h3>{this.state.message}</h3>
        <div>{this.renderManageOptions()}</div>
      </div>
    );
  }
}

export default App;
