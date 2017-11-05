import {Injectable, OnInit } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import {IAccount} from "../models/models";




@Injectable()
export class UserService implements OnInit {
  private baseUrl = '/api/users';
  constructor(private http: Http) {
  }
  ngOnInit() {
  }

  getUsers(): Observable<any> {
    return this.http.get(this.baseUrl)
      .map(this.extractData)
      .do(data => console.log('getUsers: ' + JSON.stringify(data)))
      .catch(this.handleError);
  }

  postUser(user: IAccount): Observable<any> {
    const body = JSON.stringify(user);
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    return this.http.post(this.baseUrl + '/create', body, options)
      .map((res: Response) => res.json())
      .do(data => console.log('postUser: ' + JSON.stringify(data)))
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  updateUser(user: IAccount): Observable<any> {
    const body = JSON.stringify(user);
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    return this.http.put(this.baseUrl + '/' + user.email + '/update', body, options)
      .map((res: Response) => res.json())
      .do(data => console.log('updateUser: ' + JSON.stringify(data)))
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  deleteUser(email: string): Observable<any> {
    return this.http.get(this.baseUrl + '/' + email + '/destroy')
      .map((res: Response) => res.json())
      .do(data => console.log('deleteUser: ' + JSON.stringify(data)))
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  private extractData(response: Response) {
    const body = response.json();
    return body || {};
  }

  private handleError(error: Response): Observable<any> {
    console.error(error);
    return Observable.throw(error.json().error || 'Server error');
  }
}
