import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-game-page',
  templateUrl: './game-page.component.html',
  styleUrls: ['./game-page.component.scss']
})
export class GamePageComponent implements OnInit {
  question: string;
  result: any;
  answer: any;
  guess: string;
  correctGuesses: Array<string> = [];


  constructor() { }

  ngOnInit() {
    this.initializeGame();
  }

  initializeGame() {
    $('.input-wrapper').removeClass('success');

    this.question = 'What is Dair\'s surname?';
    this.answer = 'tre';

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
}
