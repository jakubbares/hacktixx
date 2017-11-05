import { Component, HostListener, NgZone } from '@angular/core';
import {IAccount, ITicket} from '../../../models/models';
import {TixxService} from '../../../services/tixx.service';
const Web3 = require('web3');
const contract = require('truffle-contract');
const tixxArtifacts = require('../../../../build/contracts/Tixx.json');
import * as _ from 'lodash';
import {Role} from "../../../models/enums";
declare var window: any;

@Component({
  selector: 'wallet-page',
  templateUrl: './wallet.page.html'
})
export class WalletComponent {
  Tixx = contract(tixxArtifacts);
  web3: any;
  account: IAccount;
  myTickets: ITicket[];
  verified: any;
  constructor(private tixxService: TixxService) {
    this.checkAndInstantiateWeb3();
    this.Tixx.setProvider(this.web3.currentProvider);
    this.web3.eth.getAccounts((err, accs) => {
      this.account = {
        role: Role.User,
        ethAddress: accs[0],
        email: "",
        password: ""
      };
    });
    this.verified = Array(15).fill(0).map(x => Array(25).fill(false));
    this.tixxService.getSoldTickets().subscribe(tix => {
      this.myTickets = tix.data;
    });
  }

  bcVerifyTicket = (ticket: ITicket) => {
    let meta;
    this.Tixx
      .deployed()
      .then(instance => {
        meta = instance;
        return meta.toVerifyTicket(ticket.userEthAddress, ticket.event + '-R' + ticket.row + 'C' + ticket.column, { from: this.account.ethAddress, gas: 500000 });
      })
      .then(transaction => {
        console.log("bcVerifyTicket WORKS");
        console.log(transaction);
        this.verified[ticket.row][ticket.column] = true;
      })
      .catch(e => {
        console.log(e);
      });
  };



  checkAndInstantiateWeb3 = () => {
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof window.web3 !== 'undefined') {
      console.warn(
        'Using web3 detected from external source. If you find that your accounts don\'t appear or you have 0 MetaCoin, ensure you\'ve configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask'
      );
      // Use Mist/MetaMask's provider
      this.web3 = new Web3(window.web3.currentProvider);
    } else {
      console.warn(
        'No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it\'s inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask'
      );
      // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
      this.web3 = new Web3(
        new Web3.providers.HttpProvider('http://localhost:8545')
      );
    }
  };

}
