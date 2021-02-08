// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=test` then `environment.test.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  url: 'https://sales-staging.avaya.com/cops/itss',
  sso_signout: 'https://login-stg.avaya.com/sso/common/logout.jsp',
  sourceUrl: 'https://sales-staging.avaya.com/customercare/en/public',
  captchaKey: '6LdtV78UAAAAAMTMKL0enk_taEgBKcRf2YEmvBMH',
  snackBarConfig: {
    // duration: 10000,
    horizontalPosition: 'right',
    verticalPosition: 'bottom',
    panelClass: ''
  }
};
