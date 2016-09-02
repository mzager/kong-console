// Angular 2
// rc2 workaround
import { Configurator } from '../app/shared';
import { enableProdMode, ExceptionHandler, ApplicationRef } from '@angular/core';
import { enableDebugTools, disableDebugTools } from '@angular/platform-browser';

// Environment Providers
let PROVIDERS = [
  // common providers
];

const CONFIG = new Configurator();

// Angular debug tools in the dev console
// https://github.com/angular/angular/blob/86405345b781a9dc2438c0fbe3e9409245647019/TOOLS_JS.md
let _decorateModuleRef = function identity(value) { return value; };

if ('production' === ENV) {
  // Production
  disableDebugTools();
  enableProdMode();

  CONFIG.setOption('ADAPTER', 'REST');
  CONFIG.setOption('ENVIRONMENT', 'PROD');
  CONFIG.setOption('API.URL', '');
  // CONFIG.setOption('API.ADMIN.URL', '');

  PROVIDERS = [
    ...PROVIDERS,
    { provide: Configurator, useValue: CONFIG }
    // custom providers in production
  ];

} else {

  _decorateModuleRef = (modRef: any) => {
    let appRef = modRef.injector.get(ApplicationRef);
    let cmpRef = appRef.components[0];

    let _ng = (<any>window).ng;
    enableDebugTools(cmpRef);
    (<any>window).ng.probe = _ng.probe;
    (<any>window).ng.coreTokens = _ng.coreTokens;
    return modRef;
  };

  CONFIG.setOption('ADAPTER', 'REST');
  CONFIG.setOption('ENVIRONMENT', 'DEV');
  CONFIG.setOption('API.URL', 'http://192.168.99.100:8000/kong');
  // CONFIG.setOption('API.ADMIN.URL', 'http://192.168.99.100:8000/kong');

  // Development
  PROVIDERS = [
    ...PROVIDERS,
    { provide: Configurator, useValue: CONFIG }
    // custom providers in development
  ];

}

export const decorateModuleRef = _decorateModuleRef;

export const ENV_PROVIDERS = [
  ...PROVIDERS
];