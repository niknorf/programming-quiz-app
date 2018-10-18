import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-game-page',
  templateUrl: './game-page.component.html',
  styleUrls: ['./game-page.component.scss']
})
export class GamePageComponent implements OnInit {
  question = 'What is Dair\'s surname?';
  result: any;
  answer: any = 'Baidauletov';
  guess: string;
  correctGuesses: Array<string> = [];


  constructor() { }

  ngOnInit() {
    this.result = $('.result');
    this.result.find('>:first-child').html('Start guessing...');

    this.answer = this.answer.toUpperCase().split('');

    for ( let i = 0; i < this.answer.length; i ++ ) {
      this.correctGuesses.push('*');
    }
  }

  checkLetter() {
    let isCorrect = false;
    for ( let i = 0; i < this.answer.length; i ++ ) {
      console.log(this.guess);
      if (this.guess.toUpperCase() === this.answer[i].toUpperCase()) {
        this.correctGuesses[i] = this.guess;
        isCorrect = true;

        if (this.correctGuesses.join('') === this.answer.join('')) {
          this.wordIsGuessed();
        }
      }
    }

    if (!isCorrect) {
      this.result.find('>:first-child').html('Wrong letter!');
    } else {
      this.result.find('>:first-child').html('Nice one!');
    }

    this.changeResultColor(isCorrect);
  }

  wordIsGuessed() {
    this.result.find('>:first-child').html('The word is guessed!');
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
