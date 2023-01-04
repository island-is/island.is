import { useDebounce } from 'react-use'

import { Case } from '@island.is/judicial-system/types'

import useCase from '../useCase'

const useDeb = (workingCase: Case, keys: Array<keyof Case> | keyof Case) => {
  const { updateCase } = useCase()
  const newKeys = Array.isArray(keys) ? keys : [keys]

  useDebounce(
    () => {
      updateCase(workingCase.id, {
        ...newKeys.reduce(
          (acc, key) => ({ ...acc, [key]: workingCase[key] }),
          {},
        ),
      })
    },
    2000,
    [...newKeys.map((key) => workingCase[key])],
  )
}

export default useDeb
