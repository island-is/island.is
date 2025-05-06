import { createStore } from '@island.is/shared/mocking'
import { personWithChildrenAndSpouse } from './factories'

export const store = createStore(() => {
  const personData = personWithChildrenAndSpouse.list(1)

  return {
    getPersonData: personData[0],
  }
})
