// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --configuration=dev` / `-c=dev then` `environment.dev.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
   url: 'http://dlowsap2.us1.avaya.com:9001/cops/itss',
  sso_signout: 'https://login-stg.avaya.com/sso/common/logout.jsp',
  sourceUrl: 'https://salescms-staging.avaya.com/customercare/en/public',
  captchaKey: '6LeXV78UAAAAACMI22q2YBE6hdbCN5rwzngN7MbB',
  snackBarConfig: {
    // duration: 10000,
    horizontalPosition: 'right',
    verticalPosition: 'bottom',
    panelClass: ''
  }
};
