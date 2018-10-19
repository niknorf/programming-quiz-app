import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Observer } from 'rxjs';
import * as socketIo from 'socket.io-client';
import { URI } from './model/uri';

@Injectable()
export class SocketService {
  private uri: URI;
  constructor() {
    this.uri = URI['uri'];
  }

  private socket;

  public initSocket(): SocketIOClient.Socket {
    this.socket = socketIo(this.uri);
    return this.socket;
  }

  public emit(event: string, data, callback) {
    this.socket.emit(event, data, callback);
  }
}
