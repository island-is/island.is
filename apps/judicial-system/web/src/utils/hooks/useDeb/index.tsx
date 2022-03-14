import { useDebounce } from 'react-use'

import { Case } from '@island.is/judicial-system/types'

import useCase from '../useCase'

const useDeb = (workingCase: Case, key: keyof Case) => {
  const { updateCase } = useCase()

  useDebounce(
    () => {
      updateCase(workingCase.id, { [key]: workingCase[key] })
    },
    2000,
    [workingCase[key]],
  )
}

export default useDeb
