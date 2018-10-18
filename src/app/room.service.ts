import { Injectable } from '@angular/core';
import { SocketService } from './socket.service';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  socket: SocketService;

  constructor() {}
}
