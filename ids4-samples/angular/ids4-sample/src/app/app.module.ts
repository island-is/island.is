import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ProtectedComponent } from 'src/components/protected/protected.component';
import { AppRoutingModule } from './app-routing.module';
import { SigninOidcComponent } from 'src/components/signin-oidc/signin-oidc.component';

import { HttpClientModule } from '@angular/common/http';
import { CallApiComponent } from 'src/components/call-api/call-api.component';

@NgModule({
  declarations: [
    AppComponent,
    ProtectedComponent,
    SigninOidcComponent,
    CallApiComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
