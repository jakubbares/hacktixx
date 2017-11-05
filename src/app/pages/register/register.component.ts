import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {UserService} from "../../../services/user.service";
import {AuthenticationService} from "../../../services/authentication.service";
import {IAccount} from "../../../models/models";
import {Role} from "../../../models/enums";
const Web3 = require('web3');
const contract = require('truffle-contract');
const tixxArtifacts = require('../../../../build/contracts/Tixx.json');
declare var window: any;


@Component({
    moduleId: module.id,
    templateUrl: 'register.component.html'
})

export class RegisterComponent {
  model: any = {};
  loading = false;
  Tixx = contract(tixxArtifacts);
  web3: any;
  account: IAccount;
  userAddressToVerify: string;

  constructor(private router: Router,
              private authenticationService: AuthenticationService,
              private userService: UserService) {
    this.checkAndInstantiateWeb3();
    this.Tixx.setProvider(this.web3.currentProvider);
    this.model['role'] = 'user';
    this.web3.eth.getAccounts((err, accs) => {
      this.account = {
        role: Role.LTD,
        ethAddress: accs[5],
        email: "",
        password: ""
      };
      this.userAddressToVerify = accs[0]
    });
    window['ahoj'] = this;
  }

  register() {
    this.loading = true;
    this.authenticationService.checkUser(this.model.email)
      .subscribe(data => {
          if (data.data) {
            console.error('Email is already registered', true);
          } else {
            this.userService.postUser(this.model)
              .subscribe(
                data => {
                  console.log('Registration successful', true);
                  this.bcVerifyUser(this.userAddressToVerify);
                  this.router.navigate(['/login']);
                },
                error => {
                  console.error(error);
                  this.loading = false;
                });
          }
        },
        error => {
          console.error(error);
        });
  }

  bcVerifyUser = (userAddress) => {
    let meta;
    this.Tixx
      .deployed()
      .then(instance => {
        meta = instance;
        return meta.toVerifyUser(userAddress, {from: this.account.ethAddress, gas: 500000});
      })
      .then(transaction => {
        console.log("bcVerifyUser WORKS");
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
