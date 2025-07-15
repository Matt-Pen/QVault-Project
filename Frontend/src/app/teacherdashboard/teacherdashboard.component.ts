import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/api.service';

@Component({
  selector: 'app-teacherdashboard',
  templateUrl: './teacherdashboard.component.html',
  styleUrls: ['./teacherdashboard.component.css']
})
export class TeacherdashboardComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  email: string = '';
  showFilters = false;
  showExitModal = false;
  isLoading = true;

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

  constructor(private router: Router, private api: ApiService) {}

  ngOnInit(): void {
    this.email = sessionStorage.getItem('email') || '';

    this.api.getAllQuestionPapers().subscribe(data => {
      this.isLoading = false;

      if (!Array.isArray(data)) {
        console.error('Unexpected response', data);
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
        fileId: paper.pdfUrl 
      }));

      this.subjects = [...new Set(this.allPapers.map(p => p.subname))];
      this.years = [...new Set(this.allPapers.map(p => p.year))].sort((a, b) => +b - +a);

      this.applyFilters();
    }, error => {
      this.isLoading = false;
      console.error('API error:', error);
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
      );
  }

  resetFilters(): void {
    this.filters = { subject: '', year: '', type: '' };
    this.applyFilters();
  }


  handleFileUpload(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      console.log('Uploading:', file);
      // TODO: integrate upload logic with backend
    }
  }

  openExitModal(): void {
    this.showExitModal = true;
    document.body.classList.add('overflow-hidden');
  }

  closeModal(): void {
    this.showExitModal = false;
    document.body.classList.remove('overflow-hidden');
  }

  logout(): void {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

  openPDF(fileId: string): void {
    if (!fileId) {
      alert("No file ID found.");
      return;
    }
    const url = `http://172.21.11.107:8080/pdf?id=${fileId}`;
    window.open(url, '_blank');
  }
  showAddModal = false;
newPaper = {
  course: '',
  courseid: '',
  department: '',
  program: '',
  term: '',
  year: ''
};

validationError: boolean = false;

isUploadFormValid(): boolean {
  const fieldsFilled =
    this.newPaper.course.trim() &&
    this.newPaper.courseid.trim() &&
    this.newPaper.department.trim() &&
    this.newPaper.program.trim() &&
    this.newPaper.term.trim() &&
    this.newPaper.year.trim() &&
    this.selectedFile;

  this.validationError = !fieldsFilled;
  return !!fieldsFilled;
}

formSubmitted: boolean = false;


selectedFile!: File;

onAddClick(): void {
  this.showAddModal = true;
}

closeAddModal(): void {
  this.showAddModal = false;
}

onFileSelected(event: any): void {
  this.selectedFile = event.target.files[0];
}

uploadNewPaper(event: Event): void {
  event.preventDefault();
  if (!this.selectedFile) {
    alert('Please select a PDF file.');
    return;
  }

  const formData = new FormData();
  formData.append('file', this.selectedFile);
  formData.append('course', this.newPaper.course);
  formData.append('id', this.newPaper.courseid); // Note: backend expects 'id'
  formData.append('department', this.newPaper.department);
  formData.append('program', this.newPaper.program);
  formData.append('term', this.newPaper.term);
  formData.append('year', this.newPaper.year);

 this.api.uploadQuestionPaper(formData).subscribe({
    next: (response: any) => {
      if (response.message === 'success') {
        this.showToast('Upload successful!');
        this.closeAddModal();
        this.ngOnInit();
      } else {
        this.showToast('Upload failed: ' + (response.message || 'Unknown error'));
      }
    },
    error: (err) => {
      this.showToast('Upload failed due to network/server error.');
      console.error(err);
    }
  });
}


// For tracking delete modal state
showDeleteModal: boolean = false;
selectedDeleteId: string | null = null;

// Called when delete button is clicked on a card
openDeleteModal(id: string): void {
  this.selectedDeleteId = id;
  this.showDeleteModal = true;
  document.body.classList.add('overflow-hidden'); // Prevent background scroll
}

// Cancel the delete
cancelDelete(): void {
  this.showDeleteModal = false;
  this.selectedDeleteId = null;
}

confirmDelete(): void {
  if (!this.selectedDeleteId) return;

  this.api.deleteQuestionPaper(this.selectedDeleteId).subscribe({
    next: (res: any) => {
      let message = typeof res === 'string' ? JSON.parse(res).message : res.message;

      if (message === 'success') {
        this.showToast('Paper deleted successfully.');
        this.showDeleteModal = false;
        this.selectedDeleteId = null;
        this.ngOnInit(); // Refresh data
      } else {
        this.showToast('Failed to delete the paper.');
      }
    },
    // error: (err) => {
    //   this.showToast('An error occurred during deletion.');
    //   console.error(err);
    // }
  });
}

toast = {
  visible: false,
  message: ''
};

showToast(message: string, duration: number = 3000): void {
  this.toast.message = message;
  this.toast.visible = true;

  setTimeout(() => {
    this.toast.visible = false;
  }, duration);
}


}
