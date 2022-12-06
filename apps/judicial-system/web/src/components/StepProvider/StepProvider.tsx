import React, { createContext, useContext } from 'react'
import { useRouter } from 'next/router'

import * as constants from '@island.is/judicial-system/consts'

import { FormContext } from '../FormProvider/FormProvider'
import * as navigationHandlers from './navigationHandlers'

export interface Flows {
  restrictionCases: {
    [constants.RESTRICTION_CASE_HEARING_ARRANGEMENTS_ROUTE]: {
      onContinue: () => Promise<void>
    }
    [constants.RESTRICTION_CASE_POLICE_DEMANDS_ROUTE]: {
      onContinue: () => Promise<boolean>
    }
    [constants.RESTRICTION_CASE_POLICE_REPORT_ROUTE]: {
      onContinue: () => Promise<boolean>
    }
  }
}

export const StepContext = createContext<Flows>({
  restrictionCases: {
    [constants.RESTRICTION_CASE_HEARING_ARRANGEMENTS_ROUTE]: {
      onContinue: () => new Promise((resolve) => resolve()),
    },
    [constants.RESTRICTION_CASE_POLICE_DEMANDS_ROUTE]: {
      onContinue: () => new Promise((resolve) => resolve(true)),
    },
    [constants.RESTRICTION_CASE_POLICE_REPORT_ROUTE]: {
      onContinue: () => new Promise((resolve) => resolve(true)),
    },
  },
})

const StepProvider: React.FC = ({ children }) => {
  const router = useRouter()
  const { workingCase } = useContext(FormContext)

  const flows: Flows = {
    restrictionCases: {
      [constants.RESTRICTION_CASE_HEARING_ARRANGEMENTS_ROUTE]: {
        onContinue: () =>
          navigationHandlers.handleNavigateFromCreateRestrictionCase(
            router,
            workingCase,
          ),
      },
      [constants.RESTRICTION_CASE_POLICE_DEMANDS_ROUTE]: {
        onContinue: () =>
          router.push(
            `${constants.RESTRICTION_CASE_POLICE_DEMANDS_ROUTE}/${workingCase.id}`,
          ),
      },
      [constants.RESTRICTION_CASE_POLICE_REPORT_ROUTE]: {
        onContinue: () =>
          router.push(
            `${constants.RESTRICTION_CASE_POLICE_REPORT_ROUTE}/${workingCase.id}`,
          ),
      },
    },
  }

  return <StepContext.Provider value={flows}>{children}</StepContext.Provider>
}

export default StepProvider
