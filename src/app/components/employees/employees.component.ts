import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { EmployeeService } from '../../services/employee.service';
import { EditEmployeeComponent } from '../edit-employee/edit-employee.component';
import { Employee } from '../../models/employee.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
  ],
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css'],
})
export class EmployeesComponent implements OnInit {
  employees$!: Observable<Employee[]>;
  displayedColumns = ['id', 'name', 'phone', 'department', 'actions'];

  constructor(
    private dialog: MatDialog,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.employeeService.fetchEmployees().subscribe();
    this.employees$ = this.employeeService.employees$;
  }

  openEditDialog(employee: Employee): void {
    const dialogRef = this.dialog.open(EditEmployeeComponent, {
      data: {
        employee: { ...employee },
        allEmployees: this.employeeService.getCurrentEmployees(),
        mode: 'edit',
      },
    });

    dialogRef.afterClosed().subscribe((updatedEmployee) => {
      if (updatedEmployee) {
        this.employeeService.updateEmployee(updatedEmployee);
      }
    });
  }

  openAddDialog(): void {
    const newEmployee: Omit<Employee, 'id'> = {
      firstName: '',
      lastName: '',
      age: 0,
      phone: '',
      city: '',
      street: '',
      department: '',
    };

    const dialogRef = this.dialog.open(EditEmployeeComponent, {
      data: {
        employee: newEmployee,
        allEmployees: this.employeeService.getCurrentEmployees(),
        mode: 'add',
      },
    });

    dialogRef.afterClosed().subscribe((newEmp) => {
      if (newEmp) {
        this.employeeService.addEmployee(newEmp);
      }
    });
  }

  deleteEmployee(id: string): void {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.employeeService.deleteEmployee(id).subscribe(() => {
        const updatedEmployees = this.employeeService
          .getCurrentEmployees()
          .filter((emp) => emp.id !== id);

        this.employeeService.setEmployees(updatedEmployees);
      });
    }
  }
}
