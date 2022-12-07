import React, { createContext, useContext } from 'react'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'

import * as constants from '@island.is/judicial-system/consts'

import { FormContext } from '../FormProvider/FormProvider'
import { useCase } from '../../utils/hooks'
import useDefendants from '../../utils/hooks/useDefendants'
import * as navigationHandlers from './navigationHandlers'
import * as validations from '../../utils/validate'

export enum FlowType {
  RESTRICTION_CASES = 'restrictionCases',
  INVESTIGATION_CASES = 'investigationCases',
}

export enum UserType {
  PROSECUTOR = 'prosecutor',
  COURT = 'court',
}

export interface Flows {
  [FlowType.RESTRICTION_CASES]: {
    [UserType.PROSECUTOR]: {
      [constants.CREATE_RESTRICTION_CASE_ROUTE]: {
        onContinue: () => Promise<void>
        isValid: boolean
      }
      [constants.RESTRICTION_CASE_DEFENDANT_ROUTE]: {
        onContinue: () => Promise<boolean>
        isValid: boolean
      }
      [constants.RESTRICTION_CASE_HEARING_ARRANGEMENTS_ROUTE]: {
        onContinue: () => Promise<boolean | undefined>
        isValid: boolean
      }
      [constants.RESTRICTION_CASE_POLICE_DEMANDS_ROUTE]: {
        onContinue: () => Promise<boolean>
        isValid: boolean
      }
      [constants.RESTRICTION_CASE_POLICE_REPORT_ROUTE]: {
        onContinue: () => Promise<boolean>
        isValid: boolean
      }
      [constants.RESTRICTION_CASE_CASE_FILES_ROUTE]: {
        onContinue: () => Promise<boolean>
        isValid: boolean
      }
    }
    [UserType.COURT]: {}
  }
  [FlowType.INVESTIGATION_CASES]: {
    [UserType.PROSECUTOR]: {}
    [UserType.COURT]: {}
  }
}

interface StepContextType {
  flows: Flows
}

export const StepContext = createContext<StepContextType>({
  flows: {
    [FlowType.RESTRICTION_CASES]: {
      [UserType.PROSECUTOR]: {
        [constants.CREATE_RESTRICTION_CASE_ROUTE]: {
          onContinue: () => new Promise((resolve) => resolve()),
          isValid: false,
        },
        [constants.RESTRICTION_CASE_DEFENDANT_ROUTE]: {
          onContinue: () => new Promise((resolve) => resolve(true)),
          isValid: false,
        },
        [constants.RESTRICTION_CASE_HEARING_ARRANGEMENTS_ROUTE]: {
          onContinue: () => new Promise((resolve) => resolve(true)),
          isValid: false,
        },
        [constants.RESTRICTION_CASE_POLICE_DEMANDS_ROUTE]: {
          onContinue: () => new Promise((resolve) => resolve(true)),
          isValid: false,
        },
        [constants.RESTRICTION_CASE_POLICE_REPORT_ROUTE]: {
          onContinue: () => new Promise((resolve) => resolve(true)),
          isValid: false,
        },
        [constants.RESTRICTION_CASE_CASE_FILES_ROUTE]: {
          onContinue: () => new Promise((resolve) => resolve(true)),
          isValid: false,
        },
      },
      [UserType.COURT]: {},
    },
    [FlowType.INVESTIGATION_CASES]: {
      [UserType.PROSECUTOR]: {},
      [UserType.COURT]: {},
    },
  },
})

const StepProvider: React.FC = ({ children }) => {
  const router = useRouter()
  const { formatMessage } = useIntl()
  const { workingCase, setWorkingCase } = useContext(FormContext)
  const { createCase, transitionCase } = useCase()
  const { updateDefendant } = useDefendants()

  const flows: Flows = {
    [FlowType.RESTRICTION_CASES]: {
      [UserType.PROSECUTOR]: {
        [constants.CREATE_RESTRICTION_CASE_ROUTE]: {
          onContinue: () =>
            navigationHandlers.handleNavigateFromCreateRestrictionCase(
              router,
              workingCase,
              createCase,
              updateDefendant,
            ),
          isValid: validations.isDefendantStepValidRC(
            workingCase,
            workingCase.policeCaseNumbers,
          ),
        },
        [constants.RESTRICTION_CASE_DEFENDANT_ROUTE]: {
          onContinue: () =>
            router.push(
              `${constants.RESTRICTION_CASE_HEARING_ARRANGEMENTS_ROUTE}/${workingCase.id}`,
            ),
          isValid: validations.isDefendantStepValidRC(
            workingCase,
            workingCase.policeCaseNumbers,
          ),
        },
        [constants.RESTRICTION_CASE_HEARING_ARRANGEMENTS_ROUTE]: {
          onContinue: () =>
            navigationHandlers.handleNavigateFromHearingArrangementsRestrictionCases(
              router,
              workingCase,
              setWorkingCase,
              transitionCase,
              formatMessage,
            ),
          isValid: validations.isHearingArrangementsStepValidRC(workingCase),
        },
        [constants.RESTRICTION_CASE_POLICE_DEMANDS_ROUTE]: {
          onContinue: () =>
            router.push(
              `${constants.RESTRICTION_CASE_POLICE_REPORT_ROUTE}/${workingCase.id}`,
            ),
          isValid: validations.isPoliceDemandsStepValidRC(workingCase),
        },
        [constants.RESTRICTION_CASE_POLICE_REPORT_ROUTE]: {
          onContinue: () =>
            router.push(
              `${constants.RESTRICTION_CASE_CASE_FILES_ROUTE}/${workingCase.id}`,
            ),
          isValid: validations.isPoliceReportStepValidRC(workingCase),
        },
        [constants.RESTRICTION_CASE_CASE_FILES_ROUTE]: {
          onContinue: () =>
            router.push(
              `${constants.RESTRICTION_CASE_OVERVIEW_ROUTE}/${workingCase.id}`,
            ),
          isValid: true, // This step is always valid
        },
      },
      [UserType.COURT]: {},
    },
    [FlowType.INVESTIGATION_CASES]: {
      [UserType.PROSECUTOR]: {},
      [UserType.COURT]: {},
    },
  }

  return (
    <StepContext.Provider value={{ flows }}>{children}</StepContext.Provider>
  )
}

export default StepProvider
