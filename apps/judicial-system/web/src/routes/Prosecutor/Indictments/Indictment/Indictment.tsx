import { useCallback, useContext, useMemo } from 'react'
import { IntlShape, useIntl } from 'react-intl'
import { applyCase as applyCaseToAddress } from 'beygla/addresses'
import { applyCase } from 'beygla/strict'
import { AnimatePresence, motion } from 'motion/react'
import router from 'next/router'

import { Box, Button, Checkbox, Input } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import {
  applyDativeCaseToCourtName,
  formatNationalId,
} from '@island.is/judicial-system/formatters'
import { getIndictmentCountCompare } from '@island.is/judicial-system/types'
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
import InputPenalties from '@island.is/judicial-system-web/src/components/Inputs/InputPenalties'
import {
  CaseOrigin,
  Defendant,
  IndictmentCount as TIndictmentCount,
  IndictmentCountOffense,
  Institution,
  Maybe,
  Offense,
  PoliceCaseInfo,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  UpdateIndictmentCount,
  useCase,
  useDebouncedInput,
  useIndictmentCounts,
  useOnceOn,
} from '@island.is/judicial-system-web/src/utils/hooks'
import { getDefaultDefendantGender } from '@island.is/judicial-system-web/src/utils/utils'
import { isIndictmentStepValid } from '@island.is/judicial-system-web/src/utils/validate'

import { usePoliceCaseInfoQuery } from '../Defendant/PoliceCaseList/PoliceCaseInfo/policeCaseInfo.generated'
import { IndictmentCount } from './IndictmentCount'
import { strings } from './Indictment.strings'
import * as styles from './Indictment.css'

export const getIndictmentIntroductionAutofill = (
  formatMessage: IntlShape['formatMessage'],
  prosecutorsOffice?: Maybe<Institution> | undefined,
  court?: Maybe<Institution> | undefined,
  defendants?: Maybe<Defendant[]> | undefined,
) => {
  return defendants && defendants.length > 0
    ? [
        prosecutorsOffice?.name?.toUpperCase(),
        `\n\n${formatMessage(strings.indictmentIntroductionAutofillAnnounces)}`,
        `\n\n${formatMessage(strings.indictmentIntroductionAutofillCourt, {
          court: applyDativeCaseToCourtName(court?.name || 'héraðsdómi'),
        })}`,
        `\n\n${defendants
          .map((defendant) => {
            return `\n          ${formatMessage(
              strings.indictmentIntroductionAutofillDefendant,
              {
                defendantName: defendant.name
                  ? applyCase('þgf', defendant.name)
                  : 'Ekki skráð',
                defendantNationalId: defendant.nationalId
                  ? formatNationalId(defendant.nationalId)
                  : 'Ekki skráð',
              },
            )}\n          ${
              defendant.address
                ? applyCaseToAddress('þgf', defendant.address)
                : 'Ekki skráð'
            },`
          })
          .join('')}`,
      ]
    : []
}

const suspensionOffenses = [
  IndictmentCountOffense.DRIVING_WITHOUT_EVER_HAVING_LICENSE,
  IndictmentCountOffense.DRUNK_DRIVING,
  IndictmentCountOffense.ILLEGAL_DRUGS_DRIVING,
  IndictmentCountOffense.PRESCRIPTION_DRUGS_DRIVING,
]

const getSuspensionOffenses = (
  indictmentCounts?: TIndictmentCount[] | null,
) => {
  const offenses =
    indictmentCounts?.flatMap(
      (indictmentCount) =>
        indictmentCount.offenses
          ?.filter((offense) => suspensionOffenses.includes(offense.offense))
          .map((offense) => offense.offense) ?? [],
    ) ?? []

  return new Set(offenses)
}

const Indictment = () => {
  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
    isCaseUpToDate,
  } = useContext(FormContext)

  const demandsInput = useDebouncedInput('demands', ['empty'])
  const civilDemandsInput = useDebouncedInput('civilDemands', ['empty'])
  const indictmentIntroductionInput = useDebouncedInput(
    'indictmentIntroduction',
    ['empty'],
  )

  const { formatMessage } = useIntl()
  const { setAndSendCaseToServer } = useCase()
  const {
    createIndictmentCount,
    updateIndictmentCount,
    deleteIndictmentCount,
    updateIndictmentCountState,
  } = useIndictmentCounts()

  const gender = getDefaultDefendantGender(workingCase.defendants)

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
      } else {
        return data as PoliceCaseInfo[]
      }
    },
  })

  const stepIsValid = isIndictmentStepValid(workingCase)

  const handleNavigationTo = useCallback(
    (destination: string) => router.push(`${destination}/${workingCase.id}`),
    [workingCase.id],
  )

  const getDemands = useCallback(
    (
      trafficViolationOffenses: Set<IndictmentCountOffense>,
      requestDriversLicenseSuspension?: boolean | null,
    ) => {
      // If suspension is not requested, then use the default demands
      if (!requestDriversLicenseSuspension) {
        return strings.demandsAutofill[gender]
      }

      // Suspension is requested
      const hasDrivenWithoutEverHavingLicense = trafficViolationOffenses.has(
        IndictmentCountOffense.DRIVING_WITHOUT_EVER_HAVING_LICENSE,
      )

      // If driving without ever having license, then use the future-suspension demands
      if (hasDrivenWithoutEverHavingLicense) {
        // If any other suspension offense is present, then use the future-suspension demands
        // with the future license suspension
        const hasAnyOtherSuspensionOffense = trafficViolationOffenses.size > 1

        return hasAnyOtherSuspensionOffense
          ? strings
              .demandsAutofillWithFutureLicenseAndUnderTheInfluenceSuspensions[
              gender
            ]
          : strings.demandsAutofillWithFutureLicenseSuspension[gender]
      }

      // If any other suspension offense is present, then use the under-the-influence-suspension demands
      if (trafficViolationOffenses.size > 0) {
        return strings.demandsAutofillWithUnderTheInfluenceLicenseSuspension[
          gender
        ]
      }

      // Otherwise, use the speeding-suspension demands
      return strings.demandsAutofillWithSpeedingLicenseSuspension[gender]
    },
    [gender],
  )

  const setSuspensionRequest = useCallback(
    (
      prevSuspensionOffenses: Set<IndictmentCountOffense>,
      newSuspensionOffenses: Set<IndictmentCountOffense>,
      prevRequestDriversLicenseSuspension?: boolean | null,
    ) => {
      // If the user manually deselected suspension, then we have nothing to do
      if (
        prevSuspensionOffenses.size > 0 &&
        !prevRequestDriversLicenseSuspension
      ) {
        return
      }

      // If the user manually selected suspension and a suspension offense is not being added,
      // then we have nothing to do
      // Note that adding a suspension offense changes the demand text
      if (
        prevSuspensionOffenses.size === 0 &&
        prevRequestDriversLicenseSuspension &&
        newSuspensionOffenses.size === 0
      ) {
        return
      }

      // If we have any suspension offenses,
      // then by default the prosecutor requests a suspension
      const requestDriversLicenseSuspension = newSuspensionOffenses.size > 0

      const demands = getDemands(
        newSuspensionOffenses,
        requestDriversLicenseSuspension,
      )

      if (
        requestDriversLicenseSuspension !==
          workingCase.requestDriversLicenseSuspension ||
        workingCase.demands !== demands
      ) {
        setAndSendCaseToServer(
          [{ requestDriversLicenseSuspension, demands, force: true }],
          workingCase,
          setWorkingCase,
        )
      }
    },
    [getDemands, setAndSendCaseToServer, setWorkingCase, workingCase],
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

    setWorkingCase((prevWorkingCase) => ({
      ...prevWorkingCase,
      indictmentCounts,
    }))
  }, [
    createIndictmentCount,
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

      const prevSuspensionOffenses = getSuspensionOffenses(
        workingCase.indictmentCounts,
      )

      const newSuspensionOffenses = getSuspensionOffenses(
        workingCase.indictmentCounts?.map((count) =>
          count.id === indictmentCountId
            ? {
                ...returnedIndictmentCount,
                offenses: updatedOffenses ?? count.offenses,
              }
            : count,
        ),
      )

      if (updatedOffenses && updatedOffenses?.length > 0) {
        setSuspensionRequest(
          prevSuspensionOffenses,
          newSuspensionOffenses,
          workingCase.requestDriversLicenseSuspension,
        )
      }

      updateIndictmentCountState(
        indictmentCountId,
        returnedIndictmentCount,
        setWorkingCase,
        updatedOffenses,
      )
    },
    [
      policeCaseData?.policeCaseInfo,
      setSuspensionRequest,
      setWorkingCase,
      updateIndictmentCount,
      updateIndictmentCountState,
      workingCase.id,
      workingCase.indictmentCounts,
      workingCase.requestDriversLicenseSuspension,
    ],
  )

  const handleDeleteIndictmentCount = useCallback(
    async (indictmentCountId: string) => {
      if (
        workingCase.indictmentCounts &&
        workingCase.indictmentCounts.length > 1
      ) {
        const deleted = await deleteIndictmentCount(
          workingCase.id,
          indictmentCountId,
        )

        if (!deleted) {
          return
        }

        // Remove the deleted indictment count from the working case
        const indictmentCounts = workingCase.indictmentCounts?.filter(
          (count) => count.id !== indictmentCountId,
        )

        setWorkingCase((prevWorkingCase) => ({
          ...prevWorkingCase,
          indictmentCounts,
        }))
      }
    },
    [
      deleteIndictmentCount,
      setWorkingCase,
      workingCase.id,
      workingCase.indictmentCounts,
    ],
  )

  const initialize = useCallback(() => {
    const indictmentCounts = workingCase.indictmentCounts || []

    if (indictmentCounts.length === 0) {
      handleCreateIndictmentCount()
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
          demands: getDemands(
            getSuspensionOffenses(indictmentCounts),
            workingCase.requestDriversLicenseSuspension,
          ),
        },
      ],
      workingCase,
      setWorkingCase,
    )
  }, [
    workingCase,
    setAndSendCaseToServer,
    formatMessage,
    getDemands,
    setWorkingCase,
    handleCreateIndictmentCount,
  ])

  useOnceOn(isCaseUpToDate, initialize)

  const indictmentCounts = useMemo(() => {
    const indictmentCounts = workingCase.indictmentCounts ?? []

    // We don't want to mutate the original array, so we create a copy
    return [...indictmentCounts].sort(
      getIndictmentCountCompare(workingCase.policeCaseNumbers),
    )
  }, [workingCase.indictmentCounts, workingCase.policeCaseNumbers])

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
        <PageTitle>{formatMessage(strings.heading)}</PageTitle>
        <Box display="flex" flexDirection="column" rowGap={5}>
          <ProsecutorCaseInfo workingCase={workingCase} />
          <Box component="section">
            <SectionHeading
              title={formatMessage(strings.indictmentIntroductionTitle)}
            />
            <Input
              name="indictmentIntroduction"
              label={formatMessage(strings.indictmentIntroductionLabel)}
              placeholder={formatMessage(
                strings.indictmentIntroductionPlaceholder,
              )}
              value={indictmentIntroductionInput.value ?? ''}
              errorMessage={indictmentIntroductionInput.errorMessage}
              hasError={indictmentIntroductionInput.hasError}
              onChange={(evt) =>
                indictmentIntroductionInput.onChange(evt.target.value)
              }
              onBlur={(evt) =>
                indictmentIntroductionInput.onBlur(evt.target.value)
              }
              textarea
              required
              autoComplete="off"
              rows={10}
            />
          </Box>
          <AnimatePresence>
            {indictmentCounts.map((indictmentCount, index) => (
              <motion.div
                key={indictmentCount.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <Box component="section">
                  <SectionHeading
                    title={formatMessage(strings.indictmentCountHeading, {
                      count: index + 1,
                    })}
                  />
                  <IndictmentCount
                    indictmentCount={indictmentCount}
                    workingCase={workingCase}
                    onDelete={
                      index > 0 ? handleDeleteIndictmentCount : undefined
                    }
                    onChange={handleUpdateIndictmentCount}
                    setWorkingCase={setWorkingCase}
                    updateIndictmentCountState={updateIndictmentCountState}
                  />
                </Box>
              </motion.div>
            ))}
          </AnimatePresence>
          <Box display="flex" justifyContent="flexEnd">
            <Button
              variant="ghost"
              icon="add"
              onClick={handleCreateIndictmentCount}
              disabled={false}
            >
              {formatMessage(strings.addIndictmentCount)}
            </Button>
          </Box>
          <Box component="section">
            <SectionHeading title={formatMessage(strings.demandsTitle)} />
            <BlueBox className={styles.demandsGrid}>
              <Checkbox
                name="requestDriversLicenseSuspension"
                label={formatMessage(strings.demandsRequestSuspension)}
                checked={Boolean(workingCase.requestDriversLicenseSuspension)}
                onChange={() => {
                  setAndSendCaseToServer(
                    [
                      {
                        requestDriversLicenseSuspension:
                          !workingCase.requestDriversLicenseSuspension,
                        demands: getDemands(
                          getSuspensionOffenses(workingCase.indictmentCounts),
                          !workingCase.requestDriversLicenseSuspension,
                        ),
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
              <Input
                name="demands"
                label={formatMessage(strings.demandsLabel)}
                placeholder={formatMessage(strings.demandsPlaceholder)}
                value={demandsInput.value ?? ''}
                onChange={(evt) => demandsInput.onChange(evt.target.value)}
                onBlur={(evt) => demandsInput.onBlur(evt.target.value)}
                errorMessage={demandsInput.errorMessage}
                hasError={demandsInput.hasError}
                autoComplete="off"
                rows={7}
                textarea
                required
              />
            </BlueBox>
          </Box>
          {workingCase.hasCivilClaims && (
            <Box component="section">
              <SectionHeading
                title={formatMessage(strings.civilDemandsTitle)}
              />
              <Input
                name="civilDemands"
                label={formatMessage(strings.civilDemandsLabel)}
                placeholder={formatMessage(strings.civilDemandsPlaceholder)}
                value={civilDemandsInput.value ?? ''}
                errorMessage={civilDemandsInput.errorMessage}
                hasError={civilDemandsInput.hasError}
                onChange={(evt) => civilDemandsInput.onChange(evt.target.value)}
                onBlur={(evt) => civilDemandsInput.onBlur(evt.target.value)}
                textarea
                autoComplete="off"
                required
                rows={7}
              />
            </Box>
          )}
          <Box component="section">
            <InputPenalties />
          </Box>
          <Box marginBottom={10}>
            <PdfButton
              caseId={workingCase.id}
              title={formatMessage(strings.pdfButtonIndictment)}
              pdfType="indictment"
              elementId="Ákæra"
            />
          </Box>
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
