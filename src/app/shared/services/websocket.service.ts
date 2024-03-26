import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private sockets: { [endpoint: string]: WebSocketSubject<any> } = {};

  constructor() {}

  private getBaseUrl(): string {
    return `${environment.WEBSOCKET_URL}`;
  }

  public connect(endpoint: string): void {
    if (!this.sockets[endpoint]) {
      this.sockets[endpoint] = webSocket(`${this.getBaseUrl()}/${endpoint}`);
    }
  }

  public listen(endpoint: string): Observable<any> {
    if (!this.sockets[endpoint]) {
      throw new Error(`WebSocket ${endpoint} not connected.`);
    }
    return this.sockets[endpoint].asObservable();
  }

  public send(endpoint: string, message: any): void {
    if (!this.sockets[endpoint]) {
      throw new Error(`WebSocket ${endpoint} not connected.`);
    }
    this.sockets[endpoint].next(message);
  }

  public close(endpoint: string): void {
    if (!this.sockets[endpoint]) {
      throw new Error(`WebSocket ${endpoint} not connected.`);
    }
    this.sockets[endpoint].complete();
    delete this.sockets[endpoint];
  }

  public closeAll(): void {
    Object.values(this.sockets).forEach((socket) => {
      socket.complete();
    });
    this.sockets = {};
  }
}
