import { Component } from '@angular/core';
// import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EmployeesComponent } from './components/employees/employees.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, EmployeesComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'employees-app';
}
