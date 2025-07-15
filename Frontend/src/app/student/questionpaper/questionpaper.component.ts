import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/api.service';

@Component({
  selector: 'app-questionpaper',
  templateUrl: './questionpaper.component.html',
  styleUrls: ['./questionpaper.component.css']
})
export class QuestionPaperComponent implements OnInit {
  courseName = '';
  specialization = '';
  showFilters = false;
  searchTerm = '';
  isLoading = true;

  email: string = '';

  filters = {
    subject: '',
    year: '',
    type: ''
  };

  subjects: string[] = [];
  years: string[] = [];
  types = ['Mid Sem', 'End Sem'];

  allPapers: any[] = [];
  filteredPapers: any[] = [];

  constructor(private route: ActivatedRoute, private api: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.email = sessionStorage.getItem('email') || '';

    this.route.queryParams.subscribe(params => {
      this.courseName = params['course'] || 'Selected Course';
      this.specialization = params['specialization'] || '';

      this.api.getQuestionPapers(this.courseName).subscribe(data => {
        this.isLoading = false;

        if (!Array.isArray(data)) {
          console.error('Invalid response format', data);
          return;
        }

        this.allPapers = data.map((paper: any) => ({
          id: paper.id,
          subname: paper.course,
          courseid: paper.courseid,
          department: paper.department,
          coursename: paper.program,
          term: paper.term,
          year: paper.year,
          fileId: paper.pdfUrl || paper.id // fallback
        }));

        this.subjects = [...new Set(this.allPapers.map(p => p.subname))];
        this.years = [...new Set(this.allPapers.map(p => p.year))].sort((a, b) => +b - +a);

        this.applyFilters();
        console.log('Raw API data:', data);
      }, error => {
        this.isLoading = false;
        console.error('Failed to load papers', error);
      });
    });
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  applyFilters(): void {
    this.filteredPapers = this.allPapers
      .filter(paper =>
        (!this.filters.subject || paper.subname === this.filters.subject) &&
        (!this.filters.year || paper.year === this.filters.year) &&
        (!this.filters.type || paper.term === this.filters.type)
      )
      .map(paper => ({
        title: `${paper.subname} - ${paper.term}`,
        year: paper.year,
        code: paper.courseid,
        subject: paper.subname,
        type: paper.term,
        imageUrl: 'assets/10007105.png',
        fileId: paper.fileId || paper.id || ''
      }));

    console.log('Filtered Papers:', this.filteredPapers);
  }

  resetFilters(): void {
    this.filters = { subject: '', year: '', type: '' };
    this.searchTerm = '';
    this.applyFilters();
  }

  convertBinaryToBase64(binaryData: any): string {
    if (!binaryData || !binaryData.length) return 'assets/Images/samplepaper.png';
    const byteArray = new Uint8Array(binaryData);
    let binaryString = '';
    for (let i = 0; i < byteArray.length; i++) {
      binaryString += String.fromCharCode(byteArray[i]);
    }
    return 'data:application/pdf;base64,' + btoa(binaryString);
  }

  openPDF(fileId: string): void {
    console.log("Opening PDF with fileId:", fileId);
    if (!fileId) {
      alert("No PDF available.");
      return;
    }

    const pdfUrl = `http://172.21.11.107:8080/pdf?id=${fileId}`;
    window.open(pdfUrl, '_blank');
  }

  logout(): void {
    sessionStorage.removeItem('email');
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}
