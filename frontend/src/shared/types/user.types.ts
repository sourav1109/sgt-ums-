/**
 * User-related Type Definitions
 */

import type { Nullable } from './api.types';

// Base User
export interface User {
  id: string;
  uid: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  displayName?: string;
  createdAt: string;
  updatedAt: string;
}

// User Roles
export type UserRole = 
  | 'faculty'
  | 'staff'
  | 'student'
  | 'admin'
  | 'drd_member'
  | 'drd_dean'
  | 'finance'
  | 'hr';

// Employee Details
export interface EmployeeDetails {
  id: string;
  empId: string;
  firstName: string;
  middleName: Nullable<string>;
  lastName: string;
  mobileNumber: string;
  designation: Nullable<string>;
  employeeCategory: EmployeeCategory;
  employeeType: EmployeeType;
  dateOfJoining: string;
  schoolId: Nullable<string>;
  departmentId: Nullable<string>;
  centralDepartmentId: Nullable<string>;
  school?: School;
  department?: Department;
  centralDepartment?: CentralDepartment;
}

export type EmployeeCategory = 'teaching' | 'non_teaching';
export type EmployeeType = 'permanent' | 'contractual' | 'visiting';

// User with Employee Details
export interface Employee extends User {
  employeeDetails: EmployeeDetails;
}

// Student Details
export interface StudentDetails {
  id: string;
  rollNumber: string;
  firstName: string;
  middleName: Nullable<string>;
  lastName: string;
  mobileNumber: string;
  programId: string;
  sectionId: Nullable<string>;
  batchYear: number;
  program?: Program;
  section?: Section;
}

// User with Student Details
export interface Student extends User {
  studentDetails: StudentDetails;
}

// School
export interface School {
  id: string;
  name: string;
  code: string;
  shortName: Nullable<string>;
  isActive: boolean;
  departments?: Department[];
  createdAt: string;
  updatedAt: string;
}

// Department
export interface Department {
  id: string;
  name: string;
  code: string;
  schoolId: string;
  isActive: boolean;
  school?: School;
  createdAt: string;
  updatedAt: string;
}

// Central Department (for DRD, HR, Finance, etc.)
export interface CentralDepartment {
  id: string;
  name: string;
  code: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Program
export interface Program {
  id: string;
  name: string;
  code: string;
  duration: number;
  schoolId: string;
  isActive: boolean;
  school?: School;
  sections?: Section[];
}

// Section
export interface Section {
  id: string;
  name: string;
  programId: string;
  batchYear: number;
  isActive: boolean;
}

// Permission
export interface Permission {
  key: string;
  label: string;
  category: string;
  description?: string;
}

// User Permissions
export interface UserPermissions {
  userId: string;
  permissions: string[];
  role: UserRole;
}

// Auth User (returned from /auth/me)
export interface AuthUser extends User {
  employeeDetails?: EmployeeDetails;
  studentDetails?: StudentDetails;
  permissions?: string[];
}

// User Suggestion (for autocomplete)
export interface UserSuggestion {
  id: string;
  uid: string;
  displayName: string;
  email: string;
  role: UserRole;
  department?: string;
  school?: string;
}

// Form data types for creating/updating users
export interface CreateEmployeeFormData {
  uid: string;
  email: string;
  password: string;
  role: UserRole;
  empId: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth?: string;
  gender?: string;
  mobileNumber: string;
  alternateNumber?: string;
  personalEmail?: string;
  designation?: string;
  employeeCategory: EmployeeCategory;
  employeeType: EmployeeType;
  dateOfJoining: string;
  schoolId?: string;
  departmentId?: string;
  centralDepartmentId?: string;
  currentAddress?: string;
  permanentAddress?: string;
}

export interface CreateStudentFormData {
  uid: string;
  email: string;
  password: string;
  rollNumber: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  mobileNumber: string;
  programId: string;
  sectionId?: string;
  batchYear: number;
}
