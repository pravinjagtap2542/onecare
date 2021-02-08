// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  url: 'http://localhost:4200/cs/cop/assets/data',
  sso_signout: 'https://login-stg.avaya.com/sso/common/logout.jsp',
  sourceUrl: 'https://onecare-staging.avaya.com/',
  captchaKey: '6LdtV78UAAAAAMTMKL0enk_taEgBKcRf2YEmvBMH',
  snackBarConfig: {
    duration: 5000,
    horizontalPosition: 'right',
    verticalPosition: 'bottom',
    panelClass: ''
  },
  username : "dev_test@avaya.com",
  password : "c36E!dFCqUjYvkbQ",
  fileScanUrl: "https://onecare-staging.avaya.com/ecm/file/scan",
};
