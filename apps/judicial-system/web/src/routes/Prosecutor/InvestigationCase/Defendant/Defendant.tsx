import React, { useContext } from 'react'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'

import { PageLayout } from '@island.is/judicial-system-web/src/components'
import useDefendants from '@island.is/judicial-system-web/src/utils/hooks/useDefendants'
import {
  ProsecutorSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import PageHeader from '@island.is/judicial-system-web/src/components/PageHeader/PageHeader'
import { titles } from '@island.is/judicial-system-web/messages/Core/titles'
import type { Case } from '@island.is/judicial-system/types'
import * as constants from '@island.is/judicial-system/consts'

import DefendantForm from './DefendantForm'

const Defendant = () => {
  const router = useRouter()
  const { updateDefendant, createDefendant } = useDefendants()

  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
  } = useContext(FormContext)
  const { createCase, isCreatingCase } = useCase()
  const { formatMessage } = useIntl()

  const handleNextButtonClick = async (theCase: Case) => {
    if (!theCase.id) {
      const createdCase = await createCase(theCase)

      if (createdCase) {
        workingCase.defendants?.forEach(async (defendant, index) => {
          if (
            index === 0 &&
            createdCase.defendants &&
            createdCase.defendants.length > 0
          ) {
            await updateDefendant(
              createdCase.id,
              createdCase.defendants[0].id,
              {
                gender: defendant.gender,
                name: defendant.name,
                address: defendant.address,
                nationalId: defendant.nationalId,
                noNationalId: defendant.noNationalId,
                citizenship: defendant.citizenship,
              },
            )
          } else {
            await createDefendant(createdCase.id, {
              gender: defendant.gender,
              name: defendant.name,
              address: defendant.address,
              nationalId: defendant.nationalId,
              noNationalId: defendant.noNationalId,
              citizenship: defendant.citizenship,
            })
          }
        })
        router.push(
          `${constants.IC_HEARING_ARRANGEMENTS_ROUTE}/${createdCase.id}`,
        )
      } else {
        // TODO handle error
        return
      }
    } else {
      router.push(`${constants.IC_HEARING_ARRANGEMENTS_ROUTE}/${theCase.id}`)
    }
  }

  return (
    <PageLayout
      workingCase={workingCase}
      activeSection={
        workingCase?.parentCase ? Sections.EXTENSION : Sections.PROSECUTOR
      }
      activeSubSection={ProsecutorSubsections.STEP_ONE}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
      isExtension={workingCase?.parentCase && true}
    >
      <PageHeader
        title={formatMessage(titles.prosecutor.investigationCases.defendant)}
      />
      <DefendantForm
        workingCase={workingCase}
        setWorkingCase={setWorkingCase}
        handleNextButtonClick={handleNextButtonClick}
        isLoading={isCreatingCase}
      />
    </PageLayout>
  )
}

export default Defendant
