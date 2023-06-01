import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { DataTablesModule } from 'angular-datatables'
import { NgbModule} from '@ng-bootstrap/ng-bootstrap'
import { ToastrModule } from 'ngx-toastr';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SideBarComponent } from './components/layout/side-bar/side-bar.component';
import { FooterComponent } from './components/layout/footer/footer.component';
import { MenuBarComponent } from './components/layout/menu-bar/menu-bar.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { BreadcrumbComponent } from './components/layout/breadcrumb/breadcrumb.component';
import { EmployeesComponent } from './components/employees/employees.component';
import { AddEmployeeComponent } from './components/employees/add-employee/add-employee.component';
import { PostingsComponent } from './components/postings/postings.component';
import { AddPostingComponent } from './components/postings/add-posting/add-posting.component';
import { PromotionsComponent } from './components/promotions/promotions.component';
import { AddPromotionComponent } from './components/promotions/add-promotion/add-promotion.component';
import { UnitsComponent } from './components/units/units.component';
import { AddUnitComponent } from './components/units/add-unit/add-unit.component';
import { UsersComponent } from './components/users/users.component';
import { AddUserComponent } from './components/users/add-user/add-user.component';
import { ManageUsersComponent } from './components/users/manage-users/manage-users.component';
import { EditUserComponent } from './components/users/edit-user/edit-user.component';
import { ManageUnitsComponent } from './components/units/manage-units/manage-units.component';
import { ManagePostingsComponent } from './components/postings/manage-postings/manage-postings.component';
import { ManageEmployeesComponent } from './components/employees/manage-employees/manage-employees.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';

@NgModule({
  declarations: [
    AppComponent,
    SideBarComponent,
    FooterComponent,
    MenuBarComponent,
    DashboardComponent,
    BreadcrumbComponent,
    EmployeesComponent,
    AddEmployeeComponent,
    PostingsComponent,
    AddPostingComponent,
    PromotionsComponent,
    AddPromotionComponent,
    UnitsComponent,
    AddUnitComponent,
    UsersComponent,
    AddUserComponent,
    ManageUsersComponent,
    EditUserComponent,
    ManageUnitsComponent,
    ManagePostingsComponent,
    ManageEmployeesComponent,
    LoginComponent,
    ProfileComponent,
    ChangePasswordComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    DataTablesModule,
    NgbModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot()
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
