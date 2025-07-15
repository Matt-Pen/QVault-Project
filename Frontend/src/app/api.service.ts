// src/app/services/api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://172.21.11.107:8080'; // Replace with your actual backend URL

  constructor(private http: HttpClient) {}

  getQuestionPapers(program: string): Observable<any[]> {
    const params = new HttpParams().set('program', program);
    return this.http.get<any[]>(`${this.baseUrl}/courseclick`, { params });
  }
  getFilteredQuestionPapers(params: any): Observable<any> {
  const query = new URLSearchParams(params).toString();
  return this.http.get<any[]>(`${this.baseUrl}/filterclick`, { params });
 
}
getAllQuestionPapers() {
  return this.http.get<any[]>('http://172.21.11.107:8080/teacher');
}
uploadQuestionPaper(formData: FormData) {
  return this.http.post('http://172.21.11.107:8080/upload', formData);
}

deleteQuestionPaper(id: string) {
  return this.http.delete(`http://172.21.11.107:8080/delqp?id=${id}`, { responseType: 'text' });
}

}
