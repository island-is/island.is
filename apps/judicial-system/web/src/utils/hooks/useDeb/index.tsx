import { useDebounce } from 'react-use'

import { TempCase as Case } from '@island.is/judicial-system-web/src/types'

import useCase from '../useCase'

const useDeb = (workingCase: Case, keys: Array<keyof Case> | keyof Case) => {
  const { updateCase } = useCase()
  const newKeys = Array.isArray(keys) ? keys : [keys]

  const update = newKeys.reduce((acc, key) => {
    if (workingCase[key] === null) {
      return acc
    }

    return { ...acc, [key]: workingCase[key] }
  }, {} as Partial<Case>)

  useDebounce(
    () => {
      if (Object.entries(update).length === 0) {
        return
      }

      updateCase(workingCase.id, {
        ...update,
      })
    },
    2000,
    [...newKeys.map((key) => workingCase[key])],
  )
}

export default useDeb
