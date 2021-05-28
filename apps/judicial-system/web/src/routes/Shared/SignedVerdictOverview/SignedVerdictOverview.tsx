import { useMutation, useQuery } from '@apollo/client'
import {
  Accordion,
  AccordionItem,
  Box,
  Button,
  Select,
  Tag,
  Text,
  Tooltip,
} from '@island.is/island-ui/core'
import {
  TIME_FORMAT,
  formatDate,
  getShortRestrictionByValue,
} from '@island.is/judicial-system/formatters'
import {
  Case,
  CaseAppealDecision,
  CaseCustodyRestrictions,
  CaseDecision,
  CaseGender,
  CaseType,
  InstitutionType,
  UserRole,
} from '@island.is/judicial-system/types'
import React, { useContext, useEffect, useState } from 'react'
import { CaseQuery } from '@island.is/judicial-system-web/graphql'
import {
  FormFooter,
  PdfButton,
  PageLayout,
  InfoCard,
  PoliceRequestAccordionItem,
  RulingAccordionItem,
  CourtRecordAccordionItem,
  FormContentContainer,
  CaseFileList,
  BlueBox,
} from '@island.is/judicial-system-web/src/shared-components'
import { getRestrictionTagVariant } from '@island.is/judicial-system-web/src/utils/stepHelper'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'
import { UserContext } from '@island.is/judicial-system-web/src/shared-components/UserProvider/UserProvider'
import { ExtendCaseMutation } from '@island.is/judicial-system-web/src/utils/mutations'
import AppealSection from './Components/AppealSection/AppealSection'
import { useRouter } from 'next/router'
import {
  parseNull,
  parseString,
} from '@island.is/judicial-system-web/src/utils/formatters'
import useCase from '@island.is/judicial-system-web/src/utils/hooks/useCase'
import formatISO from 'date-fns/formatISO'
import {
  CaseData,
  ReactSelectOption,
} from '@island.is/judicial-system-web/src/types'
import useInstitution from '@island.is/judicial-system-web/src/utils/hooks/useInstitution'
import { ValueType } from 'react-select/src/types'
import SignedVerdictOverviewForm from './SignedVerdictOverviewForm'

export const SignedVerdictOverview: React.FC = () => {
  const [workingCase, setWorkingCase] = useState<Case>()
  const [
    selectedSharingInstitutionId,
    setSelectedSharingInstitutionId,
  ] = useState<ValueType<ReactSelectOption>>()

  const router = useRouter()
  const id = router.query.id
  const { user } = useContext(UserContext)
  const { updateCase } = useCase()

  const { data, loading } = useQuery<CaseData>(CaseQuery, {
    variables: { input: { id: id } },
    fetchPolicy: 'no-cache',
  })

  const [extendCaseMutation, { loading: isCreatingExtension }] = useMutation(
    ExtendCaseMutation,
  )

  useEffect(() => {
    document.title = 'Yfirlit staðfestrar kröfu - Réttarvörslugátt'
  }, [])

  useEffect(() => {
    if (!workingCase && data?.case) {
      setWorkingCase(data.case)
    }
  }, [workingCase, setWorkingCase, data])

  const handleNextButtonClick = async () => {
    if (workingCase?.childCase) {
      router.push(`${Constants.STEP_ONE_ROUTE}/${workingCase.childCase.id}`)
    } else {
      const { data } = await extendCaseMutation({
        variables: {
          input: {
            id: workingCase?.id,
          },
        },
      })

      if (data) {
        router.push(`${Constants.STEP_ONE_ROUTE}/${data.extendCase.id}`)
      }
    }
  }

  const getInfoText = (workingCase: Case): string | undefined => {
    if (user?.role !== UserRole.PROSECUTOR) {
      // Only prosecutors should see the explanation.
      return undefined
    } else if (workingCase.decision === CaseDecision.REJECTING) {
      return `Ekki hægt að framlengja ${
        workingCase.type === CaseType.CUSTODY ? 'gæsluvarðhald' : 'farbann'
      } sem var hafnað.`
    } else if (
      workingCase.decision === CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN
    ) {
      return 'Ekki hægt að framlengja kröfu þegar dómari hefur úrskurðað um annað en dómkröfur sögðu til um.'
    } else if (workingCase.childCase) {
      return 'Framlengingarkrafa hefur þegar verið útbúin.'
    } else if (workingCase.isCustodyEndDateInThePast) {
      // This must be after the rejected and alternatice decision cases as the custody
      // end date only applies to cases that were accepted by the judge. This must also
      // be after the already extended case as the custody end date may expire after
      // the case has been extended.
      return `Ekki hægt að framlengja ${
        workingCase.type === CaseType.CUSTODY ? 'gæsluvarðhald' : 'farbann'
      } sem er lokið.`
    } else {
      return undefined
    }
  }

  const handleAccusedAppeal = (date?: Date) => {
    if (workingCase && date) {
      setWorkingCase({
        ...workingCase,
        accusedPostponedAppealDate: formatISO(date),
      })

      updateCase(
        workingCase.id,
        parseString('accusedPostponedAppealDate', formatISO(date)),
      )
    }
  }

  const handleProsecutorAppeal = (date?: Date) => {
    if (workingCase && date) {
      setWorkingCase({
        ...workingCase,
        prosecutorPostponedAppealDate: formatISO(date),
      })

      updateCase(
        workingCase.id,
        parseString('prosecutorPostponedAppealDate', formatISO(date)),
      )
    }
  }

  const handleAccusedAppealDismissal = () => {
    if (workingCase) {
      setWorkingCase({
        ...workingCase,
        accusedPostponedAppealDate: undefined,
      })

      updateCase(workingCase.id, parseNull('accusedPostponedAppealDate'))
    }
  }

  const handleProsecutorAppealDismissal = () => {
    if (workingCase) {
      setWorkingCase({
        ...workingCase,
        prosecutorPostponedAppealDate: undefined,
      })

      updateCase(workingCase.id, parseNull('prosecutorPostponedAppealDate'))
    }
  }

  const handleShareCaseWithAnotherInstitution = (
    selectedInstitution?: ValueType<ReactSelectOption>,
  ) => {
    if (workingCase) {
      if (workingCase.sharedWithProsecutorsOffice) {
        setWorkingCase({
          ...workingCase,
          sharedWithProsecutorsOffice: undefined,
        })

        setSelectedSharingInstitutionId(null)

        updateCase(workingCase.id, parseNull('sharedWithProsecutorsOfficeId'))
      } else {
        setWorkingCase({
          ...workingCase,
          sharedWithProsecutorsOffice: {
            id: (selectedInstitution as ReactSelectOption).value as string,
            name: (selectedInstitution as ReactSelectOption).label,
            type: InstitutionType.PROSECUTORS_OFFICE,
            created: new Date().toString(),
            modified: new Date().toString(),
          },
        })

        updateCase(
          workingCase.id,
          parseString(
            'sharedWithProsecutorsOfficeId',
            (selectedInstitution as ReactSelectOption).value as string,
          ),
        )
      }
    }
  }

  /**
   * We assume that the signed verdict page is only opened for
   * cases in state REJECTED or ACCEPTED.
   *
   * Based on the judge's decision the signed verdict page can
   * be in one of five states:
   *
   * 1. Rejected
   *    - state === REJECTED and decision === REJECTING
   * 2. Alternative travel ban accepted and the travel ban end date is in the past
   *    - state === ACCEPTED and decision === ACCEPTING_ALTERNATIVE_TRAVEL_BAN and custodyEndDate < today
   * 3. Accepted and the custody end date is in the past
   *    - state === ACCEPTED and decision === ACCEPTING and custodyEndDate < today
   * 5. Alternative travel ban accepted and the travel ban end date is not in the past
   *    - state === ACCEPTED and decision === ACCEPTING_ALTERNATIVE_TRAVEL_BAN and custodyEndDate > today
   * 3. Accepted and the custody end date is not in the past
   *    - state === ACCEPTED and decision === ACCEPTING and custodyEndDate > today
   */

  return (
    <PageLayout
      activeSection={2}
      isLoading={loading}
      notFound={data?.case === undefined}
      isCustodyEndDateInThePast={workingCase?.isCustodyEndDateInThePast}
      decision={data?.case?.decision}
      caseType={workingCase?.type}
    >
      {workingCase ? (
        <>
          <SignedVerdictOverviewForm
            workingCase={workingCase}
            handleAccusedAppeal={handleAccusedAppeal}
            handleProsecutorAppeal={handleProsecutorAppeal}
            handleAccusedAppealDismissal={handleAccusedAppealDismissal}
            handleProsecutorAppealDismissal={handleProsecutorAppealDismissal}
            handleShareCaseWithAnotherInstitution={
              handleShareCaseWithAnotherInstitution
            }
            selectedSharingInstitutionId={selectedSharingInstitutionId}
            setSelectedSharingInstitutionId={setSelectedSharingInstitutionId}
          />
          <FormContentContainer isFooter>
            <FormFooter
              previousUrl={Constants.REQUEST_LIST_ROUTE}
              hideNextButton={
                user?.role !== UserRole.PROSECUTOR ||
                workingCase.decision ===
                  CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN ||
                workingCase.decision === CaseDecision.REJECTING ||
                workingCase.isCustodyEndDateInThePast ||
                Boolean(workingCase.childCase)
              }
              nextButtonText={`Framlengja ${
                workingCase.type === CaseType.CUSTODY ? 'gæslu' : 'farbann'
              }`}
              onNextButtonClick={() => handleNextButtonClick()}
              nextIsLoading={isCreatingExtension}
              infoBoxText={getInfoText(workingCase)}
            />
          </FormContentContainer>
        </>
      ) : null}
    </PageLayout>
  )
}

export default SignedVerdictOverview
