import { Component } from '@angular/core';
import {MatTableDataSource} from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  displayedColumns = ['position', 'name', 'gender', 'age'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
}

export interface Element {
  name: string;
  position: number;
  gender: string;
  age: number;
}

const ELEMENT_DATA: Element[] = [
  {position: 1, name: 'Bill Smith', gender: 'Male', age: 70},
  {position: 2, name: 'Helen Baker', gender: 'Female', age: 75},
  {position: 3, name: 'Barbara Montross', gender: 'Female', age: 82},
  {position: 4, name: 'Juan Valderroso', gender: 'Male', age: 89},
  {position: 5, name: 'Beatrice Von Elrod', gender: 'Female', age: 78},
  {position: 6, name: 'Carl McNamara', gender: 'Male', age: 90},
  {position: 7, name: 'Nickola Rasputin', gender: 'Female', age: 91},
  {position: 8, name: 'Olivia Newtons', gender: 'Female', age: 77},
  {position: 9, name: 'Ollie McDonald', gender: 'Male', age: 84},
  {position: 10, name: 'Neon Sanders', gender: 'Male', age: 96},
  {position: 11, name: 'Laura Plante', gender: 'Female', age: 91},
  {position: 12, name: 'Hulk Hogan', gender: 'Male', age: 79},
  {position: 13, name: 'Randy Savages', gender: 'Male', age: 83},
  {position: 14, name: 'Florence Mendelson', gender: 'Female', age: 95},
  {position: 15, name: 'Gary Coalman', gender: 'Female', age: 89},
  {position: 16, name: 'Tom Hetty', gender: 'Male', age: 96},
  {position: 17, name: 'Miguella Jackson', gender: 'Female', age: 93},
  {position: 18, name: 'Aragona Nonna', gender: 'Female', age: 88},
  {position: 19, name: 'Danny Poteet', gender: 'Male', age: 84},
  {position: 20, name: 'Cal Pipken', gender: 'Male', age: 91},
];
