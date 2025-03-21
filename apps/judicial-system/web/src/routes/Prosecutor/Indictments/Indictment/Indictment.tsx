import { useCallback, useContext, useState } from 'react'
import { IntlShape, useIntl } from 'react-intl'
import { applyCase } from 'beygla/strict'
import { AnimatePresence, motion } from 'motion/react'
import router from 'next/router'

import { Box, Button, Checkbox, Input } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import {
  applyDativeCaseToCourtName,
  formatNationalId,
} from '@island.is/judicial-system/formatters'
import { titles } from '@island.is/judicial-system-web/messages'
import {
  BlueBox,
  FormContentContainer,
  FormContext,
  FormFooter,
  PageHeader,
  PageLayout,
  PageTitle,
  PdfButton,
  ProsecutorCaseInfo,
  SectionHeading,
} from '@island.is/judicial-system-web/src/components'
import {
  CaseOrigin,
  Defendant,
  Gender,
  IndictmentCount as TIndictmentCount,
  IndictmentCountOffense,
  Institution,
  Maybe,
  Offense,
  PoliceCaseInfo,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  removeTabsValidateAndSet,
  validateAndSendToServer,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import {
  UpdateIndictmentCount,
  useCase,
  useDeb,
  useIndictmentCounts,
  useOnceOn,
} from '@island.is/judicial-system-web/src/utils/hooks'
import { isIndictmentStepValid } from '@island.is/judicial-system-web/src/utils/validate'

import { usePoliceCaseInfoQuery } from '../Defendant/policeCaseInfo.generated'
import { IndictmentCount } from './IndictmentCount'
import { indictment as cStrings, strings } from './Indictment.strings'

export const getIndictmentIntroductionAutofill = (
  formatMessage: IntlShape['formatMessage'],
  prosecutorsOffice?: Maybe<Institution> | undefined,
  court?: Maybe<Institution> | undefined,
  defendants?: Maybe<Defendant[]> | undefined,
) => {
  return defendants && defendants.length > 0
    ? [
        prosecutorsOffice?.name?.toUpperCase(),
        `\n\n${formatMessage(
          cStrings.indictmentIntroductionAutofillAnnounces,
        )}`,
        `\n\n${formatMessage(cStrings.indictmentIntroductionAutofillCourt, {
          court: applyDativeCaseToCourtName(court?.name || 'héraðsdómi'),
        })}`,
        `\n\n${defendants.map((defendant) => {
          return `\n          ${formatMessage(
            cStrings.indictmentIntroductionAutofillDefendant,
            {
              defendantName: defendant.name
                ? applyCase('þgf', defendant.name)
                : 'Ekki skráð',
              defendantNationalId: defendant.nationalId
                ? formatNationalId(defendant.nationalId)
                : 'Ekki skráð',
            },
          )}\n          ${defendant.address},`
        })}
    `,
      ]
    : []
}

const Indictment = () => {
  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
    isCaseUpToDate,
  } = useContext(FormContext)

  const { formatMessage } = useIntl()
  const { updateCase, setAndSendCaseToServer } = useCase()
  const {
    createIndictmentCount,
    updateIndictmentCount,
    deleteIndictmentCount,
    updateIndictmentCountState,
  } = useIndictmentCounts()
  const [
    indictmentIntroductionErrorMessage,
    setIndictmentIntroductionErrorMessage,
  ] = useState<string>('')
  const [demandsErrorMessage, setDemandsErrorMessage] = useState('')
  const [civilDemandsErrorMessage, setCivilDemandsErrorMessage] = useState('')

  // Use the gender of the single defendant if there is only one,
  // otherwise default to male
  const gender =
    workingCase.defendants && workingCase.defendants.length === 1
      ? workingCase.defendants[0].gender ?? Gender.MALE
      : Gender.MALE

  const { data: policeCaseData } = usePoliceCaseInfoQuery({
    variables: {
      input: {
        caseId: workingCase.id,
      },
    },
    skip: workingCase.origin !== CaseOrigin.LOKE,
    fetchPolicy: 'no-cache',
    onCompleted: (data) => {
      if (!data.policeCaseInfo) {
        return undefined
      } else return data as PoliceCaseInfo[]
    },
  })

  const stepIsValid = isIndictmentStepValid(workingCase)

  const handleNavigationTo = useCallback(
    (destination: string) => router.push(`${destination}/${workingCase.id}`),
    [workingCase.id],
  )

  useDeb(workingCase, ['indictmentIntroduction', 'demands'])

  const setDriversLicenseSuspensionRequest = useCallback(
    (indictmentCounts?: TIndictmentCount[]) => {
      // If the case has:
      // at least one count with the offense driving under the influence of alcohol, illegal drugs or prescription drugs
      // then by default the prosecutor requests a suspension of the driver's licence.
      const requestDriversLicenseSuspension = indictmentCounts?.some(
        (count) => {
          return count.offenses?.some((o) =>
            [
              IndictmentCountOffense.DRUNK_DRIVING,
              IndictmentCountOffense.ILLEGAL_DRUGS_DRIVING,
              IndictmentCountOffense.PRESCRIPTION_DRUGS_DRIVING,
            ].includes(o.offense),
          )
        },
      )

      if (
        requestDriversLicenseSuspension !==
        workingCase.requestDriversLicenseSuspension
      ) {
        setAndSendCaseToServer(
          [
            {
              requestDriversLicenseSuspension,
              demands: requestDriversLicenseSuspension
                ? strings.demandsAutofillWithSuspension[gender]
                : strings.demandsAutofill[gender],
              force: true,
            },
          ],
          workingCase,
          setWorkingCase,
        )
      }
    },
    [gender, setAndSendCaseToServer, setWorkingCase, workingCase],
  )

  const handleCreateIndictmentCount = useCallback(async () => {
    const indictmentCount = await createIndictmentCount(workingCase.id)

    if (!indictmentCount) {
      return
    }

    const indictmentCounts = [
      ...(workingCase.indictmentCounts ?? []),
      indictmentCount,
    ]

    setDriversLicenseSuspensionRequest(indictmentCounts)

    setWorkingCase((prevWorkingCase) => ({
      ...prevWorkingCase,
      indictmentCounts,
    }))
  }, [
    createIndictmentCount,
    setDriversLicenseSuspensionRequest,
    setWorkingCase,
    workingCase.id,
    workingCase.indictmentCounts,
  ])

  const handleUpdateIndictmentCount = useCallback(
    async (
      indictmentCountId: string,
      updatedIndictmentCount: UpdateIndictmentCount,
      updatedOffenses?: Offense[],
    ) => {
      if (
        updatedIndictmentCount.policeCaseNumber &&
        policeCaseData?.policeCaseInfo
      ) {
        const vehicleNumber = policeCaseData.policeCaseInfo?.find(
          (policeCase) =>
            policeCase?.policeCaseNumber ===
            updatedIndictmentCount.policeCaseNumber,
        )?.licencePlate

        if (vehicleNumber)
          updatedIndictmentCount.vehicleRegistrationNumber = vehicleNumber
      }

      const returnedIndictmentCount = await updateIndictmentCount(
        workingCase.id,
        indictmentCountId,
        updatedIndictmentCount,
      )

      if (!returnedIndictmentCount) {
        return
      }

      setDriversLicenseSuspensionRequest(
        workingCase.indictmentCounts?.map((count) =>
          count.id === indictmentCountId
            ? { ...returnedIndictmentCount, offenses: updatedOffenses }
            : count,
        ),
      )

      updateIndictmentCountState(
        indictmentCountId,
        returnedIndictmentCount,
        setWorkingCase,
        updatedOffenses,
      )
    },
    [
      policeCaseData,
      setDriversLicenseSuspensionRequest,
      setWorkingCase,
      updateIndictmentCount,
      updateIndictmentCountState,
      workingCase.id,
      workingCase.indictmentCounts,
    ],
  )

  const handleDeleteIndictmentCount = useCallback(
    async (indictmentCountId: string) => {
      if (
        workingCase.indictmentCounts &&
        workingCase.indictmentCounts.length > 1
      ) {
        await deleteIndictmentCount(workingCase.id, indictmentCountId)

        const indictmentCounts = workingCase.indictmentCounts?.filter(
          (count) => count.id !== indictmentCountId,
        )

        setDriversLicenseSuspensionRequest(indictmentCounts)

        setWorkingCase((prevWorkingCase) => ({
          ...prevWorkingCase,
          indictmentCounts,
        }))
      }
    },
    [
      deleteIndictmentCount,
      setDriversLicenseSuspensionRequest,
      setWorkingCase,
      workingCase.id,
      workingCase.indictmentCounts,
    ],
  )

  const initialize = useCallback(() => {
    const indictmentCounts = workingCase.indictmentCounts || []
    if (indictmentCounts.length === 0) {
      handleCreateIndictmentCount()
    } else {
      // in case indictment subtypes have been modified in earlier step
      setDriversLicenseSuspensionRequest(indictmentCounts)
    }

    setAndSendCaseToServer(
      [
        {
          indictmentIntroduction: getIndictmentIntroductionAutofill(
            formatMessage,
            workingCase.prosecutorsOffice,
            workingCase.court,
            workingCase.defendants,
          )?.join(''),
          demands: workingCase.requestDriversLicenseSuspension
            ? strings.demandsAutofillWithSuspension[gender]
            : strings.demandsAutofill[gender],
        },
      ],
      workingCase,
      setWorkingCase,
    )
  }, [
    workingCase,
    setAndSendCaseToServer,
    formatMessage,
    gender,
    setWorkingCase,
    handleCreateIndictmentCount,
    setDriversLicenseSuspensionRequest,
  ])

  useOnceOn(isCaseUpToDate, initialize)

  return (
    <PageLayout
      workingCase={workingCase}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
      isValid={stepIsValid}
      onNavigationTo={handleNavigationTo}
    >
      <PageHeader
        title={formatMessage(titles.prosecutor.indictments.indictment)}
      />
      <FormContentContainer>
        <PageTitle>{formatMessage(cStrings.heading)}</PageTitle>
        <ProsecutorCaseInfo workingCase={workingCase} />
        <Box component="section" marginBottom={3}>
          <SectionHeading
            title={formatMessage(cStrings.indictmentIntroductionTitle)}
          />
          <Input
            name="indictmentIntroduction"
            label={formatMessage(cStrings.indictmentIntroductionLabel)}
            placeholder={formatMessage(
              cStrings.indictmentIntroductionPlaceholder,
            )}
            value={workingCase.indictmentIntroduction || ''}
            errorMessage={indictmentIntroductionErrorMessage}
            hasError={indictmentIntroductionErrorMessage !== ''}
            onChange={(event) =>
              removeTabsValidateAndSet(
                'indictmentIntroduction',
                event.target.value,
                ['empty'],
                setWorkingCase,
                indictmentIntroductionErrorMessage,
                setIndictmentIntroductionErrorMessage,
              )
            }
            onBlur={(event) =>
              validateAndSendToServer(
                'indictmentIntroduction',
                event.target.value,
                ['empty'],
                workingCase,
                updateCase,
                setIndictmentIntroductionErrorMessage,
              )
            }
            textarea
            required
            autoComplete="off"
            rows={10}
            autoExpand={{ on: true, maxHeight: 300 }}
          />
        </Box>
        {workingCase.indictmentCounts?.map((indictmentCount, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <Box
              component="section"
              marginBottom={
                index - 1 === workingCase.indictmentCounts?.length ? 0 : 3
              }
            >
              <SectionHeading
                title={formatMessage(cStrings.indictmentCountHeading, {
                  count: index + 1,
                })}
              />
              <AnimatePresence>
                <IndictmentCount
                  indictmentCount={indictmentCount}
                  workingCase={workingCase}
                  onDelete={index > 0 ? handleDeleteIndictmentCount : undefined}
                  onChange={handleUpdateIndictmentCount}
                  setWorkingCase={setWorkingCase}
                  updateIndictmentCountState={updateIndictmentCountState}
                />
              </AnimatePresence>
            </Box>
          </motion.div>
        ))}
        <Box display="flex" justifyContent="flexEnd" marginBottom={3}>
          <Button
            variant="ghost"
            icon="add"
            onClick={handleCreateIndictmentCount}
            disabled={false}
          >
            {formatMessage(cStrings.addIndictmentCount)}
          </Button>
        </Box>
        <Box component="section" marginBottom={6}>
          <SectionHeading title={formatMessage(cStrings.demandsTitle)} />
          <BlueBox>
            <Box marginBottom={3}>
              <Checkbox
                name="requestDriversLicenseSuspension"
                label={formatMessage(cStrings.demandsRequestSuspension)}
                checked={Boolean(workingCase.requestDriversLicenseSuspension)}
                onChange={() => {
                  setAndSendCaseToServer(
                    [
                      {
                        requestDriversLicenseSuspension:
                          !workingCase.requestDriversLicenseSuspension,
                        demands: !workingCase.requestDriversLicenseSuspension
                          ? strings.demandsAutofillWithSuspension[gender]
                          : strings.demandsAutofill[gender],
                        force: true,
                      },
                    ],
                    workingCase,
                    setWorkingCase,
                  )
                }}
                filled
                large
              />
            </Box>
            <Input
              name="demands"
              label={formatMessage(cStrings.demandsLabel)}
              placeholder={formatMessage(cStrings.demandsPlaceholder)}
              value={workingCase.demands ?? ''}
              errorMessage={demandsErrorMessage}
              hasError={demandsErrorMessage !== ''}
              onChange={(event) =>
                removeTabsValidateAndSet(
                  'demands',
                  event.target.value,
                  ['empty'],
                  setWorkingCase,
                  demandsErrorMessage,
                  setDemandsErrorMessage,
                )
              }
              onBlur={(event) =>
                validateAndSendToServer(
                  'demands',
                  event.target.value,
                  ['empty'],
                  workingCase,
                  updateCase,
                  setDemandsErrorMessage,
                )
              }
              textarea
              autoComplete="off"
              required
              rows={7}
              autoExpand={{ on: true, maxHeight: 300 }}
            />
          </BlueBox>
        </Box>
        {workingCase.hasCivilClaims && (
          <Box marginBottom={6}>
            <SectionHeading title={formatMessage(cStrings.civilDemandsTitle)} />
            <BlueBox>
              <Input
                name="civilDemands"
                label={formatMessage(cStrings.civilDemandsLabel)}
                placeholder={formatMessage(cStrings.civilDemandsPlaceholder)}
                value={workingCase.civilDemands ?? ''}
                errorMessage={civilDemandsErrorMessage}
                hasError={civilDemandsErrorMessage !== ''}
                onChange={(event) =>
                  removeTabsValidateAndSet(
                    'civilDemands',
                    event.target.value,
                    ['empty'],
                    setWorkingCase,
                    civilDemandsErrorMessage,
                    setCivilDemandsErrorMessage,
                  )
                }
                onBlur={(event) =>
                  validateAndSendToServer(
                    'civilDemands',
                    event.target.value,
                    ['empty'],
                    workingCase,
                    updateCase,
                    setCivilDemandsErrorMessage,
                  )
                }
                textarea
                autoComplete="off"
                required
                rows={7}
                autoExpand={{ on: true, maxHeight: 300 }}
              />
            </BlueBox>
          </Box>
        )}
        <Box marginBottom={10}>
          <PdfButton
            caseId={workingCase.id}
            title={formatMessage(cStrings.pdfButtonIndictment)}
            pdfType="indictment"
            elementId="Ákæra"
          />
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          nextButtonIcon="arrowForward"
          previousUrl={`${constants.INDICTMENTS_PROCESSING_ROUTE}/${workingCase.id}`}
          onNextButtonClick={() =>
            handleNavigationTo(constants.INDICTMENTS_OVERVIEW_ROUTE)
          }
          nextIsDisabled={!stepIsValid}
          nextIsLoading={isLoadingWorkingCase}
        />
      </FormContentContainer>
    </PageLayout>
  )
}

export default Indictment
