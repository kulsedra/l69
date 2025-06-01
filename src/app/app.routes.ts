import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { SubmitComponent } from './pages/submit/submit.component';
import { PostComponent } from './pages/post/post.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'home', component: HomeComponent },
    { path: 'about', component: AboutComponent },
    { path: 'submit', component: SubmitComponent },
    { path: 'post/:id', component: PostComponent}
];