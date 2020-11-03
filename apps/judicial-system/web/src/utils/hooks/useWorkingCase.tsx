import { Case } from '@island.is/judicial-system/types'
import { Dispatch, SetStateAction, useState } from 'react'

// Credit: https://dev.to/filippofilip95/i-replaced-usestate-hook-with-custom-one-3dn1
const useWorkingCase: () => [Case, Dispatch<SetStateAction<Case>>] = () => {
  const [state, regularSetState] = useState<Case>()

  const setState = (newState: Case) => {
    regularSetState(() => newState)
  }

  return [state, setState]
}

export default useWorkingCase
