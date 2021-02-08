import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PublicComponent } from './common/components/public-page/public/public.component';
//import { WelcomeComponent } from './common/components/welcome/welcome.component';
const routes: Routes = [
  { path: 'cops', loadChildren: './modules/customer-care/customer-care.module#CustomerCareModule' },
  { path: 'en/public', component: PublicComponent },
  //{ path: 'en/welcome', component: WelcomeComponent }
];

@NgModule({
  // imports: [RouterModule.forRoot(routes, { enableTracing: true })],
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled' , onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
