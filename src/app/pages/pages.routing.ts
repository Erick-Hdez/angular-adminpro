import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Grafica1Component } from './grafica1/grafica1.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { PromesasComponent } from './promesas/promesas.component';
import { RxjsComponent } from './rxjs/rxjs.component';
import { AuthGuard } from '../guards/auth.guard';
import { PerfilComponent } from './perfil/perfil.component';
import { UsuariosComponent } from './mantenimientos/usuarios/usuarios.component';
import { HospitalesComponent } from './mantenimientos/hospitales/hospitales.component';
import { MedicosComponent } from './mantenimientos/medicos/medicos.component';
import { MedicoComponent } from './mantenimientos/medicos/medico.component';
import { BusquedaComponent } from './busqueda/busqueda.component';
import { AdminGuard } from '../guards/admin.guard';

const routes: Routes = [
    {
        path: 'dashboard',
        component: PagesComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                component: DashboardComponent,
                data: { title: 'Dashboard'}
            },
            {
                path: 'progress',
                component: ProgressComponent,
                data: { title: 'ProgressBar'}
            },
            {
                path: 'grafica1',
                component: Grafica1Component,
                data: { title: 'Gráfica #1'}
            },
            {
                path: 'account-settings',
                component: AccountSettingsComponent,
                data: { title: 'Account Settings'}
            },
            {
                path: 'buscar/:termino',
                component: BusquedaComponent,
                data: { title: 'Busquedas'}
            },
            {
                path: 'promesas',
                component: PromesasComponent,
                data: { title: 'Promises'}
            },
            {
                path: 'rxjs',
                component: RxjsComponent,
                data: { title: 'RxJs'}
            },
            {
                path: 'profile',
                component: PerfilComponent,
                data: { title: 'MyProfile'}
            },

            // MANTENIMIENTOS
            {
                path: 'hospitales',
                component: HospitalesComponent,
                data: { title: 'Mantenimiento de Hospitales'}
            },
            {
                path: 'medicos',
                component: MedicosComponent,
                data: { title: 'Mantenimiento de Médicos'}
            },
            {
                path: 'medico/:id',
                component: MedicoComponent,
                data: { title: 'Mantenimiento de Médicos'}
            },
            // RUTAS DE ADMIN
            {
                path: 'usuarios',
                canActivate: [AdminGuard],
                component: UsuariosComponent,
                data: { title: 'Mantenimiento de Usuarios'}
            },
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule {}
