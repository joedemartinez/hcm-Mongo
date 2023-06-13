import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private headers: HttpHeaders;
  token:any

  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });
  }

  private getToken(): string {
    // Retrieve the JWT from local storage or wherever it's stored
    this.token = localStorage.getItem('jwt');
    return this.token
  }

  post(url: string, body: any) {
    return this.http.post(url, body, { headers: this.headers });
  }

  get(url: string) {
    return this.http.get(url, { headers: this.headers });
  }

  delete(url: string) {
    return this.http.delete(url, { headers: this.headers });
  }

  put(url: string, body: any) {
    return this.http.put(url, body, { headers: this.headers });
  }

  patch(url: string, body: any) {
    return this.http.patch(url, body, { headers: this.headers });
  }
}
