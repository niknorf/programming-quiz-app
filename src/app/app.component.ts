import { Component } from '@angular/core';
import { SocketService } from './socket.service';
import { ElementHelperService } from './element-helper.service';
import * as $ from 'jquery';
import { RoomService } from './room.service';
import { Room } from './room';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [SocketService]
})
export class AppComponent {
  title = 'quiz';

  socket: SocketIOClient.Socket;

  constructor(
    private socketService: SocketService,
    private elementHelper: ElementHelperService,
    private roomService: RoomService
  ) {}

  ngOnInit() {
    this.initIoConnection();
    this.roomService.getRooms();
  }

  private initIoConnection(): void {
    this.socket = this.socketService.initSocket();

    this.socket.on('connect', () => {
      console.log(this.socket.id + ' has joined');

      this.socket.emit('rooms', data => {
        console.log(data);
        this.roomService.addRoom(data.rooms);
      });
    });

    this.socket.on('disconnect', () => {
      console.log(this.socket.id + ' has leaved');
    });

    // handler for socket input

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
