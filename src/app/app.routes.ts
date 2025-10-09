import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { LayoutComponent } from './components/layout/layout.component';
import { AuthGuard, AdminGuard } from './guards/auth.guard';
import { LoginGuard } from './guards/login.guard';
import { TrainingsComponent } from './components/trainings/trainings.component';
import { LearningPathsComponent } from './components/learning-paths/learning-paths.component';
import { ScheduleComponent } from './components/schedule/schedule.component';
import { ReportsComponent } from './components/reports/reports.component';
import { CourseModuleViewerComponent } from './components/course-module-viewer/course-module-viewer.component';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
    { path: 'register', component: RegisterComponent },
    {
        path: '',
        component: LayoutComponent,
        canActivate: [AuthGuard],
        children: [
            { path: 'home', component: HomeComponent },
            { path: 'trainings', component: TrainingsComponent },
            { path: 'learning-paths', component: LearningPathsComponent },
            { path: 'schedule', component: ScheduleComponent },
            { path: 'reports', component: ReportsComponent, canActivate: [AdminGuard] },
            { path: 'course-viewer', component: CourseModuleViewerComponent },
            { path: '', redirectTo: '/home', pathMatch: 'full' }
        ]
    }
];