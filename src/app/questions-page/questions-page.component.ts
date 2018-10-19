import { Component, OnInit } from '@angular/core';
import { Question } from '../question';
// import { URI } from '../model/uri';
import { Http, Response } from '@angular/http';

@Component({
  selector: 'app-questions-page',
  templateUrl: './questions-page.component.html',
  styleUrls: ['./questions-page.component.scss']
})
export class QuestionsPageComponent implements OnInit {
  question: string;
  answer: string;

  constructor(
    private http: Http,
    // private uri: URI
  ) {}

  ngOnInit() {}

  insertQuestion(): Promise<void> | Question {
    if (this.question && this.answer) {
      return this.http
        .post(`http://localhost:2112/api/question`, {question: this.question, answer: this.answer})
        .toPromise()
        .then(response => console.log(response.json()))
        .catch();
    }
  }
}
