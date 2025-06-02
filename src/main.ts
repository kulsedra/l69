import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';

import { importProvidersFrom } from '@angular/core';
import { MarkdownModule } from 'ngx-markdown';
import { provideHttpClient } from '@angular/common/http';
import { AngularMarkdownEditorModule } from 'angular-markdown-editor';


bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(MarkdownModule.forRoot()),
    importProvidersFrom(
      AngularMarkdownEditorModule.forRoot({
        iconlibrary: 'fa',
        resize: 'vertical',
        language: 'en'
      })
    )
  ],
});
