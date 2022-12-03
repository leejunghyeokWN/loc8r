import { Inject, Injectable } from '@angular/core';
import { Authresponse } from './authresponse';
import { Loc8rDataService } from './loc8r-data.service';
import { User } from './user';
import { BROWSER_STORAGE } from './storage';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(
    @Inject(BROWSER_STORAGE) private storage: Storage,
    private loc8rDataSercice: Loc8rDataService
  ) {}

  public getToken(): string {
    return this.storage.getItem('loc8r-token')!;
  }
  public saveToken(token: string): void {
    this.storage.setItem('loc8r-token', token);
  }

  public login(user: User): Promise<any> {
    return this.loc8rDataSercice
      .login(user)
      .then((authResp: Authresponse) => this.saveToken(authResp.token));
  }

  public register(user: User): Promise<any> {
    return this.loc8rDataSercice
      .register(user)
      .then((authResp: Authresponse) => this.saveToken(authResp.token));
  }

  public logout(): void {
    this.storage.removeItem('loc8r-token');
  }

  public isLoggedIn(): boolean {
    const token: string = this.getToken();
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp > Date.now() / 1000;
    } else {
      return false;
    }
  }

  public getCurrentUser(): any {
    if (this.isLoggedIn()) {
      const token: string = this.getToken();
      const { email, name } = JSON.parse(atob(token.split('.')[1]));
      return { email, name } as User;
    }
  }
}
