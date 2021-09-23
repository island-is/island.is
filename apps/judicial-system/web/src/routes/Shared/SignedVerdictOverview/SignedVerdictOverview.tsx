import { useMutation, useQuery } from '@apollo/client'
import {
  CaseDecision,
  CaseState,
  CaseType,
  InstitutionType,
  UserRole,
} from '@island.is/judicial-system/types'
import type { Case } from '@island.is/judicial-system/types'
import React, { ReactNode, useContext, useEffect, useState } from 'react'
import { CaseQuery } from '@island.is/judicial-system-web/graphql'
import {
  FormFooter,
  PageLayout,
  FormContentContainer,
  Modal,
} from '@island.is/judicial-system-web/src/shared-components'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'
import { UserContext } from '@island.is/judicial-system-web/src/shared-components/UserProvider/UserProvider'
import { ExtendCaseMutation } from '@island.is/judicial-system-web/src/utils/mutations'
import { useRouter } from 'next/router'
import {
  parseNull,
  parseString,
} from '@island.is/judicial-system-web/src/utils/formatters'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import formatISO from 'date-fns/formatISO'
import {
  CaseData,
  ReactSelectOption,
} from '@island.is/judicial-system-web/src/types'
import { ValueType } from 'react-select/src/types'
import SignedVerdictOverviewForm from './SignedVerdictOverviewForm'
import { Text } from '@island.is/island-ui/core'

export const SignedVerdictOverview: React.FC = () => {
  const [workingCase, setWorkingCase] = useState<Case>()
  const [shareCaseModal, setSharedCaseModal] = useState<{
    open: boolean
    title: string
    text: ReactNode
  }>()
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
    if (workingCase) {
      const isRestrictionCase =
        workingCase.type === CaseType.CUSTODY ||
        workingCase.type === CaseType.TRAVEL_BAN

      if (workingCase.childCase) {
        if (isRestrictionCase) {
          router.push(`${Constants.STEP_ONE_ROUTE}/${workingCase.childCase.id}`)
        } else {
          router.push(
            `${Constants.IC_DEFENDANT_ROUTE}/${workingCase.childCase.id}`,
          )
        }
      } else {
        const { data } = await extendCaseMutation({
          variables: {
            input: {
              id: workingCase.id,
            },
          },
        })

        if (data) {
          if (isRestrictionCase) {
            router.push(`${Constants.STEP_ONE_ROUTE}/${data.extendCase.id}`)
          } else {
            router.push(`${Constants.IC_DEFENDANT_ROUTE}/${data.extendCase.id}`)
          }
        }
      }
    }
  }

  const getInfoText = (workingCase: Case): string | undefined => {
    if (user?.role !== UserRole.PROSECUTOR) {
      // Only prosecutors should see the explanation.
      return undefined
    } else if (
      workingCase.state === CaseState.REJECTED ||
      workingCase.state === CaseState.DISMISSED
    ) {
      return `Ekki hægt að framlengja ${
        workingCase.type === CaseType.CUSTODY
          ? 'gæsluvarðhald'
          : workingCase.type === CaseType.TRAVEL_BAN
          ? 'farbann'
          : 'heimild'
      } sem var ${
        workingCase.state === CaseState.REJECTED ? 'hafnað' : 'vísað frá'
      }.`
    } else if (
      workingCase.decision === CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN
    ) {
      return 'Ekki hægt að framlengja kröfu þegar dómari hefur úrskurðað um annað en dómkröfur sögðu til um.'
    } else if (workingCase.childCase) {
      return 'Framlengingarkrafa hefur þegar verið útbúin.'
    } else if (workingCase.isValidToDateInThePast) {
      // This must be after the rejected and alternatice decision cases as the custody
      // end date only applies to cases that were accepted by the judge. This must also
      // be after the already extended case as the custody end date may expire after
      // the case has been extended.
      return `Ekki hægt að framlengja ${
        workingCase.type === CaseType.CUSTODY
          ? 'gæsluvarðhald'
          : workingCase.type === CaseType.TRAVEL_BAN
          ? 'farbann'
          : 'heimild'
      } sem er lokið.`
    } else {
      return undefined
    }
  }

  const setAccusedAppealDate = (date?: Date) => {
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

  const setProsecutorAppealDate = (date?: Date) => {
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

  const withdrawAccusedAppealDate = () => {
    if (workingCase) {
      setWorkingCase({
        ...workingCase,
        accusedPostponedAppealDate: undefined,
      })

      updateCase(workingCase.id, parseNull('accusedPostponedAppealDate'))
    }
  }

  const withdrawProsecutorAppealDate = () => {
    if (workingCase) {
      setWorkingCase({
        ...workingCase,
        prosecutorPostponedAppealDate: undefined,
      })

      updateCase(workingCase.id, parseNull('prosecutorPostponedAppealDate'))
    }
  }

  const shareCaseWithAnotherInstitution = (
    institution?: ValueType<ReactSelectOption>,
  ) => {
    if (workingCase) {
      if (workingCase.sharedWithProsecutorsOffice) {
        setSharedCaseModal({
          open: true,
          title: `Mál ${workingCase.courtCaseNumber} er nú lokað öðrum en upprunalegu embætti`,
          text: (
            <Text>
              <Text fontWeight="semiBold" as="span">
                {workingCase.sharedWithProsecutorsOffice.name}
              </Text>{' '}
              hefur ekki lengur aðgang að málinu.
            </Text>
          ),
        })

        setWorkingCase({
          ...workingCase,
          sharedWithProsecutorsOffice: undefined,
        })
        setSelectedSharingInstitutionId(null)

        updateCase(workingCase.id, parseNull('sharedWithProsecutorsOfficeId'))
      } else {
        setSharedCaseModal({
          open: true,
          title: `Mál ${workingCase.courtCaseNumber} hefur verið opnað fyrir öðru embætti`,
          text: (
            <Text>
              <Text fontWeight="semiBold" as="span">
                {(institution as ReactSelectOption).label}
              </Text>{' '}
              hefur nú fengið aðgang að málinu.
            </Text>
          ),
        })

        setWorkingCase({
          ...workingCase,
          sharedWithProsecutorsOffice: {
            id: (institution as ReactSelectOption).value as string,
            name: (institution as ReactSelectOption).label,
            type: InstitutionType.PROSECUTORS_OFFICE,
            created: new Date().toString(),
            modified: new Date().toString(),
          },
        })

        updateCase(
          workingCase.id,
          parseString(
            'sharedWithProsecutorsOfficeId',
            (institution as ReactSelectOption).value as string,
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
   *    - state === ACCEPTED and decision === ACCEPTING_ALTERNATIVE_TRAVEL_BAN and validToDate < today
   * 3. Accepted and the custody end date is in the past
   *    - state === ACCEPTED and decision === ACCEPTING and validToDate < today
   * 5. Alternative travel ban accepted and the travel ban end date is not in the past
   *    - state === ACCEPTED and decision === ACCEPTING_ALTERNATIVE_TRAVEL_BAN and validToDate > today
   * 3. Accepted and the custody end date is not in the past
   *    - state === ACCEPTED and decision === ACCEPTING and validToDate > today
   */

  return (
    <PageLayout
      activeSection={2}
      isLoading={loading}
      notFound={data?.case === undefined}
      isValidToDateInThePast={workingCase?.isValidToDateInThePast}
      decision={data?.case?.decision}
      caseType={workingCase?.type}
    >
      {workingCase ? (
        <>
          <SignedVerdictOverviewForm
            workingCase={workingCase}
            setAccusedAppealDate={setAccusedAppealDate}
            setProsecutorAppealDate={setProsecutorAppealDate}
            withdrawAccusedAppealDate={withdrawAccusedAppealDate}
            withdrawProsecutorAppealDate={withdrawProsecutorAppealDate}
            shareCaseWithAnotherInstitution={shareCaseWithAnotherInstitution}
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
                workingCase.state === CaseState.REJECTED ||
                workingCase.state === CaseState.DISMISSED ||
                workingCase.isValidToDateInThePast ||
                Boolean(workingCase.childCase)
              }
              nextButtonText={`Framlengja ${
                workingCase.type === CaseType.CUSTODY
                  ? 'gæslu'
                  : workingCase.type === CaseType.TRAVEL_BAN
                  ? 'farbann'
                  : 'heimild'
              }`}
              onNextButtonClick={() => handleNextButtonClick()}
              nextIsLoading={isCreatingExtension}
              infoBoxText={getInfoText(workingCase)}
            />
          </FormContentContainer>
          {shareCaseModal?.open && (
            <Modal
              title={shareCaseModal.title}
              text={shareCaseModal.text}
              primaryButtonText="Loka glugga"
              handlePrimaryButtonClick={() => setSharedCaseModal(undefined)}
            />
          )}
        </>
      ) : null}
    </PageLayout>
  )
}

export default SignedVerdictOverview
