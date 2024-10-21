import { adminPortalScopes } from '@island.is/auth/scopes'
import { createMockedInitialState } from '@island.is/react-spa/bff'
import { isMockMode } from './index'

export const mockedInitialState = isMockMode
  ? createMockedInitialState({
      scopes: adminPortalScopes,
    })
  : undefined
