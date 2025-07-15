import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
  ValidatorFn
} from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot.component.html',
})
export class ForgotPasswordComponent implements OnInit {
  forgotForm!: FormGroup;

  showResetFields = false;
  showPassword = false;
  showConfirmPassword = false;
  submitted = false;

  message = '';
  messageType: 'success' | 'error' | '' = '';
  showMessage = false;

  constructor(private userService: UserService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.forgotForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        code: [''],
        password: ['', [Validators.required, Validators.minLength(6), this.passwordStrengthValidator()]],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.matchPasswords }
    );
  }

  // ✅ Toggle password visibility
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  // ✅ Toast message
  displayMessage(type: 'success' | 'error', text: string): void {
    this.messageType = type;
    this.message = text;
    this.showMessage = true;
    setTimeout(() => (this.showMessage = false), 4000);
  }

  // ✅ Password strength validator as factory function
  passwordStrengthValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value || '';
      const hasUpper = /[A-Z]/.test(value);
      const hasLower = /[a-z]/.test(value);
      const hasSpecial = /[\W_]/.test(value);
      return hasUpper && hasLower && hasSpecial ? null : { weakPassword: true };
    };
  }

  // ✅ Match password & confirm
  matchPasswords(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return password === confirm ? null : { passwordMismatch: true };
  }

  // ✅ Step 1: Send code
  sendCode(): void {
    const email = this.forgotForm.get('email')?.value.trim();

    if (!email.endsWith('@kristujayanti.com')) {
      this.displayMessage('error', 'Only college emails are allowed.');
      return;
    }

    this.userService.resetPassword({ email }).subscribe({
      next: (res: any) => {
        if (res.message === 'sent') {
          this.showResetFields = true;
          this.displayMessage('success', 'A code has been sent to your email.');
        } else {
          this.displayMessage('error', res.message || 'Failed to send reset code.');
        }
      },
      error: () => {
        this.displayMessage('error', 'Server error. Try again later.');
      },
    });
  }

  // ✅ Step 2: Reset password
  submitReset(): void {
    this.submitted = true;

    const email = this.forgotForm.get('email')?.value.trim();
    const code = this.forgotForm.get('code')?.value.trim();
    const password = this.forgotForm.get('password')?.value;

    if (!email || !code || this.forgotForm.invalid) {
      this.displayMessage('error', 'Please fill in all fields correctly.');
      return;
    }

    this.userService.resetPassword({ email, code, newPassword: password }).subscribe({
      next: (res: any) => {
        if (res.message === 'success') {
          this.displayMessage('success', 'Password reset successful! Please login.');
          this.forgotForm.reset();
          this.submitted = false;
          this.showResetFields = false;
        } else {
          this.displayMessage('error', res.message || 'Password reset failed.');
        }
      },
      error: () => {
        this.displayMessage('error', 'Server error. Try again.');
      },
    });
  }
}
