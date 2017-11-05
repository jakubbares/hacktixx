import {Role} from "./enums";

export interface ITicket {
  userEthAddress: string;
  userEmail: string;
  event: string;
  row: number;
  column: number;
  resale: boolean;
  origPrice: number;
  newPrice: number;
}

export interface IAccount {
  ethAddress: string;
  role: Role;
  email: string;
  password: string;
}

export interface ISeat {
  row: number;
  column: number;
  occupied: boolean;
}
