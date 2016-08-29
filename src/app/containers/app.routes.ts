import { AuthGuard } from '../shared';
import { App } from './app.container';
import { Routes } from '@angular/router';
import { DataResolver } from './app.resolver';
import { Login } from './login/login.container';
import { AdminContainer, HomeContainer } from './+admin';

export const ROUTES: Routes = [
  {
    path: '', children: [
      { path: '', component: Login },
      {
        path: 'admin',
        component: AdminContainer,
        canActivate: [AuthGuard],
        children: [
          { path: '', component: HomeContainer }
        ]
      }
    ]
  },
];
