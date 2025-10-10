import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CourseManagementComponent } from './course-management.component';

@NgModule({
  declarations: [
    CourseManagementComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    CourseManagementComponent
  ]
})
export class CourseManagementModule { }