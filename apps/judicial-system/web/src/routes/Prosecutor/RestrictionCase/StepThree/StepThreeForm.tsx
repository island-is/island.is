import React, { useState } from 'react'
import { useIntl } from 'react-intl'

import {
  Box,
  Text,
  Input,
  Checkbox,
  GridRow,
  GridColumn,
} from '@island.is/island-ui/core'
import { formatDate } from '@island.is/judicial-system/formatters'
import {
  CaseCustodyRestrictions,
  CaseType,
  Gender,
  User,
} from '@island.is/judicial-system/types'
import {
  BlueBox,
  CaseInfo,
  DateTime,
  FormContentContainer,
  FormFooter,
} from '@island.is/judicial-system-web/src/components'
import {
  setAndSendDateToServer,
  removeTabsValidateAndSet,
  setCheckboxAndSendToServer,
  validateAndSendToServer,
  setAndSendToServer,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import CheckboxList from '@island.is/judicial-system-web/src/components/CheckboxList/CheckboxList'
import {
  legalProvisions,
  travelBanProvisions,
} from '@island.is/judicial-system-web/src/utils/laws'
import {
  travelBanRestrictionsCheckboxes,
  restrictionsCheckboxes,
} from '@island.is/judicial-system-web/src/utils/restrictions'
import { isPoliceDemandsStepValidRC } from '@island.is/judicial-system-web/src/utils/validate'
import { rcDemands } from '@island.is/judicial-system-web/messages/RestrictionCases/Prosecutor/demandsForm'
import { core } from '@island.is/judicial-system-web/messages'
import useDeb from '@island.is/judicial-system-web/src/utils/hooks/useDeb'
import type { Case } from '@island.is/judicial-system/types'
import * as Constants from '@island.is/judicial-system/consts'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case>>
  user?: User
}

const StepThreeForm: React.FC<Props> = (props) => {
  const { workingCase, setWorkingCase, user } = props
  const [lawsBrokenErrorMessage, setLawsBrokenErrorMessage] = useState<string>(
    '',
  )

  const { updateCase } = useCase()
  const { formatMessage } = useIntl()

  useDeb(workingCase, 'lawsBroken')
  useDeb(workingCase, 'legalBasis')
  useDeb(workingCase, 'requestedOtherRestrictions')

  return (
    <>
      <FormContentContainer>
        <Box marginBottom={7}>
          <Text as="h1" variant="h1">
            {formatMessage(rcDemands.heading)}
          </Text>
        </Box>
        <Box marginBottom={7}>
          <CaseInfo
            workingCase={workingCase}
            userRole={user?.role}
            showAdditionalInfo
          />
        </Box>
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
              marginBottom={workingCase.type !== CaseType.TRAVEL_BAN ? 3 : 0}
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
                  setAndSendDateToServer(
                    'requestedValidToDate',
                    date,
                    valid,
                    workingCase,
                    setWorkingCase,
                    updateCase,
                  )
                }}
                required
                blueBox={false}
              />
            </Box>
            {workingCase.type !== CaseType.TRAVEL_BAN && (
              <GridRow>
                <GridColumn span="1/2">
                  <Checkbox
                    name="isIsolation"
                    label={formatMessage(rcDemands.sections.demands.isolation)}
                    tooltip={formatMessage(rcDemands.sections.demands.tooltip)}
                    checked={workingCase.requestedCustodyRestrictions?.includes(
                      CaseCustodyRestrictions.ISOLATION,
                    )}
                    onChange={() =>
                      setCheckboxAndSendToServer(
                        'requestedCustodyRestrictions',
                        'ISOLATION',
                        workingCase,
                        setWorkingCase,
                        updateCase,
                      )
                    }
                    large
                    filled
                  />
                </GridColumn>
                <GridColumn span="1/2">
                  <Checkbox
                    name="isAdmissionToFacility"
                    label={formatMessage(
                      rcDemands.sections.demands.admissionToAppropriateFacility,
                    )}
                    // tooltip={formatMessage(rcDemands.sections.demands.tooltip)}
                    checked={
                      workingCase.type === CaseType.ADMISSION_TO_FACILITY
                    }
                    onChange={(event) => {
                      setAndSendToServer(
                        'type',
                        event.target.checked
                          ? CaseType.ADMISSION_TO_FACILITY
                          : CaseType.CUSTODY,
                        workingCase,
                        setWorkingCase,
                        updateCase,
                      )
                    }}
                    large
                    filled
                  />
                </GridColumn>
              </GridRow>
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
        {workingCase.type === CaseType.CUSTODY ||
          (workingCase.type === CaseType.ADMISSION_TO_FACILITY && (
            <Box component="section" marginBottom={10}>
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
          ))}
        {workingCase.type === CaseType.TRAVEL_BAN && (
          <Box component="section" marginBottom={4}>
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
          previousUrl={`${Constants.STEP_TWO_ROUTE}/${workingCase.id}`}
          nextUrl={`${Constants.STEP_FOUR_ROUTE}/${workingCase.id}`}
          nextIsDisabled={!isPoliceDemandsStepValidRC(workingCase)}
        />
      </FormContentContainer>
    </>
  )
}

export default StepThreeForm
