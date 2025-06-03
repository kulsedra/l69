import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { SubmitComponent } from './pages/submit/submit.component';
import { PostComponent } from './pages/post/post.component';
import { DeleteComponent } from './pages/post/delete/delete.component';
import { EditComponent } from './pages/post/edit/edit.component';
import { HistoryComponent } from './pages/history/history.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'home', component: HomeComponent },
    { path: 'about', component: AboutComponent },
    { path: 'submit', component: SubmitComponent },
    { path: 'history', component: HistoryComponent },
    { path: 'post/:id', component: PostComponent },
    { path: 'post/:id/delete', component: DeleteComponent },
    { path: 'post/:id/edit', component: EditComponent }
];