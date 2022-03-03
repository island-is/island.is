import { Dispatch, SetStateAction, useState } from 'react'

import { Application } from '@island.is/application/core'

import {
  ApplicationAnswers,
  useApplicationAnswers,
} from './useApplicationAnswers'

export const useStatefulAnswers = (
  application: Application,
): [ApplicationAnswers, Dispatch<SetStateAction<ApplicationAnswers>>] => {
  const answers = useApplicationAnswers(application)
  const [stateful, setStateful] = useState(answers)

  return [stateful, setStateful]
}
