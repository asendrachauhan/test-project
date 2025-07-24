import { Routes } from '@angular/router';

export const routes: Routes = [

  {path: '',
    loadComponent: () => import('./components/chat-room/chat-room').then(m => m.ChatRoom)
  },
];
