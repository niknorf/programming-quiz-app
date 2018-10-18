import { Component, OnInit, Input } from '@angular/core';
import { Room } from '../room';
import { SocketService } from '../socket.service';

export interface SampleElement {
  name: string;
  position: number;
  category: string;
}

const ELEMENT_DATA: SampleElement[] = [
  {position: 1, name: 'Routing', category: 'Angular'},
  {position: 2, name: 'Store setup', category: 'Magento'},
  {position: 3, name: 'React basics', category: 'React'},
  {position: 4, name: 'Module creation', category: 'Magento'},
  {position: 5, name: 'PHP: Best practices', category: 'PHP',},
];

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})

export class MainPageComponent implements OnInit {
  roomName: Room['name'];

  displayedColumns: string[] = ['position', 'category', 'name', 'actions'];
  dataSource = ELEMENT_DATA;

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

    this._socket.emit('createRoom', this.roomName, data => {
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
    this._socket.emit('joinRoom', room, data => {
      if (data.type === 'Abort') {
        return alert('Error: ' + data.reason);
      }

      if (data.type === 'Ok') {
        this.openRoom(data.room);
      }
    });
  }

  leaveRoom(room) {
    this._socket.emit('leaveRoom', room, data => {
      if (data.type === 'Ok') {
        this.closeRoom();
      }
    });
  }
}
