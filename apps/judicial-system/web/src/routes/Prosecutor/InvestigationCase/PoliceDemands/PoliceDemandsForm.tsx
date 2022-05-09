import React, { useState, useEffect, useContext } from 'react'
import { MessageDescriptor, useIntl } from 'react-intl'

import { Box, Input, Text } from '@island.is/island-ui/core'
import {
  CaseInfo,
  FormContentContainer,
  FormFooter,
} from '@island.is/judicial-system-web/src/components'
import { CaseType } from '@island.is/judicial-system/types'
import type { Case } from '@island.is/judicial-system/types'
import { formatNationalId } from '@island.is/judicial-system/formatters'
import {
  removeTabsValidateAndSet,
  validateAndSendToServer,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import { isPoliceDemandsStepValidIC } from '@island.is/judicial-system-web/src/utils/validate'
import { icDemands, core } from '@island.is/judicial-system-web/messages'
import useDeb from '@island.is/judicial-system-web/src/utils/hooks/useDeb'
import { UserContext } from '@island.is/judicial-system-web/src/components/UserProvider/UserProvider'
import * as Constants from '@island.is/judicial-system/consts'
import { enumerate } from '@island.is/judicial-system-web/src/utils/formatters'

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
    text:
      icDemands.sections.demands.prefill.electronicDataDiscoveryInvestigation,
    format: {
      court: true,
      institution: true,
      accused: true,
      address: true,
      year: true,
    },
  },
}

export const formatInstitutionName = (name: string | undefined) => {
  if (!name) return ''

  if (name.startsWith('Lögreglustjórinn')) {
    return name.replace('Lögreglustjórinn', 'lögreglustjóranum')
  }
  if (name.endsWith('saksóknari')) {
    return name.toLocaleLowerCase().replace('saksóknari', 'saksóknara')
  }

  return ''
}

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case>>
  isLoading: boolean
  isCaseUpToDate: boolean
}

const PoliceDemandsForm: React.FC<Props> = (props) => {
  const { workingCase, setWorkingCase, isLoading, isCaseUpToDate } = props

  const { formatMessage } = useIntl()
  const [initialAutoFillDone, setInitialAutoFillDone] = useState(false)
  const { updateCase, autofill } = useCase()
  const { user } = useContext(UserContext)

  const [demandsEM, setDemandsEM] = useState<string>('')
  const [lawsBrokenEM, setLawsBrokenEM] = useState<string>('')
  const [legalBasisEM, setLegalBasisEM] = useState<string>('')

  useDeb(workingCase, 'demands')
  useDeb(workingCase, 'lawsBroken')
  useDeb(workingCase, 'legalBasis')

  useEffect(() => {
    if (isCaseUpToDate && !initialAutoFillDone) {
      if (
        workingCase &&
        workingCase.defendants &&
        workingCase.defendants.length > 0
      ) {
        const courtClaim = courtClaimPrefill[workingCase.type]
        const courtClaimText = courtClaim
          ? formatMessage(courtClaim.text, {
              ...(courtClaim.format?.accused && {
                accused: enumerate(
                  workingCase.defendants.map(
                    (defendant) =>
                      `${defendant.name}${
                        defendant.noNationalId
                          ? defendant.nationalId
                            ? ` fd. ${defendant.nationalId}`
                            : ''
                          : ` kt. ${formatNationalId(
                              defendant.nationalId ?? '',
                            )}`
                      }`,
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
                  workingCase.prosecutor?.institution?.name,
                ),
              }),
              ...(courtClaim.format?.live && {
                live: workingCase.defendants.length,
              }),
              ...(courtClaim.format?.year && {
                year: new Date().getFullYear(),
              }),
            })
          : ''

        autofill(
          [{ key: 'demands', value: courtClaimText }],
          workingCase,
          setWorkingCase,
        )
      }

      setInitialAutoFillDone(true)
    }
  }, [
    autofill,
    formatMessage,
    initialAutoFillDone,
    isCaseUpToDate,
    setWorkingCase,
    workingCase,
  ])

  return (
    <>
      <FormContentContainer>
        <Box marginBottom={7}>
          <Text as="h1" variant="h1">
            {formatMessage(icDemands.heading)}
          </Text>
        </Box>
        <Box component="section" marginBottom={7}>
          <CaseInfo
            workingCase={workingCase}
            userRole={user?.role}
            showAdditionalInfo
          />
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
                workingCase,
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
            autoExpand={{ on: true, maxHeight: 300 }}
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
                workingCase,
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
            autoExpand={{ on: true, maxHeight: 300 }}
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
                workingCase,
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
            autoExpand={{ on: true, maxHeight: 300 }}
          />
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={`${Constants.IC_HEARING_ARRANGEMENTS_ROUTE}/${workingCase.id}`}
          nextUrl={`${Constants.IC_POLICE_REPORT_ROUTE}/${workingCase.id}`}
          nextIsDisabled={!isPoliceDemandsStepValidIC(workingCase)}
          nextIsLoading={isLoading}
        />
      </FormContentContainer>
    </>
  )
}

export default PoliceDemandsForm
