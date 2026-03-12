# Application assets

One place to contain all assets used by the application system

Graphics are added as svg so they can be previewed in editors and IDEs and then there is a React component generated from the svg so that is can be used in applications.

## Add a new asset

1. Add your svg to `/institution-logos/svg`, `/institution-logos/municipalities/svg` or `/graphics/svg` depending on what type of asset you have
2. Run `yarn codegen`, that will create the svg logos as .tsx components
3. Add export to `/institurion-logos/index.ts` or `/graphics/index.ts` depending on where the the svg was added
