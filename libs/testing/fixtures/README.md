# Testing Fixtures

This library is supposed to help developers hook up fixtures for their tests
with random data of predefined known objects.

## Examples

```typescript
import { createCurrentUser } from '@island.is/testing/fixtures'

const currentUser = createCurrentUser()
```

## Creating new fixtures

If the fixtures are to be used by multiple projects, they should live in
`testing/fixtures`. Follow the following steps in order to create good testing
fixtures:

1. Use `faker` in order to create random data for your fixture.
2. Make the API of the fixture as easy to use as possible; e.g.
   `createCurrentUser()` | `createCurrentUser({nationalId: '1234567890'})`
