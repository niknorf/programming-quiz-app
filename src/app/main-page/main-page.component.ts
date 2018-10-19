import { Component, OnInit, Input } from '@angular/core';
import { Room } from '../room';
import { SocketService } from '../socket.service';
import { Http, Response } from '@angular/http';

export interface SampleElement {
  name: string;
  position: number;
  category: string;
}

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {
  roomName: Room['name'];

  displayedColumns: string[] = ['position', 'category', 'name', 'actions'];
  dataSource;
  private currentRow;

  constructor(private _socket: SocketService, private http: Http) {}
  ngOnInit() {
    this.getRooms();
  }

  // get value of input
  @Input()
  get room() {
    return this.roomName;
  }

  getRooms(): Promise<void | Room[]> {
    return this.http
      .get('http://localhost:2112/api/rooms')
      .toPromise()
      .then(response => {
        console.log(response.json());
        this.dataSource = response.json();
      })
      .catch();
  }

  rowClicked(row: any): void {
    this.currentRow = row;
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
    this.roomName = room;

    if (!room) return alert('Please add new name');

    console.log(this.roomName, this._socket);

    this._socket.emit('joinRoom', room, data => {
      console.log(data);
      if (data.type === 'Abort') {
        return alert('Error: ' + data.reason);
      }

      if (data.type === 'Ok') {
        console.log(`joined ${room}`);
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
