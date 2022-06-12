import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../DTOs/User.interface';
import { environment } from '@environment/environment';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class LoginService {
  url: string = environment.apiUrl;
  constructor(private httpClient: HttpClient) {}
  login(): Observable<User> {
    return this.httpClient.post<User>(`${this.url}/user`, {});
  }
}
