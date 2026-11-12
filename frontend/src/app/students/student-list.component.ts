import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Student } from '../models/student';
import { StudentService } from '../services/student.service';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="row">
      <h2>Students</h2>
      <a class="btn btn-primary" routerLink="/students/new">+ Add Student</a>
    </div>

    @if (error()) {
      <p class="error">{{ error() }}</p>
    }
    @if (loading()) {
      <p>Loading...</p>
    } @else if (students().length === 0) {
      <p>No students yet. Click "Add Student" to get started.</p>
    } @else {
      <table>
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>Email</th><th>Course</th><th>Phone</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          @for (s of students(); track s.id) {
            <tr>
              <td>{{ s.id }}</td>
              <td>{{ s.name }}</td>
              <td>{{ s.email }}</td>
              <td>{{ s.course }}</td>
              <td>{{ s.phone }}</td>
              <td>
                <a class="btn btn-edit" [routerLink]="['/students', s.id, 'edit']">Edit</a>
                <button class="btn btn-delete" (click)="delete(s)">Delete</button>
              </td>
            </tr>
          }
        </tbody>
      </table>
    }
  `
})
export class StudentListComponent implements OnInit {
  private service = inject(StudentService);

  students = signal<Student[]>([]);
  loading = signal(true);
  error = signal('');

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.service.getAll().subscribe({
      next: (data) => {
        this.students.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Could not load students. Is the backend running?');
        this.loading.set(false);
      }
    });
  }

  delete(student: Student): void {
    if (student.id === undefined || !confirm(`Delete ${student.name}?`)) {
      return;
    }
    this.service.delete(student.id).subscribe({
      next: () => this.students.update((list) => list.filter((s) => s.id !== student.id)),
      error: () => this.error.set('Delete failed. Please try again.')
    });
  }
}
