import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-game-page',
  templateUrl: './game-page.component.html',
  styleUrls: ['./game-page.component.scss']
})
export class GamePageComponent implements OnInit {
  question = 'What is Dair\'s surname?';
  answer = 'Baidauletov';
  letters;

  constructor() { }

  ngOnInit() {
     this.letters = this.answer.split('');
  }

}
