import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-signin-oidc',
  templateUrl: './signin-oidc.component.html',
  styleUrls: ['./signin-oidc.component.scss']
})
export class SigninOidcComponent implements OnInit {

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.authService.completeAuthentication();
  }

}
