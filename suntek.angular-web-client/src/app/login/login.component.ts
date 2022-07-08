import { Component, OnInit } from '@angular/core';
import { LoginService } from '@core/services/login.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { User } from '@shared/models/User.interface';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  form: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.maxLength(25), Validators.pattern(/^[A-Za-z\-_.]+$/)]),
    password: new FormControl('', [Validators.required])
  });
  constructor(private loginService: LoginService) {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  ngOnInit(): void {}

  login() {
    const user : User = this.form.value;
    this.loginService.login(user).subscribe(async res => {
      console.log(res);
    });
  }
}
