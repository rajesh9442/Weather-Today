import { Component } from '@angular/core';
import { FormBuilder,FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  searchForm!: FormGroup;

  constructor(private fb: FormBuilder){}

  ngOnInit() {
    this.searchForm = this.fb.group({
      city:[null,Validators.required]
    })
  }

  searchWeather(){
    console.log(this.searchForm.value);

  }
}
