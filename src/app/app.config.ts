import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC5NOumB8NTtdFLjzce6b44W3hFD8WjIVk",
  authDomain: "ai-engine-auth.firebaseapp.com",
  projectId: "ai-engine-auth",
  storageBucket: "ai-engine-auth.firebasestorage.app",
  messagingSenderId: "375479082951",
  appId: "1:375479082951:web:7c7054234d38e256e983e2"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore())
  ]
};
