import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-questions-page',
  templateUrl: './questions-page.component.html',
  styleUrls: ['./questions-page.component.scss']
})
export class QuestionsPageComponent implements OnInit {
  question: string;
  answer: string;

  constructor() {}

  ngOnInit() {}
}
