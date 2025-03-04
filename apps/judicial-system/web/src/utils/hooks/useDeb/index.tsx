import { useRef } from 'react'
import { useDebounce } from 'react-use'

import { TempCase as Case } from '@island.is/judicial-system-web/src/types'

import useCase from '../useCase'

const useDeb = (workingCase: Case, keys: (keyof Case)[] | keyof Case) => {
  const { updateCase } = useCase()
  const newKeys = Array.isArray(keys) ? keys : [keys]
  const initialRender = useRef(true)

  const update = newKeys.reduce((acc, key) => {
    if (workingCase[key] === null) {
      return acc
    }

    return { ...acc, [key]: workingCase[key] }
  }, {} as Partial<Case>)

  useDebounce(
    () => {
      if (!initialRender.current) {
        if (Object.entries(update).length === 0) {
          return
        }

        updateCase(workingCase.id, {
          ...update,
        })
      }

      initialRender.current = false
    },
    4000,
    [...newKeys.map((key) => workingCase[key])],
  )
}

export default useDeb
