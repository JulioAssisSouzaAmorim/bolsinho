import { mountApp } from './app.js';
import { createRepository } from './lib/storage.js';

mountApp({ root: document, repository: createRepository(window.localStorage) });
