import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LayoutComponent} from "./layout/layout.component";
import {CreacionComponent} from "./createDiccionario/creacion/creacion.component";
import {ComoUsarComponent} from "./como-usar/como-usar.component";

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: CreacionComponent
      },{
        path: 'comoUsar',
        component:ComoUsarComponent
      }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
