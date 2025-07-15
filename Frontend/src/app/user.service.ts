import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private loginUrl = 'http://172.21.11.107:8080/userlog';
  private registerUrl = 'http://172.21.11.107:8080/usersign';
  private resetPasswordUrl = 'http://172.21.11.107:8080/resetpass';

  constructor(private http: HttpClient) {}

  // ✅ Login method
  login(email: string, password: string): Observable<any> {
    const params = new HttpParams()
      .set('Email', email)
      .set('Password', password);

    return this.http.post(this.loginUrl, null, {
      params,
      responseType: 'json'
    });
  }

  // ✅ Register method
  register(email: string, password: string): Observable<any> {
    const params = new HttpParams()
      .set('Email', email)
      .set('Password', password);

    return this.http.post(this.registerUrl, null, {
      params,
      responseType: 'json'
    });
  }

  // ✅ Reset Password method (for "Forgot Password")
  resetPassword(data: {
  email: string;
  code?: string;
  newPassword?: string;
}): Observable<any> {
  let params = new HttpParams().set('Email', data.email);

  if (data.code) {
    params = params.set('code', data.code);
  }

  if (data.newPassword) {
    params = params.set('NewPassword', data.newPassword);
  }

  return this.http.post(this.resetPasswordUrl, null, {
    params,
    responseType: 'json'
  });
}
  

private userEmail: string = '';

// ✅ Set email after login
setEmail(email: string): void {
  this.userEmail = email;
  localStorage.setItem('userEmail', email); // Optional: persist across refresh
}

// ✅ Get email where needed
getEmail(): string {
  if (!this.userEmail) {
    this.userEmail = localStorage.getItem('userEmail') || '';
  }
  return this.userEmail;
}
}