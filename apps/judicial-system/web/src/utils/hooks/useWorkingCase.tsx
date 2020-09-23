import { Dispatch, SetStateAction, useState } from 'react'
import { Case } from '../../types'
// Credit: https://dev.to/filippofilip95/i-replaced-usestate-hook-with-custom-one-3dn1
const useWorkingCase: () => [Case, Dispatch<SetStateAction<Case>>] = () => {
  const [state, regularSetState] = useState<Case>()

  const setState = (newState: Case) => {
    regularSetState(() => newState)
  }

  return [state, setState]
}

export default useWorkingCase
