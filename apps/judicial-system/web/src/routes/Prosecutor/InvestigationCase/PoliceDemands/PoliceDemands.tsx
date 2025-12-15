import { useCallback, useContext, useState } from 'react'
import { MessageDescriptor, useIntl } from 'react-intl'
import router from 'next/router'

import { Box, Input, Text } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import { enumerate, formatDOB } from '@island.is/judicial-system/formatters'
import {
  core,
  icDemands,
  titles,
} from '@island.is/judicial-system-web/messages'
import {
  FormContentContainer,
  FormContext,
  FormFooter,
  PageHeader,
  PageLayout,
  PageTitle,
  ProsecutorCaseInfo,
} from '@island.is/judicial-system-web/src/components'
import { CaseType } from '@island.is/judicial-system-web/src/graphql/schema'
import {
  removeTabsValidateAndSet,
  validateAndSendToServer,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import {
  useCase,
  useDeb,
  useOnceOn,
} from '@island.is/judicial-system-web/src/utils/hooks'
import { isPoliceDemandsStepValidIC } from '@island.is/judicial-system-web/src/utils/validate'

export const formatInstitutionName = (name?: string | null) => {
  if (!name) return ''

  if (name.startsWith('Lögreglustjórinn')) {
    return name.replace('Lögreglustjórinn', 'lögreglustjóranum')
  }
  if (name.endsWith('saksóknari')) {
    return name.toLocaleLowerCase().replace('saksóknari', 'saksóknara')
  }

  return ''
}

const PoliceDemands = () => {
  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
    isCaseUpToDate,
  } = useContext(FormContext)
  const { formatMessage } = useIntl()
  const { updateCase, setAndSendCaseToServer } = useCase()
  const [demandsEM, setDemandsEM] = useState<string>('')
  const [lawsBrokenEM, setLawsBrokenEM] = useState<string>('')
  const [legalBasisEM, setLegalBasisEM] = useState<string>('')

  useDeb(workingCase, ['demands', 'lawsBroken', 'legalBasis'])

  const initialize = useCallback(() => {
    const courtClaimPrefill: Partial<
      Record<
        CaseType,
        {
          text: MessageDescriptor
          format?: {
            court?: boolean
            accused?: boolean
            address?: boolean
            institution?: boolean
            year?: boolean
            live?: boolean
          }
        }
      >
    > = {
      [CaseType.SEARCH_WARRANT]: {
        text: icDemands.sections.demands.prefill.searchWarrant2,
        format: {
          court: true,
          accused: true,
          address: true,
          institution: true,
          live: true,
        },
      },
      [CaseType.BANKING_SECRECY_WAIVER]: {
        text: icDemands.sections.demands.prefill.bankingSecrecyWaiver2,
        format: { court: true, accused: true },
      },
      [CaseType.PHONE_TAPPING]: {
        text: icDemands.sections.demands.prefill.phoneTapping2,
        format: { court: true, institution: true, accused: true },
      },
      [CaseType.TELECOMMUNICATIONS]: {
        text: icDemands.sections.demands.prefill.teleCommunications2,
        format: { court: true, institution: true, accused: true },
      },
      [CaseType.TRACKING_EQUIPMENT]: {
        text: icDemands.sections.demands.prefill.trackingEquipment2,
        format: { court: true, institution: true, accused: true },
      },
      [CaseType.ELECTRONIC_DATA_DISCOVERY_INVESTIGATION]: {
        text: icDemands.sections.demands.prefill
          .electronicDataDiscoveryInvestigation,
        format: {
          court: true,
          institution: true,
          accused: true,
          address: true,
          year: true,
        },
      },
      [CaseType.PAROLE_REVOCATION]: {
        text: icDemands.sections.demands.prefill.paroleRevocation,
        format: { court: true, accused: true },
      },
    }

    if (workingCase.defendants && workingCase.defendants.length > 0) {
      const courtClaim = workingCase.type && courtClaimPrefill[workingCase.type]
      const courtClaimText = courtClaim
        ? formatMessage(courtClaim.text, {
            ...(courtClaim.format?.accused && {
              accused: enumerate(
                workingCase.defendants.map(
                  (defendant) =>
                    `${defendant.name} ${`${formatDOB(
                      defendant.nationalId,
                      defendant.noNationalId,
                      '',
                    )}`.trim()}`,
                ),
                formatMessage(core.and),
              ),
            }),
            ...(courtClaim.format?.address && {
              address: workingCase.defendants.find((x) => x.address)?.address,
            }),
            ...(courtClaim.format?.court && {
              court: workingCase.court?.name,
            }),
            ...(courtClaim.format?.institution && {
              institution: formatInstitutionName(
                workingCase.prosecutorsOffice?.name,
              ),
            }),
            ...(courtClaim.format?.live && {
              live: workingCase.defendants.length,
            }),
            ...(courtClaim.format?.year && {
              year: new Date().getFullYear(),
            }),
          })
        : undefined

      setAndSendCaseToServer(
        [{ demands: courtClaimText }],
        workingCase,
        setWorkingCase,
      )
    }
  }, [setAndSendCaseToServer, formatMessage, setWorkingCase, workingCase])

  useOnceOn(isCaseUpToDate, initialize)

  const handleNavigationTo = useCallback(
    (destination: string) => router.push(`${destination}/${workingCase.id}`),
    [workingCase.id],
  )

  const stepIsValid = isPoliceDemandsStepValidIC(workingCase)

  return (
    <PageLayout
      workingCase={workingCase}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
      isExtension={!!workingCase.parentCase}
      isValid={stepIsValid}
      onNavigationTo={handleNavigationTo}
    >
      <PageHeader
        title={formatMessage(
          titles.prosecutor.investigationCases.policeDemands,
        )}
      />
      <FormContentContainer>
        <PageTitle>{formatMessage(icDemands.heading)}</PageTitle>
        <Box marginBottom={5}>
          <ProsecutorCaseInfo workingCase={workingCase} />
        </Box>
        <Box component="section" marginBottom={5}>
          <Box marginBottom={3}>
            <Text as="h3" variant="h3">
              {formatMessage(icDemands.sections.demands.heading)}
            </Text>
          </Box>
          <Input
            data-testid="demands"
            name="demands"
            label={formatMessage(icDemands.sections.demands.label)}
            placeholder={formatMessage(icDemands.sections.demands.placeholder)}
            value={workingCase.demands || ''}
            errorMessage={demandsEM}
            hasError={demandsEM !== ''}
            onChange={(event) =>
              removeTabsValidateAndSet(
                'demands',
                event.target.value,
                ['empty'],
                setWorkingCase,
                demandsEM,
                setDemandsEM,
              )
            }
            onBlur={(event) =>
              validateAndSendToServer(
                'demands',
                event.target.value,
                ['empty'],
                workingCase,
                updateCase,
                setDemandsEM,
              )
            }
            required
            textarea
            rows={7}
          />
        </Box>
        <Box component="section" marginBottom={5}>
          <Box marginBottom={3}>
            <Text as="h3" variant="h3">
              {formatMessage(icDemands.sections.lawsBroken.heading)}
            </Text>
          </Box>
          <Input
            data-testid="lawsBroken"
            name="lawsBroken"
            label={formatMessage(icDemands.sections.lawsBroken.label, {
              defendant: 'varnaraðila',
            })}
            placeholder={formatMessage(
              icDemands.sections.lawsBroken.placeholder,
            )}
            value={workingCase.lawsBroken || ''}
            errorMessage={lawsBrokenEM}
            hasError={lawsBrokenEM !== ''}
            onChange={(event) =>
              removeTabsValidateAndSet(
                'lawsBroken',
                event.target.value,
                ['empty'],
                setWorkingCase,
                lawsBrokenEM,
                setLawsBrokenEM,
              )
            }
            onBlur={(event) =>
              validateAndSendToServer(
                'lawsBroken',
                event.target.value,
                ['empty'],
                workingCase,
                updateCase,
                setLawsBrokenEM,
              )
            }
            required
            textarea
            rows={7}
          />
        </Box>
        <Box component="section" marginBottom={10}>
          <Box marginBottom={3}>
            <Text as="h3" variant="h3">
              {formatMessage(icDemands.sections.legalBasis.heading)}
            </Text>
          </Box>
          <Input
            data-testid="legalBasis"
            name="legalBasis"
            label={formatMessage(icDemands.sections.legalBasis.label)}
            placeholder={formatMessage(
              icDemands.sections.legalBasis.placeholder,
            )}
            value={workingCase.legalBasis || ''}
            errorMessage={legalBasisEM}
            hasError={legalBasisEM !== ''}
            onChange={(event) =>
              removeTabsValidateAndSet(
                'legalBasis',
                event.target.value,
                ['empty'],
                setWorkingCase,
                legalBasisEM,
                setLegalBasisEM,
              )
            }
            onBlur={(event) =>
              validateAndSendToServer(
                'legalBasis',
                event.target.value,
                ['empty'],
                workingCase,
                updateCase,
                setLegalBasisEM,
              )
            }
            required
            textarea
            rows={7}
          />
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          nextButtonIcon="arrowForward"
          previousUrl={`${constants.INVESTIGATION_CASE_HEARING_ARRANGEMENTS_ROUTE}/${workingCase.id}`}
          onNextButtonClick={() =>
            handleNavigationTo(constants.INVESTIGATION_CASE_POLICE_REPORT_ROUTE)
          }
          nextIsDisabled={!stepIsValid}
          nextIsLoading={isLoadingWorkingCase}
        />
      </FormContentContainer>
    </PageLayout>
  )
}

export default PoliceDemands
