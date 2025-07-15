import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  registerForm: FormGroup;
  submitted = false;
  errorMessage = '';

  // 👁️ Visibility toggles
  showPassword = false;
  showConfirmPassword = false;

  // ✅ Feedback message properties
  message = '';
  messageType: 'success' | 'error' = 'success';
  showMessage = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, this.domainValidator]],
      password: ['', [Validators.required, Validators.minLength(6), this.passwordStrengthValidator]],
      confirmPassword: ['', Validators.required],
    }, { validators: this.passwordMatchValidator });
  }

  // 👁️ Toggle visibility
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  // ✅ Show success/error messages
  displayMessage(type: 'success' | 'error', text: string): void {
    this.messageType = type;
    this.message = text;
    this.showMessage = true;

    setTimeout(() => {
      this.showMessage = false;
    }, 4000);
  }

  // ✅ Email domain validator
  domainValidator(control: AbstractControl): ValidationErrors | null {
    const email = control.value;
    return email && !email.endsWith('@kristujayanti.com') ? { invalidDomain: true } : null;
  }

  // ✅ Password strength validator
  passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.value;
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])/;
    return password && !regex.test(password) ? { weakPassword: true } : null;
  }

  // ✅ Password match validator
  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  // ✅ On submit registration
  onSubmit(): void {
    this.submitted = true;

    if (this.registerForm.invalid) return;

    const { email, password } = this.registerForm.value;

    this.userService.register(email, password).subscribe({
      next: (response: any) => {
        if (response.message === 'success') {
          sessionStorage.setItem('email', email);
          this.displayMessage('success', 'Registration successful — Redirecting to login...');
          setTimeout(() => this.router.navigate(['/login']), 1500);
        } else if (response.message === 'exist') {
          this.displayMessage('error', 'Email already registered. Please login.');
        } else {
          this.displayMessage('error', 'Registration failed. Please try again.');
        }
      },
      error: (err: any) => {
        this.displayMessage('error', 'Registration failed. Server error.');
        console.error('Registration error:', err);
      }
    });
  }
}