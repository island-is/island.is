import React, { ReactNode, useContext, useEffect, useState } from 'react'
import { useLazyQuery } from '@apollo/client'
import { useRouter } from 'next/router'
import formatISO from 'date-fns/formatISO'
import { ValueType } from 'react-select/src/types'

import {
  CaseDecision,
  CaseState,
  CaseType,
  InstitutionType,
  isRestrictionCase,
  RequestSignatureResponse,
  SignatureConfirmationResponse,
  UserRole,
} from '@island.is/judicial-system/types'
import type { Case } from '@island.is/judicial-system/types'
import {
  FormFooter,
  PageLayout,
  FormContentContainer,
  Modal,
} from '@island.is/judicial-system-web/src/components'
import { UserContext } from '@island.is/judicial-system-web/src/components/UserProvider/UserProvider'
import {
  parseNull,
  parseString,
} from '@island.is/judicial-system-web/src/utils/formatters'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import {
  CaseData,
  ReactSelectOption,
} from '@island.is/judicial-system-web/src/types'
import { Box, Text } from '@island.is/island-ui/core'
import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'
import { CaseQuery } from '@island.is/judicial-system-web/graphql'

import { CourtRecordSignatureConfirmationQuery } from './courtRecordSignatureConfirmationGql'
import SignedVerdictOverviewForm from './SignedVerdictOverviewForm'

export const SignedVerdictOverview: React.FC = () => {
  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
  } = useContext(FormContext)
  const [shareCaseModal, setSharedCaseModal] = useState<{
    open: boolean
    title: string
    text: ReactNode
  }>()
  const [
    selectedSharingInstitutionId,
    setSelectedSharingInstitutionId,
  ] = useState<ValueType<ReactSelectOption>>()
  const [
    requestCourtRecordSignatureResponse,
    setRequestCourtRecordSignatureResponse,
  ] = useState<RequestSignatureResponse>()
  const [
    courtRecordSignatureConfirmationResponse,
    setCourtRecordSignatureConfirmationResponse,
  ] = useState<SignatureConfirmationResponse>()

  const router = useRouter()
  const { user } = useContext(UserContext)
  const {
    updateCase,
    requestCourtRecordSignature,
    isRequestingCourtRecordSignature,
    extendCase,
    isExtendingCase,
  } = useCase()

  const [getCourtRecordSignatureConfirmation] = useLazyQuery(
    CourtRecordSignatureConfirmationQuery,
    {
      fetchPolicy: 'no-cache',
      onCompleted: (courtRecordSignatureConfirmationData) => {
        if (
          courtRecordSignatureConfirmationData?.courtRecordSignatureConfirmation
        ) {
          setCourtRecordSignatureConfirmationResponse(
            courtRecordSignatureConfirmationData.courtRecordSignatureConfirmation,
          )
          if (workingCase) {
            reloadCase({ variables: { input: { id: workingCase.id } } })
          }
        } else {
          setCourtRecordSignatureConfirmationResponse({ documentSigned: false })
        }
      },
      onError: (reason) => {
        console.log(reason)
        setCourtRecordSignatureConfirmationResponse({ documentSigned: false })
      },
    },
  )

  const [reloadCase] = useLazyQuery<CaseData>(CaseQuery, {
    fetchPolicy: 'no-cache',
    onCompleted: (caseData) => {
      if (caseData?.case) {
        setWorkingCase(caseData.case)
      }
    },
  })

  const handleRequestCourtRecordSignature = async () => {
    if (!workingCase) {
      return
    }

    // Request court record signature to get control code
    requestCourtRecordSignature(workingCase.id)
      .then((requestCourtRecordSignatureResponse) => {
        setRequestCourtRecordSignatureResponse(
          requestCourtRecordSignatureResponse,
        )
        getCourtRecordSignatureConfirmation({
          variables: {
            input: {
              caseId: workingCase.id,
              documentToken: requestCourtRecordSignatureResponse?.documentToken,
            },
          },
        })
      })
      .catch((reason) => {
        // TODO: Handle error
        console.log(reason)
      })
  }

  useEffect(() => {
    document.title = 'Yfirlit staðfestrar kröfu - Réttarvörslugátt'
  }, [])

  const handleNextButtonClick = async () => {
    if (workingCase) {
      if (workingCase.childCase) {
        if (isRestrictionCase(workingCase.type)) {
          router.push(`${Constants.STEP_ONE_ROUTE}/${workingCase.childCase.id}`)
        } else {
          router.push(
            `${Constants.IC_DEFENDANT_ROUTE}/${workingCase.childCase.id}`,
          )
        }
      } else {
        await extendCase(workingCase.id)
          .then((extendedCase: Case) => {
            if (isRestrictionCase(extendedCase.type)) {
              router.push(`${Constants.STEP_ONE_ROUTE}/${extendedCase.id}`)
            } else {
              router.push(`${Constants.IC_DEFENDANT_ROUTE}/${extendedCase.id}`)
            }
          })
          .catch((reason) => {
            // TODO: Handle error
            console.log(reason)
          })
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
   *    - state === ACCEPTED and decision === ACCEPTING/ACCEPTING_PARTIALLY and validToDate < today
   * 5. Alternative travel ban accepted and the travel ban end date is not in the past
   *    - state === ACCEPTED and decision === ACCEPTING_ALTERNATIVE_TRAVEL_BAN and validToDate > today
   * 3. Accepted and the custody end date is not in the past
   *    - state === ACCEPTED and decision === ACCEPTING/ACCEPTING_PARTIALLY and validToDate > today
   */

  return (
    <PageLayout
      workingCase={workingCase}
      activeSection={2}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
    >
      <SignedVerdictOverviewForm
        workingCase={workingCase}
        setWorkingCase={setWorkingCase}
        setAccusedAppealDate={setAccusedAppealDate}
        setProsecutorAppealDate={setProsecutorAppealDate}
        withdrawAccusedAppealDate={withdrawAccusedAppealDate}
        withdrawProsecutorAppealDate={withdrawProsecutorAppealDate}
        shareCaseWithAnotherInstitution={shareCaseWithAnotherInstitution}
        selectedSharingInstitutionId={selectedSharingInstitutionId}
        setSelectedSharingInstitutionId={setSelectedSharingInstitutionId}
        isRequestingCourtRecordSignature={isRequestingCourtRecordSignature}
        handleRequestCourtRecordSignature={handleRequestCourtRecordSignature}
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
          nextIsLoading={isExtendingCase}
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
      {requestCourtRecordSignatureResponse && (
        <Modal
          title={
            !courtRecordSignatureConfirmationResponse
              ? 'Rafræn undirritun'
              : courtRecordSignatureConfirmationResponse.documentSigned
              ? 'Þingbók hefur verið undirrituð'
              : courtRecordSignatureConfirmationResponse.code === 7023 // User cancelled
              ? 'Notandi hætti við undirritun'
              : 'Undirritun tókst ekki'
          }
          text={
            !courtRecordSignatureConfirmationResponse ? (
              <>
                <Box marginBottom={2}>
                  <Text variant="h2" color="blue400">
                    {`Öryggistala: ${requestCourtRecordSignatureResponse?.controlCode}`}
                  </Text>
                </Box>
                <Text>
                  Þetta er ekki pin-númerið. Staðfestu aðeins innskráningu ef
                  sama öryggistala birtist í símanum þínum.
                </Text>
              </>
            ) : courtRecordSignatureConfirmationResponse.documentSigned ? (
              'Undirrituð þingbók er aðgengileg undir "Skjöl málsins".'
            ) : (
              'Vinsamlega reynið aftur.'
            )
          }
          primaryButtonText={
            courtRecordSignatureConfirmationResponse ? 'Loka glugga' : ''
          }
          handlePrimaryButtonClick={() => {
            setRequestCourtRecordSignatureResponse(undefined)
            setCourtRecordSignatureConfirmationResponse(undefined)
          }}
        />
      )}
    </PageLayout>
  )
}

export default SignedVerdictOverview
