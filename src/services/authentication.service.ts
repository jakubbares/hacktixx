import { Injectable } from '@angular/core';
import {Http, Headers, Response, RequestOptions} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import {IAccount} from "../models/models";
const Web3 = require('web3');
import * as _ from 'lodash';
import {Role} from "../models/enums";


@Injectable()
export class AuthenticationService {
    private baseUrl = '/api/auth';
    accounts: any[];
    web3: any;
    account: IAccount;
    constructor(private http: Http) {
    }

  isLoggedIn() {
      return !!localStorage['currentUser'];
  }

  login(email: string, password: string) {
        const body = JSON.stringify({
          email: email,
          password: password
        });
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const options = new RequestOptions({ headers: headers });
        return this.http.post(this.baseUrl, body, options)
            .map((response: Response) => {
                const user = response.json().data;
                if (!!user) {
                  localStorage.setItem('currentUser', JSON.stringify(user));
                }
                return user;
            });
    }

  checkUser(email: string) {
      const body = JSON.stringify({
          email: email
      });
      const headers = new Headers({ 'Content-Type': 'application/json' });
      const options = new RequestOptions({ headers: headers });
      return this.http.post(this.baseUrl + '/check', body, options)
        .map((res: Response) => res.json())
        .do(data => console.log('checkedUser: ' + JSON.stringify(data)))
        .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
    }
}
