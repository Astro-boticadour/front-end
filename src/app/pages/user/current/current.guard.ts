import { inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';
import { WebsocketService } from 'src/app/shared/services/websocket.service';

export const currentGuard: CanDeactivateFn<unknown> = () => {
  inject(WebsocketService).closeAll();
  return true;
};
