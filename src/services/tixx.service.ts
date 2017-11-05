import {Injectable, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';

import {ITicket} from '../models/models';


@Injectable()
export class TixxService implements OnInit {
  private baseUrl = '/api/tickets';
  constructor(private http: Http) {
  }
  ngOnInit() {
  }

  getSoldTickets(): Observable<any> {
    return this.http.get(this.baseUrl)
      .map(this.extractData)
      .do(data => console.log('getSoldTickets: ' + JSON.stringify(data)))
      .catch(this.handleError);
  }

  postTicket(ticket: ITicket): Observable<any> {
    const body = JSON.stringify(ticket);
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    return this.http.post(this.baseUrl + '/create', body, options)
      .map((res: Response) => res.json())
      .do(data => console.log('postTicket: ' + JSON.stringify(data)))
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  updateTicket(ticket: ITicket): Observable<any> {
    const body = JSON.stringify(ticket);
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    return this.http.put(this.baseUrl + '/update', body, options)
      .map((res: Response) => res.json())
      .do(data => console.log('updateTicket: ' + JSON.stringify(data)))
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
