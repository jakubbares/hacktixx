import { Component } from '@angular/core';
import {IAccount, ISeat, ITicket} from '../../../models/models';
import {TixxService} from '../../../services/tixx.service';
const Web3 = require('web3');
const contract = require('truffle-contract');
const tixxArtifacts = require('../../../../build/contracts/Tixx.json');
import * as _ from 'lodash';
import {AuthenticationService} from "../../../services/authentication.service";
import {Role} from "../../../models/enums";
declare var window: any;

@Component({
  selector: 'tixx-page',
  templateUrl: './tixx.page.html'
})
export class TixxComponent {
  Tixx = contract(tixxArtifacts);
  web3: any;
  account: IAccount;
  myTickets: ITicket[] = [];
  seats: any;
  selectedSeats: any;
  priceForSeats: any;
  totalPrice: number;
  rows: number[];
  columns: number[];

  constructor(private tixxService: TixxService,
              private authService: AuthenticationService) {
    this.checkAndInstantiateWeb3();
    this.web3.eth.getAccounts((err, accs) => {
      this.account = {
        role: Role.User,
        ethAddress: accs[0],
        email: "",
        password: ""
      };
    });
    this.Tixx.setProvider(this.web3.currentProvider);
    this.rows = _.range(15);
    this.columns = _.range(26);
    this.seats = Array(15).fill(0).map(x => Array(26).fill('None'));
    this.selectedSeats = Array(15).fill(0).map(x => Array(26).fill(false));
    this.priceForSeats = Array(15).fill(0).map(x => Array(26).fill(0));
    this.rows.forEach(row => {
      this.columns.forEach(col => {
        if (col > 0) {
          this.seats[row][col] = Math.random() >= 0.80 ? (Math.random() >= 0.38 ? 'Free' : 'Resale') : 'None';
          this.priceForSeats[row][col] = Math.round((Math.random() * 150) + 100);
        }
      });
    });
    this.tixxService.getSoldTickets().subscribe(tix => {
      tix.data.forEach(tic => {
        this.seats[tic.row][tic.column] = 'Resale';
      });
    });
    window['ahoj'] = this;
  }

  postTicket(ticket: ITicket) {
    this.tixxService.postTicket(ticket).subscribe(data => {
      console.log(data.data);
    });
  }

  updateTicket(ticket: ITicket) {
    this.tixxService.updateTicket(ticket).subscribe(data => {
      console.log(data.data);
    });
  }
  bookTicket(row: number, col: number) {
    const ticket: ITicket = {
      userEthAddress: this.account.ethAddress,
      userEmail: this.account.email,
      event: 'LionKing',
      resale: this.seats[row][col] === 'Resale' ? true : false,
      row: row,
      column: col,
      origPrice: 100,
      newPrice: this.seats[row][col] === 'Resale' ? this.priceForSeats[row][col] : 100
    };
    this.selectedSeats[row][col] = true;
    this.myTickets.push(ticket);
    this.totalPrice = 0;
    this.myTickets.forEach(tic => {
      this.totalPrice += tic.newPrice;
    })
  }

  purchaseTickets() {
    this.myTickets.forEach(tic => {
      if (tic.resale) {
        this.bcTransferTicket(tic);
      } else {
        this.bcBuyTicket(tic);
      }
    });
  }

  unbookTicket(row: number, col: number) {
    this.selectedSeats[row][col] = false;
    this.myTickets = this.myTickets.filter(tic => {
      return tic.row !== row && tic.column !== col;
    });
    this.totalPrice = 0;
    this.myTickets.forEach(tic => {
      this.totalPrice += tic.newPrice;
    })
  }

  bcBuyTicket = (ticket: ITicket) => {
    let meta;
    this.Tixx
      .deployed()
      .then(instance => {
        meta = instance;
        const ethValue = Math.round((ticket.origPrice / 300) * (10 ** 18));
        return meta.toBuyTicket(ticket.event + '-R' + ticket.row + 'C' + ticket.column, ticket.origPrice, { from: this.account.ethAddress, value: ethValue, gas: 500000 });
      })
      .then(transaction => {
        this.postTicket(ticket);
        console.log("bcBuyTicket WORKS");
        console.log(transaction);
      })
      .catch(e => {
        console.log(e);
      });
  };

  bcTransferTicket = (ticket: ITicket) => {
    let meta;
    this.Tixx
      .deployed()
      .then(instance => {
        meta = instance;
        const ethValue = Math.round((ticket.newPrice / 300) * (10 ** 18));
        return meta.toTransferTicket(ticket.event + '-R' + ticket.row + 'C' + ticket.column, ticket.newPrice, { from: this.account.ethAddress, value: ethValue, gas: 500000 });
      })
      .then(transaction => {
        this.updateTicket(ticket);
        console.log("bcTransferTicket WORKS");
        console.log(transaction);
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
