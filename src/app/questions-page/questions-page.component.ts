import { Component, OnInit } from '@angular/core';
import * as socketIo from 'socket.io-client';
import { ElementHelperService } from '../element-helper.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-questions-page',
  templateUrl: './questions-page.component.html',
  styleUrls: ['./questions-page.component.scss']
})
export class QuestionsPageComponent implements OnInit {
  socket: SocketIOClient.Socket;

  constructor(private elementHelper: ElementHelperService) {
    socketIo();
    this.socket = socketIo();
    console.log('123');
    this.socket.on('connect', () => {
      console.log(this.socket.id + ' has joined');
    });
  }

  ngOnInit() {
    $(document).on('input', event => {
      let el = event.target,
        elValue = $(el).val();

      const location = this.elementHelper.elementLocation(el);
      this.socket.emit('inputChanged', {
        location,
        value: elValue
      });
    });

    this.socket.on('onInputChanged', data => {
      console.log(data);
      const el = this.elementHelper.findElement(data.inputData.location, null);
      $(el).val(data.inputData.value);
    });
  }
}
