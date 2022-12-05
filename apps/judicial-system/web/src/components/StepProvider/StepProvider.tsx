import React, { createContext, useContext } from 'react'
import { useRouter } from 'next/router'

import * as constants from '@island.is/judicial-system/consts'

import { FormContext } from '../FormProvider/FormProvider'

interface Flows {
  restrictionCases: { onContinue: () => Promise<boolean> }[]
}

export const StepContext = createContext<Flows>({
  restrictionCases: [
    {
      onContinue: () => new Promise((resolve) => resolve(true)),
    },
  ],
})

const StepProvider: React.FC = ({ children }) => {
  const router = useRouter()
  const { workingCase } = useContext(FormContext)

  const flows: Flows = {
    restrictionCases: [
      {
        onContinue: () =>
          router.push(
            `${constants.RESTRICTION_CASE_POLICE_REPORT_ROUTE}/${workingCase.id}`,
          ),
      },
    ],
  }

  return <StepContext.Provider value={flows}>{children}</StepContext.Provider>
}

export default StepProvider
