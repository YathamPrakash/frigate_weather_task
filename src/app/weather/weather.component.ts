import { Component } from '@angular/core';
import { WeatherserviceService } from '../weatherservice.service';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss'],
  providers: [MessageService]
})
export class WeatherComponent {
  isSubmitted = false;
  currentWeather: any = "";
  forecast: any = [];
  checked = false;
  isLoading = false;
  userForm: any = FormGroup;
  units = 'metric'
  //imperial
  constructor(private weatherservice: WeatherserviceService,
    private message: MessageService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.userForm = this.fb.group({
      selectsearchparam: ["Location", Validators.required],
      userSearchLocation: ["", Validators.required],
      userLatitude: [""],
      userLongitue: [""]
    })
  }

  _doEmptySearch(event: any) {
    console.log(event.target.value, "eeeee")
    if (event.target.value == 'Geo Graphical Coordinates') {
      this.userForm.get('userLatitude').setValidators([Validators.required])
      this.userForm.get('userLongitue').setValidators([Validators.required])
      this.userForm.get('userSearchLocation')?.clearValidators();

    }
    else {
      this.userForm.get('userLatitude').clearValidators();
      this.userForm.get('userLongitue').clearValidators();
      this.userForm.get('userSearchLocation')?.setValidators([Validators.required])
    }
    // this.userForm.get('userLatitude').updateValueAndValidity();
    // this.userForm.get('userLatitude').updateValueAndValidity();
    // this.userForm.get('userSearchLocation')?.updateValueAndValidity();
    this.userForm.updateValueAndValidity();
    this.isSubmitted = false
    this.userForm.get('userSearchLocation').setValue("")
  }


  _doAtmosphereDetails(event: any) {
    console.log("gggg")
    console.log(this.userForm.get('selectsearchparam').value, "value");
    console.log(event.submitter.name, "value");
    if (event.submitter.name == 'reset') {
      this.isSubmitted = false;
      this.currentWeather = "";
      this.forecast = [];
      this.userForm.get('userSearchLocation').setValue("")
    }
    else {
      if (this.userForm.get('selectsearchparam').value == "Geo Graphical Coordinates") {
        this.isSubmitted = true;
        if (!this.userForm.valid) {
          return
        }
        else {
          this._doGetWeatheroncoordinate();
          this._doGetForecastDetails(this.userForm.get('userLatitude').value, this.userForm.get('userLongitue').value)
        }
      }

      else {
        this._doGetWeatherdetails()
      }
    }
  }


  _doGetWeatherdetails() {
    this.isSubmitted = true;
    if (!this.userForm.valid) {
      return
    }
    else {
      this.isLoading = true;
      this.weatherservice.getWeather(this.userForm.get('userSearchLocation').value, this.units).subscribe(data => {
        this.currentWeather = data;
        console.log(this.currentWeather, "data of the wearther")
        if (this.currentWeather != "") {
          this._doGetForecastDetails(this.currentWeather.coord.lat, this.currentWeather.coord.lon);
        }
      }, err => {
        this.isLoading = false;
        console.log(err, "error")
        this.message.add({ key: 'tr', severity: 'error', summary: 'Error', detail: err.error.message });
      });
    }
  }


  _doGetForecastDetails(lat: any, lon: any) {
    this.weatherservice.getForecast(lat, lon, this.units).subscribe(data => {
      let resultedData = data
      resultedData.list.forEach((element: any) => {
        element.Date = moment(element.dt_txt).format('YYYY-MM-DD')
      });
      this.forecast = resultedData.list.filter((ele: { Date: any; }, index: any, self: { Date: any; }[]) => index == self.findIndex((unique: { Date: any; }) => unique.Date == ele.Date))
      this.isLoading = false
    }, err => {
      console.log(err, "error")
      this.message.add({ key: 'tr', severity: 'error', summary: 'Error', detail: err.error.message });
      this.isLoading = false
    });
  }


  getWeatherIcon(icon: string): string {
    return `http://openweathermap.org/img/wn/${icon}.png`;
  }




  _doGetWeatheroncoordinate() {
    this.weatherservice.getWeatherbasedonCoordinates(this.userForm.get('userLatitude').value, this.userForm.get('userLongitue').value, this.units).subscribe(res => {
      console.log(res, "result of the data")
      this.currentWeather = res;
      this.isLoading = false
    }, err => {
      console.log(err, "error")
      this.message.add({ key: 'tr', severity: 'error', summary: 'Error', detail: err.error.message });
      this.isLoading = false
    });
  }


  onSwitchChange(event: any) {
    console.log(event, "ffffffff")
    this.units = this.units == 'metric' ? 'imperial' : 'metric';
    if (this.userForm.get('selectsearchparam').value == "Geo Graphical Coordinates") {
      this.isSubmitted = true;
      if (!this.userForm.valid) {
        return
      }
      else {
        this._doGetWeatheroncoordinate();
        this._doGetForecastDetails(this.userForm.get('userLatitude').value, this.userForm.get('userLongitue').value)
      }
    }

    else {
      this._doGetWeatherdetails()
    }
  }

}
