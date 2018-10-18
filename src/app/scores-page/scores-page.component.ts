import { Component, OnInit } from '@angular/core';

export interface SampleElement {
  name: string;
  place: number;
}

const ELEMENT_DATA: SampleElement[] = [
  {place: 1, name: 'Jade'},
  {place: 2, name: 'Michael'},
  {place: 3, name: 'Helen'},
  {place: 4, name: 'MLGn0Scope420'},
  {place: 5, name: 'test'},
];

@Component({
  selector: 'app-scores-page',
  templateUrl: './scores-page.component.html',
  styleUrls: ['./scores-page.component.scss']
})
export class ScoresPageComponent implements OnInit {

  displayedColumns: string[] = ['place', 'name'];
  dataSource = ELEMENT_DATA;

  constructor() { }

  ngOnInit() {
  }

}
