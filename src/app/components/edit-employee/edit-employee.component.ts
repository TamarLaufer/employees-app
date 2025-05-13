import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, Inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { Employee } from '../../models/employee.model';

@Component({
  selector: 'app-edit-employee',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './edit-employee.component.html',
  styleUrls: ['./edit-employee.component.css'],
})
export class EditEmployeeComponent {
  employee: Partial<Employee>;
  mode: 'add' | 'edit' = 'add';

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      employee: Employee;
      allEmployees: Employee[];
      mode: 'add' | 'edit';
    },
    private dialogRef: MatDialogRef<EditEmployeeComponent>
  ) {
    this.employee = { ...data.employee };
    this.mode = data.mode;
  }

  save(): void {
    this.dialogRef.close(this.employee);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
