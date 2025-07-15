import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface Course {
  id: number;
  department: string;
  name: string;
  specialization: string;
  displayName: string;
  icon: string;
}

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent {
  showLogoutModal = false;
  allCourses: Course[] = [
    // Computer Science Department
    { id: 1, department: 'Computer Science', name: 'BCA', specialization: 'General', displayName: 'BCA General', icon: 'https://cdn-icons-png.flaticon.com/512/11532/11532661.png' },
    { id: 2, department: 'Computer Science', name: 'BCA', specialization: 'Analytics', displayName: 'BCA Analytics', icon: 'https://cdn-icons-png.freepik.com/512/12489/12489637.png' },
    { id: 3, department: 'Computer Science', name: 'BCA', specialization: 'Cloud Computing', displayName: 'BCA Cloud Computing', icon: 'https://cdn-icons-png.flaticon.com/512/4215/4215831.png' },
    { id: 4, department: 'Computer Science', name: 'BCA', specialization: 'Cyber Security', displayName: 'BCA Cyber Security', icon: 'https://cdn-icons-png.flaticon.com/512/8522/8522214.png' },
    { id: 5, department: 'Computer Science', name: 'BCA', specialization: 'IoT', displayName: 'BCA IoT', icon: 'https://cdn-icons-png.flaticon.com/512/9780/9780690.png' },
    { id: 6, department: 'Computer Science', name: 'B.Sc', specialization: 'Data Science', displayName: 'B.Sc Data Science', icon: 'https://cdn-icons-png.flaticon.com/512/4824/4824797.png' },
    
    // Life Science Department
    { id: 7, department: 'Life Science', name: 'B.Sc', specialization: 'Biotechnology,Genetics, Biochemistry', displayName: 'B.Sc (Biotech, Genetics, Biochem)', icon: 'https://cdn-icons-png.flaticon.com/512/4157/4157959.png' },
    { id: 8, department: 'Life Science', name: 'B.Sc', specialization: 'Microbiology,Genetics, Biochemistry', displayName: 'B.Sc (Microbio, Genetics, Biochem)', icon: 'https://cdn-icons-png.flaticon.com/512/8853/8853027.png' },
    { id: 9, department: 'Life Science', name: 'B.Sc', specialization: 'Botany, Biotechnology, Biochemistry', displayName: 'B.Sc (Botany, Biotech, Biochem)', icon: 'https://cdn-icons-png.flaticon.com/512/4178/4178731.png' },
    
    // Forensic Science Department
    { id: 10, department: 'Forensic Science', name: 'B.Sc', specialization: 'Forensic Science', displayName: 'B.Sc Forensic Science', icon: 'https://cdn-icons-png.flaticon.com/512/8859/8859014.png' },
    { id: 11, department: 'Forensic Science', name: 'B.Sc', specialization: 'Forensic Science, Criminology, Biochemistry', displayName: 'B.Sc (Forensic, Criminology, Biochem)', icon: 'https://cdn-icons-png.flaticon.com/512/4635/4635380.png' },
    { id: 12, department: 'Forensic Science', name: 'B.Sc', specialization: 'Biotechnology, Forensic Science, Biochemistry', displayName: 'B.Sc (Biotech, Forensic, Biochem)', icon: 'https://cdn-icons-png.flaticon.com/512/6167/6167175.png' }
  ];

  filteredCourses: Course[] = this.allCourses;
  departments: string[] = ['All Departments', 'Computer Science', 'Life Science', 'Forensic Science'];
  courses: {value: string, display: string}[] = [];
  selectedDepartment: string = 'All Departments';
  selectedCourse: string = 'All Courses';

  constructor(private router: Router) {
    this.updateCourseOptions();
  }

  updateCourseOptions(): void {
    if (this.selectedDepartment === 'All Departments') {
      this.courses = [{value: 'All Courses', display: 'All Courses'}];
    } else {
      const deptCourses = this.allCourses
        .filter(course => course.department === this.selectedDepartment)
        .map(course => ({
          value: course.displayName,
          display: course.displayName
        }));
      
      this.courses = [
        {value: 'All Courses', display: 'All Courses'},
        ...deptCourses
      ];
    }
    this.selectedCourse = 'All Courses';
  }

  applyFilters(): void {
    this.filteredCourses = this.allCourses.filter(course => {
      const departmentMatch = this.selectedDepartment === 'All Departments' || 
                            course.department === this.selectedDepartment;
      const courseMatch = this.selectedCourse === 'All Courses' || 
                         course.displayName === this.selectedCourse;
      return departmentMatch && courseMatch;
    });
  }

  resetFilters(): void {
    this.selectedDepartment = 'All Departments';
    this.selectedCourse = 'All Courses';
    this.filteredCourses = this.allCourses;
    this.updateCourseOptions();
  }

  getCoursesByDepartment(department: string): Course[] {
    return this.filteredCourses.filter(course => course.department === department);
  }

  hasDepartmentCourses(department: string): boolean {
    return this.filteredCourses.some(course => course.department === department);
  }

  viewQuestionPapers(course: Course): void {
    this.router.navigate(['/questionpaper', course.id]);
  }


 email: string = '';

  ngOnInit(): void {
    // ✅ Get email from sessionStorage
    this.email = sessionStorage.getItem('email') || '';
  }

  
  confirmLogout(): void {
    sessionStorage.clear(); // or localStorage.clear() if used
    this.router.navigate(['/login']);
  }

  cancelLogout(): void {
    this.showLogoutModal = false;
  }
  showLogout(): void {
    this.showLogoutModal = true;
  }

}