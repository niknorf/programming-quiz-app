import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Observer } from 'rxjs';
import * as socketIo from 'socket.io-client';

const url = 'https://programming-quiz-app.herokuapp.com';

@Injectable()
export class SocketService {
  constructor() {}

  private socket;

  public initSocket(): SocketIOClient.Socket {
    this.socket = socketIo(url);
    return this.socket;
  }

  public emit(event: string, data, callback) {
    this.socket.emit(event, data, callback);
  }

  public getSocketId() {
    return this.socket.id;
  }
}
