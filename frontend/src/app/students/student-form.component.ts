import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { StudentService } from '../services/student.service';

@Component({
  selector: 'app-student-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <h2>{{ isEdit() ? 'Edit Student' : 'Add Student' }}</h2>

    <form [formGroup]="form" (ngSubmit)="save()">
      <label>Name
        <input formControlName="name" />
      </label>
      @if (form.controls.name.touched && form.controls.name.invalid) {
        <small class="error">Name is required (max 100 characters)</small>
      }

      <label>Email
        <input formControlName="email" />
      </label>
      @if (form.controls.email.touched && form.controls.email.invalid) {
        <small class="error">Enter a valid email address</small>
      }

      <label>Course
        <input formControlName="course" />
      </label>
      @if (form.controls.course.touched && form.controls.course.invalid) {
        <small class="error">Course is required</small>
      }

      <label>Phone
        <input formControlName="phone" />
      </label>

      @if (serverError()) {
        <p class="error">{{ serverError() }}</p>
      }

      <button class="btn btn-primary" type="submit" [disabled]="form.invalid || saving()">
        {{ saving() ? 'Saving...' : 'Save' }}
      </button>
      <a class="btn" routerLink="/students">Cancel</a>
    </form>
  `
})
export class StudentFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private service = inject(StudentService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  isEdit = signal(false);
  saving = signal(false);
  serverError = signal('');
  private studentId: number | null = null;

  form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email]],
    course: ['', [Validators.required]],
    phone: ['']
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.studentId = Number(idParam);
      this.isEdit.set(true);
      this.service.getById(this.studentId).subscribe((s) => {
        this.form.patchValue({
          name: s.name,
          email: s.email,
          course: s.course,
          phone: s.phone ?? ''
        });
      });
    }
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    this.serverError.set('');

    const data = this.form.getRawValue();
    const request = this.studentId !== null
      ? this.service.update(this.studentId, data)
      : this.service.create(data);

    request.subscribe({
      next: () => this.router.navigate(['/students']),
      error: (err) => {
        this.saving.set(false);
        this.serverError.set(
          err.status === 409
            ? 'This email is already registered.'
            : 'Save failed. Please check the fields and try again.'
        );
      }
    });
  }
}
