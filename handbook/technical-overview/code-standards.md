# Code standards

We use [Prettier](https://prettier.io/) and [ESLint](https://eslint.org/) to automatically enforce most of our Code Standards. Most of our rules follow recommendations from both project with these additions and changes:

- Prettier is configured with single quotes, no semicolons, arrow parens and all trailing commas.
- ESLint is configured to catch likely errors but otherwise provide warnings to encourage best practices without stopping the developer.The base configuration comes from [NX](https://nx.dev/).

Code standard changes can be proposed to the larger team in discipline meetings. For any new rule, we should try to enforce it automatically, even if it means creating a new ESLint rule from scratch.

## Language

All code, documentation and API interfaces should be written in British English. This makes the project more inclusive, and reduces awkward mixing of languages.

This can be challenging when dealing with government domain words. However, the goal is to provide all of our services in English as well as Icelandic, so we need to find good translations anyways.

When in doubt, check out the [Glossary](glossary.md). If something is missing from it, you can ask for suggestions in the team. Just remember to add any new translations to the Glossary.

When integrating with a web service that has its interface in Icelandic, all endpoints and fields should be translated to and from English in the integration layer, so other parts of the system can use English-language objects and functions.

### Fail

```typescript
const kennitala = '...'

const typeDefs = gql`
  Mutation {
    applyForVegabref: VegabrefPayload!
  }
`
```

### Pass

```typescript
const nationalId = '...'

const typeDefs = gql`
  Mutation {
    applyForPassport: PassportPayload!
  }
`
```
