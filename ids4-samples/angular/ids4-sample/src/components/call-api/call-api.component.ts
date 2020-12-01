import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EntityExample } from 'src/entities/example';
import { environment } from './../../environments/environment';

@Component({
  selector: 'app-call-api',
  templateUrl: './call-api.component.html',
  styleUrls: ['./call-api.component.scss'],
})
export class CallApiComponent implements OnInit {
  response: EntityExample;

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit() {
    let headers = new HttpHeaders({
      Authorization: this.authService.getAuthorizationHeaderValue(),
    });

    this.http
      .get(environment.serviceLink + 'api/home', { headers: headers })
      .subscribe((response: EntityExample) => {
        this.response = response;
      });
  }
}
