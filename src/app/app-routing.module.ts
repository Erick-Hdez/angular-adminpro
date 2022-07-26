import { NgModule } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";

// Modules
import { PagesRoutingModule } from './pages/pages.routing';
import { AuthRoutingModule } from './auth/auth.routing';

// Components
import { NotpagefoundComponent } from './notpagefound/notpagefound.component';

const routes: Routes = [
  // path: '/dashboard' --> PagesRoutingModule
  // path: '/auth' --> AuthRoutingModule
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: '**',
    component: NotpagefoundComponent
  }
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes),
    AuthRoutingModule,
    PagesRoutingModule
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
