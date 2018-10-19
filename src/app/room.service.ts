import { Injectable } from '@angular/core';
import { SocketService } from './socket.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Room } from './room';
import { Http, Response } from '@angular/http';
import { URI } from './model/uri';
import { SocketRoom } from './socketRoom';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  // socket: SocketService;
  socketRoom = SocketRoom;

  rooms: Observable<Room[]>;
  private _rooms: BehaviorSubject<Room[]>;
  private uri: URI;

  private dataStore: {
    rooms: Room[];
  };

  constructor(private http: Http) {
    this.dataStore = { rooms: [] };
    this._rooms = <BehaviorSubject<Room[]>>new BehaviorSubject([]);
    this.rooms = this._rooms.asObservable();
    this.uri = URI['uri'];
  }

  getRooms() {
    return this.http.get(`${this.uri}/api/rooms`).subscribe(
      (data: any) => {
        this.dataStore.rooms = data;
        this._rooms.next(Object.assign({}, this.dataStore).rooms);
      },
      error => console.log('Could not load rooms.')
    );
  }

  addRoom(room) {
    this.socketRoom.push(room);
    // this.dataStore.rooms.push({ name: 'asd', category: 'hehe' });
    // this._rooms.next(Object.assign({}, this.dataStore).rooms);
  }
}
