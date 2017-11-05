import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {TixxService} from '../services/tixx.service';
import {routes} from "./app.routes";
import {UserService} from "../services/user.service";
import {AuthenticationService} from "../services/authentication.service";
import {TixxComponent} from "./pages/tixx/tixx.page";
import {RegisterComponent} from "./pages/register/register.component";
import {LoginComponent} from "./pages/login/login.component";
import {WalletComponent} from "./pages/wallet/wallet.page";

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    NgbModule.forRoot(),
    routes
  ],
  declarations: [
    AppComponent,
    TixxComponent,
    RegisterComponent,
    LoginComponent,
    WalletComponent
  ],
  providers: [
    TixxService,
    UserService,
    AuthenticationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
