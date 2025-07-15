import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentComponent } from './student/student.component';
import { QuestionPaperComponent } from './student/questionpaper/questionpaper.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgotPasswordComponent } from './forgot/forgot.component';
import { TeacherdashboardComponent } from './teacherdashboard/teacherdashboard.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';




const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Default to login
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot', component: ForgotPasswordComponent },

  { path: 'student', component: StudentComponent },
  { path: 'questionpaper', component: QuestionPaperComponent },
   { path: 'teacherdashboard', component: TeacherdashboardComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: '**', redirectTo: '/login' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
