# API

To create a new domain, run:

`yarn nx g @nx/nest:library libs/api/domains/<name> --name=api-domains-<name> --importPath=@island.is/api/domains/<name> --tags=lib:api,scope:api --linter=eslint --unitTestRunner=jest`

Then revert the generator's `package.json`/`yarn.lock` changes, add the folder to `.github/CODEOWNERS`, and register the module in `apps/api/src/app/app.module.ts`.
