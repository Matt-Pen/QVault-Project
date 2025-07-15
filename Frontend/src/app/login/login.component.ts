import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {

  email = '';
  password = '';
  showPassword = false;

  // ✅ Toast message
  message = '';
  messageType: 'success' | 'error' | '' = '';
  showMessage = false;

  // ✅ Spinner flag
  loading = false;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
  this.email = '';
  this.password = '';
  sessionStorage.clear(); // optional: ensure no leftover data
}


  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  displayMessage(type: 'success' | 'error', text: string): void {
    this.messageType = type;
    this.message = text;
    this.showMessage = true;

    setTimeout(() => {
      this.showMessage = false;
    }, 4000);
  }

  onSubmit(): void {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@kristujayanti\.com$/;
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{6,}$/;

    if (!emailPattern.test(this.email)) {
      this.displayMessage('error', 'Only @kristujayanti.com emails are allowed');
      return;
    }

    if (!passwordPattern.test(this.password)) {
      this.displayMessage(
        'error',
        'Password must include uppercase, lowercase, special character and be at least 6 characters.'
      );
      return;
    }

    // ✅ Show spinner
    this.loading = true;

    this.userService.login(this.email, this.password).subscribe({
      next: (response: any) => {
        // ✅ Hide spinner
        this.loading = false;

        if (response.message === 'successfull') {
          sessionStorage.setItem('email', this.email);

          setTimeout(() => {
            if (response.role === 'student') {
              this.router.navigate(['/student']);
            } else if (response.role === 'teacher') {
              this.router.navigate(['/teacherdashboard']);
            }
          }, 1500);
        } else {
          if (response.message === 'failed') {
            this.displayMessage('error', 'Invalid Email');
          } else if (response.message === 'password failed') {
            this.displayMessage('error', 'Incorrect Password');
          }
        }
      },
      error: (err: any) => {
        // ✅ Hide spinner on error
        this.loading = false;
        this.displayMessage('error', 'Login failed. Please try again.');
        console.error('Login error:', err);
      }
    });
  }
}