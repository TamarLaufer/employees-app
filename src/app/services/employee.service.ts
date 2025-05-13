import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Employee } from '../models/employee.model';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private apiUrl = 'https://6821f259b342dce8004c78f8.mockapi.io/employees';

  private employeesSubject = new BehaviorSubject<Employee[]>([]);
  employees$ = this.employeesSubject.asObservable();

  constructor(private http: HttpClient) {}

  fetchEmployees(): Observable<Employee[]> {
    return this.http
      .get<Employee[]>(this.apiUrl)
      .pipe(tap((employees) => this.employeesSubject.next(employees)));
  }

  setEmployees(employees: Employee[]): void {
    this.employeesSubject.next(employees);
  }

  getCurrentEmployees(): Employee[] {
    return this.employeesSubject.value;
  }

  addEmployee(newEmployee: Omit<Employee, 'id'>): void {
    const current = this.employeesSubject.value;

    const isDuplicate = current.some(
      (emp) =>
        emp.firstName === newEmployee.firstName &&
        emp.lastName === newEmployee.lastName &&
        emp.department.toLowerCase() === newEmployee.department.toLowerCase()
    );

    if (isDuplicate) {
      console.warn('An employee with these details already exists.');
      return;
    }

    this.http
      .post<Employee>(this.apiUrl, newEmployee)
      .subscribe((savedEmployee) => {
        this.employeesSubject.next([...current, savedEmployee]);
      });
  }

  updateEmployee(updatedEmployee: Employee): void {
    const updated = this.employeesSubject.value.map((emp) =>
      emp.id === updatedEmployee.id ? updatedEmployee : emp
    );
    this.employeesSubject.next(updated);
    this.http
      .put(`${this.apiUrl}/${updatedEmployee.id}`, updatedEmployee)
      .subscribe();
  }

  deleteEmployee(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
