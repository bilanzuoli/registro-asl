//sudo  npm install md5 --save pacchetto da installare per md5


import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import * as md5 from 'md5';  // importo il pacchetto per l'hash
import { Storage } from '@ionic/storage';
export class User {
  name: string;
  email: string;

  constructor(name: string, email: string) {
    this.name = name;
    this.email = email;
  }
}

@Injectable()
export class AuthService {
  currentUser: User;
  constructor(private storage: Storage){}
  public login(credentials) {
    if (credentials.email === null || credentials.password === null) {  //login
      return Observable.throw("Please insert credentials");
    } else {
      return Observable.create(observer => {
        // At this point make a request to your backend to make a real check!




        this.storage.get(credentials.email).then(password => {  //password giusta
          if(md5(credentials.password) == password){    // HASH della psw che viene inserita + il controllo
            observer.next(true);
          } else{
            observer.next(false);
          }
        this.currentUser = new User(credentials.email,credentials.email);
        observer.complete();
      });
    });
  }
}

  public register(credentials) {   //registrarsi
    if (credentials.email === null || credentials.password === null) {
      return Observable.throw("Please insert credentials");
    } else {
      return Observable.create(observer => {
        this.storage.set(credentials.email,md5(credentials.password)).then(val => {    //quando ti registri salva HASH della psw
          if(val){
            observer.next(true);
          } else{
            observer.next(false);
          }
          observer.complete();
        });

      });
    }
  }

  public getUserInfo() : User {
    return this.currentUser;
  }

  public logout() {
    return Observable.create(observer => {
      this.currentUser = null;
      observer.next(true);
      observer.complete();
    });
  }
}
