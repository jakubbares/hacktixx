import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {TixxComponent} from "./pages/tixx/tixx.page";
import {WalletComponent} from "./pages/wallet/wallet.page";
import {LoginComponent} from "./pages/login/login.component";
import {RegisterComponent} from "./pages/register/register.component";


export const router: Routes = [
  { path: '', redirectTo: 'data', pathMatch: 'full' },
  { path: 'tixx', component: TixxComponent },
  { path: 'wallet', component: WalletComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent }
];

export const routes: ModuleWithProviders = RouterModule.forRoot(router);
