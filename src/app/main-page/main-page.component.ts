import { Component, OnInit, Input } from '@angular/core';
import { Room } from '../room';
import { SocketService } from '../socket.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {
  roomName: Room['name'];

  constructor(private _socket: SocketService) {}
  ngOnInit() {}

  // get value of input
  @Input()
  get room() {
    return this.roomName;
  }

  openRoom(room) {
    console.log('Do something when room is opened');
  }

  closeRoom() {
    console.log('Do something when room is closed');
  }

  createRoom(room) {
    this.roomName = room;

    if (!room) return alert('Please add new name');

    console.log(this.roomName, this._socket);

    this._socket.emit('createRoom', this.roomName, function(data) {
      console.log(data);

      if (data.type === 'Abort') {
        return alert('Error: ' + data.reason);
      }

      if (data.type === 'Ok') {
        this.openRoom(data.room);
      }
    });
  }

  joinRoom(room) {
    this._socket.emit('joinRoom', room, function(data) {
      if (data.type === 'Abort') {
        return alert('Error: ' + data.reason);
      }

      if (data.type === 'Ok') {
        this.openRoom(data.room);
      }
    });
  }

  leaveRoom(room) {
    this._socket.emit('leaveRoom', room, function(data) {
      if (data.type === 'Ok') {
        this.closeRoom();
      }
    });
  }
}
