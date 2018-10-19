import { Component, OnInit } from '@angular/core';
import { Question } from '../question';
import { SocketService } from '../socket.service';
import { Http, Response } from '@angular/http';
import * as $ from 'jquery';

@Component({
  selector: 'app-game-page',
  templateUrl: './game-page.component.html',
  styleUrls: ['./game-page.component.scss']
})
export class GamePageComponent implements OnInit {
  questions: any;
  question: string;
  result: any;
  answer: any;
  guess: string;
  correctGuesses: Array<string> = [];
  room = '1234';

  constructor(
    private http: Http,
    private socket: SocketService
  ) { }

  ngOnInit() {
    this.getQuestions();
  }

  initializeGame() {
    $('.input-wrapper').removeClass('success');

    // this.question = 'What is Dair\'s name?';
    // this.answer = 'Dair';

    let questionSet = false;
    while (!questionSet) {
      let q = this.questions[Math.floor(Math.random() * this.questions.length)];
      if (q.question && q.answer) {
        this.question = q.question;
        this.answer = q.answer;
        questionSet = true;
      }
    }

    this.result = $('.result');
    this.result.find('>:first-child').html('Start guessing...');

    this.answer = this.answer.toUpperCase().split('');

    for ( let i = 0; i < this.answer.length; i ++ ) {
      this.correctGuesses.push('*');
    }
  }

  checkLetter() {
    let isCorrect = false;
    if (this.guess) {
      for ( let i = 0; i < this.answer.length; i ++ ) {
        if (this.guess.toUpperCase() === this.answer[i].toUpperCase()) {
          this.correctGuesses[i] = this.guess;
          isCorrect = true;
        }
      }

      this.socket.emit('inputChanged', {
        room: this.room,
        id: this.socket.getSocketId(),
        inputData: this.guess,
      }, data => {
        console.log(data);
      });

      this.guess = null;

      if (!isCorrect) {
        this.result.find('>:first-child').html('Wrong letter!');
      } else {
        this.result.find('>:first-child').html('Nice one!');
      }

      if (this.correctGuesses.join('').toUpperCase() === this.answer.join('').toUpperCase()) {
        this.wordIsGuessed();
      }
    }

    this.changeResultColor(isCorrect);
  }

  wordIsGuessed() {
    this.correctGuesses = [];
    this.result.find('>:first-child').html('The word is guessed!');
    $('.input-wrapper').addClass('success');
    $('.restart').addClass('show');
  }

  changeResultColor(s) {
    this.result.removeClass('correct wrong');
    if (s) {
      this.result.addClass('correct');
    } else {
      this.result.addClass('wrong');
    }
  }

getQuestions(): Promise<void | Question[]> {
    return this.http
      .get('https://programming-quiz-app.herokuapp.com/api/questions')
      .toPromise()
      .then(response => {
        console.log(response.json());
        this.questions = response.json();
        this.initializeGame();
      })
      .catch();
  }
}
