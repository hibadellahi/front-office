import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App} from './app/app';

// Ajout de la locale française
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';

registerLocaleData(localeFr);

// Forcer la locale française partout dans l'app
appConfig.providers.push({ provide: LOCALE_ID, useValue: 'fr-FR' });

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));