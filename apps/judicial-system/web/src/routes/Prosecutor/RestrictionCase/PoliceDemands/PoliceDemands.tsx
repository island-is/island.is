import React, { useCallback, useContext, useState } from 'react'
import { IntlShape, useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import { Box, Checkbox, Input, Text } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import { formatDate, formatDOB } from '@island.is/judicial-system/formatters'
import {
  CaseDecision,
  isAcceptingCaseDecision,
} from '@island.is/judicial-system/types'
import {
  core,
  rcDemands,
  rcReportForm,
  titles,
} from '@island.is/judicial-system-web/messages'
import {
  BlueBox,
  CheckboxList,
  DateTime,
  FormContentContainer,
  FormContext,
  FormFooter,
  PageLayout,
  ProsecutorCaseInfo,
} from '@island.is/judicial-system-web/src/components'
import PageHeader from '@island.is/judicial-system-web/src/components/PageHeader/PageHeader'
import {
  CaseCustodyRestrictions,
  CaseType,
  Defendant,
  Gender,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  removeTabsValidateAndSet,
  setCheckboxAndSendToServer,
  toggleInArray,
  validateAndSendToServer,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import {
  useCase,
  useDeb,
  useOnceOn,
} from '@island.is/judicial-system-web/src/utils/hooks'
import {
  autofillEntry,
  formatDateForServer,
} from '@island.is/judicial-system-web/src/utils/hooks/useCase'
import {
  legalProvisions,
  travelBanProvisions,
} from '@island.is/judicial-system-web/src/utils/laws'
import {
  restrictionsCheckboxes,
  travelBanRestrictionsCheckboxes,
} from '@island.is/judicial-system-web/src/utils/restrictions'
import { isPoliceDemandsStepValidRC } from '@island.is/judicial-system-web/src/utils/validate'

import * as styles from './PoliceDemands.css'

export interface DemandsAutofillProps {
  defendant: Defendant
  caseType: CaseType
  requestedValidToDate?: string | Date
  requestedCustodyRestrictions?: CaseCustodyRestrictions[]
  parentCaseDecision?: CaseDecision
  courtName?: string
}

export const getDemandsAutofill = (
  formatMessage: IntlShape['formatMessage'],
  props: DemandsAutofillProps,
): string => {
  const defendantDOB = formatDOB(
    props.defendant.nationalId,
    props.defendant.noNationalId,
    '',
  )
  return formatMessage(rcReportForm.sections.demands.autofill, {
    defendantName: props.defendant.name,
    defendantDOB: defendantDOB ? `, ${defendantDOB}, ` : ', ',
    isExtended:
      props.parentCaseDecision &&
      isAcceptingCaseDecision(props.parentCaseDecision),
    caseType: props.caseType,
    court: props.courtName?.replace('Héraðsdómur', 'Héraðsdóms'),
    requestedValidToDate: formatDate(props.requestedValidToDate, 'PPPPp')
      ?.replace('dagur,', 'dagsins')
      ?.replace(' kl.', ', kl.'),
    hasIsolationRequest: props.requestedCustodyRestrictions?.includes(
      CaseCustodyRestrictions.ISOLATION,
    ),
  })
}

export const PoliceDemands: React.FC<React.PropsWithChildren<unknown>> = () => {
  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
    isCaseUpToDate,
  } = useContext(FormContext)
  const router = useRouter()
  const { formatMessage } = useIntl()
  const [lawsBrokenErrorMessage, setLawsBrokenErrorMessage] =
    useState<string>('')
  const { updateCase, setAndSendCaseToServer } = useCase()
  useDeb(workingCase, [
    'lawsBroken',
    'legalBasis',
    'requestedOtherRestrictions',
  ])

  const initialize = useCallback(() => {
    if (
      !workingCase.requestedOtherRestrictions &&
      workingCase.requestedCustodyRestrictions &&
      workingCase.requestedCustodyRestrictions.indexOf(
        CaseCustodyRestrictions.ALTERNATIVE_TRAVEL_BAN_REQUIRE_NOTIFICATION,
      ) > -1 &&
      workingCase.defendants &&
      workingCase.defendants.length > 0
    ) {
      setAndSendCaseToServer(
        [
          {
            requestedOtherRestrictions: formatMessage(
              rcDemands.sections.custodyRestrictions
                .requestedOtherRestrictionsAutofill,
              { gender: workingCase.defendants[0].gender },
            ),
          },
        ],
        workingCase,
        setWorkingCase,
      )
    }
  }, [setAndSendCaseToServer, formatMessage, setWorkingCase, workingCase])

  useOnceOn(isCaseUpToDate, initialize)

  const onDemandsChange = React.useCallback(
    (
      entry: autofillEntry,
      caseType: CaseType,
      requestedValidToDate: Date | string | undefined,
      requestedCustodyRestrictions: CaseCustodyRestrictions[] | undefined,
    ) => {
      setAndSendCaseToServer(
        [
          entry,
          {
            demands:
              workingCase.defendants && workingCase.defendants.length
                ? getDemandsAutofill(formatMessage, {
                    defendant: workingCase.defendants[0],
                    caseType,
                    requestedValidToDate: requestedValidToDate,
                    parentCaseDecision: workingCase.parentCase?.decision,
                    requestedCustodyRestrictions: requestedCustodyRestrictions,
                    courtName: workingCase.court?.name,
                  })
                : undefined,
            force: true,
          },
        ],
        workingCase,
        setWorkingCase,
      )
    },
    [workingCase, formatMessage, setWorkingCase, setAndSendCaseToServer],
  )

  const stepIsValid = isPoliceDemandsStepValidRC(workingCase)
  const handleNavigationTo = (destination: string) =>
    router.push(`${destination}/${workingCase.id}`)

  return (
    <PageLayout
      workingCase={workingCase}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
      isValid={stepIsValid}
      onNavigationTo={handleNavigationTo}
    >
      <PageHeader
        title={formatMessage(titles.prosecutor.restrictionCases.policeDemands)}
      />
      <FormContentContainer>
        <Box marginBottom={7}>
          <Text as="h1" variant="h1">
            {formatMessage(rcDemands.heading)}
          </Text>
        </Box>
        <ProsecutorCaseInfo workingCase={workingCase} />
        <Box component="section" marginBottom={5}>
          <Box marginBottom={3}>
            <Text as="h3" variant="h3">
              {formatMessage(rcDemands.sections.demands.heading)}
            </Text>
            {workingCase.parentCase && (
              <Box marginTop={1}>
                <Text>
                  {formatMessage(rcDemands.sections.demands.pastRestriction, {
                    caseType: workingCase.type,
                  })}
                  <Text as="span" fontWeight="semiBold">
                    {formatDate(
                      workingCase.parentCase.validToDate,
                      'PPPPp',
                    )?.replace('dagur,', 'dagsins')}
                  </Text>
                </Text>
              </Box>
            )}
          </Box>
          <BlueBox>
            <Box
              marginBottom={workingCase.type !== CaseType.TRAVEL_BAN ? 2 : 0}
            >
              <DateTime
                name="reqValidToDate"
                datepickerLabel={formatMessage(
                  rcDemands.sections.demands.restrictionValidDateLabel,
                  { caseType: workingCase.type },
                )}
                minDate={new Date()}
                selectedDate={workingCase.requestedValidToDate}
                onChange={(date: Date | undefined, valid: boolean) => {
                  if (date && valid) {
                    onDemandsChange(
                      {
                        requestedValidToDate: formatDateForServer(date),
                        force: true,
                      },
                      workingCase.type,
                      date,
                      workingCase.requestedCustodyRestrictions,
                    )
                  }
                }}
                required
                blueBox={false}
              />
            </Box>
            {workingCase.type !== CaseType.TRAVEL_BAN && (
              <div className={styles.grid}>
                <Checkbox
                  name="isIsolation"
                  label={formatMessage(rcDemands.sections.demands.isolation)}
                  tooltip={formatMessage(rcDemands.sections.demands.tooltip)}
                  checked={workingCase.requestedCustodyRestrictions?.includes(
                    CaseCustodyRestrictions.ISOLATION,
                  )}
                  onChange={() => {
                    const nextRequestedCustodyRestrictions = toggleInArray(
                      workingCase.requestedCustodyRestrictions,
                      CaseCustodyRestrictions.ISOLATION,
                    )
                    onDemandsChange(
                      {
                        requestedCustodyRestrictions:
                          nextRequestedCustodyRestrictions,
                        force: true,
                      },
                      workingCase.type,
                      workingCase.requestedValidToDate,
                      nextRequestedCustodyRestrictions,
                    )
                  }}
                  large
                  filled
                />
                <Checkbox
                  name="isAdmissionToFacility"
                  tooltip={formatMessage(
                    rcDemands.sections.demands
                      .admissionToAppropriateFacilityTooltip,
                  )}
                  label={formatMessage(
                    rcDemands.sections.demands.admissionToAppropriateFacility,
                  )}
                  checked={workingCase.type === CaseType.ADMISSION_TO_FACILITY}
                  onChange={(event) => {
                    if (workingCase.parentCase) {
                      return
                    }

                    const nextCaseType = event.target.checked
                      ? CaseType.ADMISSION_TO_FACILITY
                      : CaseType.CUSTODY
                    onDemandsChange(
                      {
                        type: nextCaseType,
                        force: true,
                      },
                      nextCaseType,
                      workingCase.requestedValidToDate,
                      workingCase.requestedCustodyRestrictions,
                    )
                  }}
                  large
                  filled
                  disabled={Boolean(workingCase.parentCase)}
                />
              </div>
            )}
          </BlueBox>
        </Box>
        {workingCase.defendants && workingCase.defendants.length > 0 && (
          <Box component="section" marginBottom={7}>
            <Box marginBottom={3}>
              <Text as="h3" variant="h3">
                {formatMessage(rcDemands.sections.lawsBroken.heading)}
              </Text>
            </Box>
            <Input
              data-testid="lawsBroken"
              name="lawsBroken"
              label={formatMessage(rcDemands.sections.lawsBroken.label, {
                defendant: formatMessage(core.accused, {
                  suffix:
                    workingCase.defendants[0].gender === Gender.FEMALE
                      ? 'u'
                      : 'a',
                }),
              })}
              placeholder={formatMessage(
                rcDemands.sections.lawsBroken.placeholder,
              )}
              value={workingCase.lawsBroken || ''}
              errorMessage={lawsBrokenErrorMessage}
              hasError={lawsBrokenErrorMessage !== ''}
              onChange={(event) =>
                removeTabsValidateAndSet(
                  'lawsBroken',
                  event.target.value,
                  ['empty'],
                  workingCase,
                  setWorkingCase,
                  lawsBrokenErrorMessage,
                  setLawsBrokenErrorMessage,
                )
              }
              onBlur={(event) =>
                validateAndSendToServer(
                  'lawsBroken',
                  event.target.value,
                  ['empty'],
                  workingCase,
                  updateCase,
                  setLawsBrokenErrorMessage,
                )
              }
              required
              textarea
              rows={7}
              autoExpand={{ on: true, maxHeight: 300 }}
            />
          </Box>
        )}
        <Box component="section" marginBottom={5}>
          <Box marginBottom={3}>
            <Text as="h3" variant="h3">
              {formatMessage(rcDemands.sections.legalBasis.heading)}{' '}
              <Text as="span" color={'red600'} fontWeight="semiBold">
                *
              </Text>
            </Text>
          </Box>
          <BlueBox>
            <Box marginBottom={2}>
              <CheckboxList
                checkboxes={
                  workingCase.type === CaseType.CUSTODY ||
                  workingCase.type === CaseType.ADMISSION_TO_FACILITY
                    ? legalProvisions
                    : travelBanProvisions
                }
                selected={workingCase.legalProvisions}
                onChange={(id) =>
                  setCheckboxAndSendToServer(
                    'legalProvisions',
                    id,
                    workingCase,
                    setWorkingCase,
                    updateCase,
                  )
                }
              />
            </Box>
            <Input
              data-testid="legalBasis"
              name="legalBasis"
              label={formatMessage(
                rcDemands.sections.legalBasis.legalBasisLabel,
              )}
              placeholder={formatMessage(
                rcDemands.sections.legalBasis.legalBasisPlaceholder,
              )}
              value={workingCase.legalBasis || ''}
              onChange={(event) =>
                removeTabsValidateAndSet(
                  'legalBasis',
                  event.target.value,
                  [],
                  workingCase,
                  setWorkingCase,
                )
              }
              onBlur={(event) =>
                validateAndSendToServer(
                  'legalBasis',
                  event.target.value,
                  [],
                  workingCase,
                  updateCase,
                )
              }
              textarea
              rows={7}
              autoExpand={{ on: true, maxHeight: 300 }}
            />
          </BlueBox>
        </Box>
        {(workingCase.type === CaseType.CUSTODY ||
          workingCase.type === CaseType.ADMISSION_TO_FACILITY) && (
          <Box
            component="section"
            marginBottom={10}
            data-testid="custodyRestrictions"
          >
            <Box marginBottom={3}>
              <Box marginBottom={1}>
                <Text as="h3" variant="h3">
                  {formatMessage(
                    rcDemands.sections.custodyRestrictions.headingV2,
                    {
                      caseType: workingCase.type,
                    },
                  )}
                </Text>
              </Box>
              <Text>
                {formatMessage(
                  rcDemands.sections.custodyRestrictions.subHeadingV2,
                  {
                    caseType: workingCase.type,
                  },
                )}
              </Text>
            </Box>
            <BlueBox>
              <CheckboxList
                checkboxes={restrictionsCheckboxes}
                selected={workingCase.requestedCustodyRestrictions}
                onChange={(id) =>
                  setCheckboxAndSendToServer(
                    'requestedCustodyRestrictions',
                    id,
                    workingCase,
                    setWorkingCase,
                    updateCase,
                  )
                }
              />
            </BlueBox>
          </Box>
        )}
        {workingCase.type === CaseType.TRAVEL_BAN && (
          <Box
            component="section"
            marginBottom={4}
            data-testid="travelBanRestrictions"
          >
            <Box marginBottom={3}>
              <Text as="h3" variant="h3">
                {formatMessage(
                  rcDemands.sections.custodyRestrictions.headingV2,
                  {
                    caseType: workingCase.type,
                  },
                )}
              </Text>
              <Text>
                {formatMessage(
                  rcDemands.sections.custodyRestrictions.subHeadingV2,
                  {
                    caseType: workingCase.type,
                  },
                )}
              </Text>
            </Box>
            <BlueBox>
              <Box marginBottom={3}>
                <CheckboxList
                  checkboxes={travelBanRestrictionsCheckboxes}
                  selected={workingCase.requestedCustodyRestrictions}
                  onChange={(id) =>
                    setCheckboxAndSendToServer(
                      'requestedCustodyRestrictions',
                      id,
                      workingCase,
                      setWorkingCase,
                      updateCase,
                    )
                  }
                  fullWidth
                />
              </Box>
              <Input
                name="requestedOtherRestrictions"
                data-testid="requestedOtherRestrictions"
                label={formatMessage(
                  rcDemands.sections.custodyRestrictions.label,
                )}
                value={workingCase.requestedOtherRestrictions || ''}
                placeholder={formatMessage(
                  rcDemands.sections.custodyRestrictions.placeholder,
                )}
                onChange={(event) =>
                  removeTabsValidateAndSet(
                    'requestedOtherRestrictions',
                    event.target.value,
                    [],
                    workingCase,
                    setWorkingCase,
                  )
                }
                onBlur={(event) =>
                  validateAndSendToServer(
                    'requestedOtherRestrictions',
                    event.target.value,
                    [],
                    workingCase,
                    updateCase,
                  )
                }
                rows={10}
                autoExpand={{ on: true, maxHeight: 500 }}
                textarea
              />
            </BlueBox>
          </Box>
        )}
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          nextButtonIcon="arrowForward"
          previousUrl={`${constants.RESTRICTION_CASE_HEARING_ARRANGEMENTS_ROUTE}/${workingCase.id}`}
          onNextButtonClick={() =>
            handleNavigationTo(constants.RESTRICTION_CASE_POLICE_REPORT_ROUTE)
          }
          nextIsDisabled={!stepIsValid}
        />
      </FormContentContainer>
    </PageLayout>
  )
}

export default PoliceDemands
