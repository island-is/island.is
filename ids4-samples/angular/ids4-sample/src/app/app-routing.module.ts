import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CallApiComponent } from 'src/components/call-api/call-api.component';
import { ProtectedComponent } from 'src/components/protected/protected.component';
import { SigninOidcComponent } from 'src/components/signin-oidc/signin-oidc.component';
import { AuthGuardService } from 'src/services/auth-guard.service';
import { AuthService } from 'src/services/auth.service';

const routes: Routes = [
  {
    path: '',
    children: [],
  },
  {
    path: 'protected',
    component: ProtectedComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'signin-oidc',
    component: SigninOidcComponent,
  },
  {
    path: 'call-api',
    component: CallApiComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuardService, AuthService]
})
export class AppRoutingModule {}
