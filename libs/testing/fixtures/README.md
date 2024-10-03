# Testing Fixtures

This library assists developers in setting up fixtures for tests with random data of predefined known objects.

## Examples

```typescript
import { createCurrentUser } from '@island.is/testing/fixtures'

const currentUser = createCurrentUser()
```

## Creating New Fixtures

To ensure reusability across multiple projects, place any new fixtures in `testing/fixtures`. Follow these steps to create effective testing fixtures:

1. Utilize `faker` to generate random data for your fixture.
2. Design the fixture's API to be as user-friendly as possible, for example:
   - `createCurrentUser()`
   - `createCurrentUser({nationalId: '1234567890'})`
