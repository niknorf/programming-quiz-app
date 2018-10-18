import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Observer } from 'rxjs';
import * as socketIo from 'socket.io-client';

const url = 'http://localhost:2112';

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
}
