import React, { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Input,
  RadioButton,
  Text,
} from '@island.is/island-ui/core'
import {
  FormFooter,
  PageLayout,
  BlueBox,
  CaseNumbers,
  FormContentContainer,
  TimeInputField,
} from '@island.is/judicial-system-web/src/shared-components'
import {
  CaseAppealDecision,
  CaseCustodyRestrictions,
  CaseDecision,
  CaseType,
  isAcceptingCaseDecision,
} from '@island.is/judicial-system/types'
import type { Case } from '@island.is/judicial-system/types'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'
import { parseString } from '@island.is/judicial-system-web/src/utils/formatters'
import { useQuery } from '@apollo/client'
import { CaseQuery } from '@island.is/judicial-system-web/graphql'
import {
  JudgeSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import {
  validateAndSendToServer,
  removeTabsValidateAndSet,
  setCheckboxAndSendToServer,
  validateAndSetTime,
  validateAndSendTimeToServer,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import CheckboxList from '@island.is/judicial-system-web/src/shared-components/CheckboxList/CheckboxList'
import {
  alternativeTravelBanRestrictions,
  restrictions,
} from '@island.is/judicial-system-web/src/utils/Restrictions'
import {
  capitalize,
  formatAccusedByGender,
  formatDate,
  formatNationalId,
  NounCases,
  TIME_FORMAT,
} from '@island.is/judicial-system/formatters'
import { useRouter } from 'next/router'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import { rcRulingStepTwo as m } from '@island.is/judicial-system-web/messages'
import { isRulingStepTwoValidRC } from '@island.is/judicial-system-web/src/utils/validate'

export const RulingStepTwo: React.FC = () => {
  const router = useRouter()
  const id = router.query.id
  const [workingCase, setWorkingCase] = useState<Case>()
  const [
    courtDocumentEndErrorMessage,
    setCourtDocumentEndErrorMessage,
  ] = useState<string>('')

  const { updateCase, autofill } = useCase()
  const { formatMessage } = useIntl()
  const { data, loading } = useQuery(CaseQuery, {
    variables: { input: { id: id } },
    fetchPolicy: 'no-cache',
  })

  useEffect(() => {
    document.title = 'Úrskurðarorð - Réttarvörslugátt'
  }, [])

  useEffect(() => {
    if (id && !workingCase && data?.case) {
      const theCase: Case = data.case
      const isolationEndsBeforeValidToDate =
        theCase.validToDate &&
        theCase.isolationToDate &&
        new Date(theCase.validToDate) > new Date(theCase.isolationToDate)

      // Normally we always autofill if the target has a "falsy" value.
      // However, if the target is optional, then it should not be autofilled after
      // the autofilled value has been deleted (is the empty string).
      if (
        theCase.requestedOtherRestrictions &&
        theCase.otherRestrictions !== ''
      ) {
        autofill(
          'otherRestrictions',
          theCase.requestedOtherRestrictions,
          theCase,
        )
      }

      autofill(
        'conclusion',
        theCase.decision === CaseDecision.DISMISSING
          ? formatMessage(m.sections.conclusion.dismissingAutofill, {
              genderedAccused: formatAccusedByGender(theCase.accusedGender),
              accusedName: theCase.accusedName,
              extensionSuffix:
                theCase.parentCase &&
                isAcceptingCaseDecision(theCase.parentCase.decision)
                  ? ' áframhaldandi'
                  : '',
              caseType:
                theCase.type === CaseType.CUSTODY
                  ? 'gæsluvarðhaldi'
                  : 'farbanni',
            })
          : theCase.decision === CaseDecision.REJECTING
          ? formatMessage(m.sections.conclusion.rejectingAutofill, {
              genderedAccused: formatAccusedByGender(theCase.accusedGender),
              accusedName: theCase.accusedName,
              accusedNationalId: formatNationalId(theCase.accusedNationalId),
              extensionSuffix:
                theCase.parentCase &&
                isAcceptingCaseDecision(theCase.parentCase.decision)
                  ? ' áframhaldandi'
                  : '',
              caseType:
                theCase.type === CaseType.CUSTODY
                  ? 'gæsluvarðhaldi'
                  : 'farbanni',
            })
          : formatMessage(m.sections.conclusion.acceptingAutofill, {
              genderedAccused: capitalize(
                formatAccusedByGender(theCase.accusedGender),
              ),
              accusedName: theCase.accusedName,
              accusedNationalId: formatNationalId(theCase.accusedNationalId),
              caseTypeAndExtensionSuffix:
                theCase.decision === CaseDecision.ACCEPTING
                  ? `${
                      theCase.parentCase &&
                      isAcceptingCaseDecision(theCase.parentCase.decision)
                        ? 'áframhaldandi '
                        : ''
                    }${
                      theCase.type === CaseType.CUSTODY
                        ? 'gæsluvarðhaldi'
                        : 'farbanni'
                    }`
                  : // decision === CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN
                    `${
                      theCase.parentCase?.decision ===
                      CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN
                        ? 'áframhaldandi '
                        : ''
                    }farbanni`,
              validToDate: `${formatDate(theCase.validToDate, 'PPPPp')
                ?.replace('dagur,', 'dagsins')
                ?.replace(' kl.', ', kl.')}`,
              isolationSuffix:
                isAcceptingCaseDecision(theCase.decision) &&
                theCase.custodyRestrictions?.includes(
                  CaseCustodyRestrictions.ISOLATION,
                )
                  ? ` ${capitalize(
                      formatAccusedByGender(theCase.accusedGender),
                    )} skal sæta einangrun ${
                      isolationEndsBeforeValidToDate
                        ? `ekki lengur en til ${formatDate(
                            theCase.isolationToDate,
                            'PPPPp',
                          )
                            ?.replace('dagur,', 'dagsins')
                            ?.replace(' kl.', ', kl.')}.`
                        : 'á meðan á gæsluvarðhaldinu stendur.'
                    }`
                  : '',
            }),
        theCase,
      )

      setWorkingCase(theCase)
    }
  }, [id, workingCase, setWorkingCase, data, autofill, formatMessage])

  return (
    <PageLayout
      workingCase={workingCase}
      activeSection={
        workingCase?.parentCase ? Sections.JUDGE_EXTENSION : Sections.JUDGE
      }
      activeSubSection={JudgeSubsections.RULING_STEP_TWO}
      isLoading={loading}
      notFound={data?.case === undefined}
    >
      {workingCase ? (
        <>
          <FormContentContainer>
            <Box marginBottom={10}>
              <Text as="h1" variant="h1">
                {formatMessage(m.title)}
              </Text>
            </Box>
            <Box component="section" marginBottom={7}>
              <CaseNumbers workingCase={workingCase} />
            </Box>
            <Box component="section" marginBottom={8}>
              <Box marginBottom={6}>
                <Box marginBottom={2}>
                  <Text as="h3" variant="h3">
                    {formatMessage(m.sections.conclusion.title)}
                  </Text>
                </Box>
                <Input
                  name="conclusion"
                  data-testid="conclusion"
                  label={formatMessage(m.sections.conclusion.label)}
                  defaultValue={workingCase.conclusion}
                  placeholder={formatMessage(m.sections.conclusion.placeholder)}
                  onChange={(event) =>
                    removeTabsValidateAndSet(
                      'conclusion',
                      event,
                      [],
                      workingCase,
                      setWorkingCase,
                    )
                  }
                  onBlur={(event) =>
                    validateAndSendToServer(
                      'conclusion',
                      event.target.value,
                      [],
                      workingCase,
                      updateCase,
                    )
                  }
                  textarea
                  required
                  rows={7}
                />
              </Box>
            </Box>
            <Box component="section" marginBottom={8}>
              <Box marginBottom={2}>
                <Text as="h3" variant="h3">
                  {formatMessage(m.sections.appealDecision.title)}
                </Text>
              </Box>
              <Box marginBottom={3}>
                <Text variant="h4" fontWeight="light">
                  {formatMessage(m.sections.appealDecision.disclaimer)}
                </Text>
              </Box>
              <Box marginBottom={3}>
                <BlueBox>
                  <Box marginBottom={2}>
                    <Text as="h4" variant="h4">
                      {formatMessage(m.sections.appealDecision.accusedTitle, {
                        accused: formatAccusedByGender(
                          workingCase.accusedGender,
                          NounCases.GENITIVE,
                        ),
                      })}{' '}
                      <Text as="span" color="red600" fontWeight="semiBold">
                        *
                      </Text>
                    </Text>
                  </Box>
                  <Box marginBottom={2}>
                    <GridRow>
                      <GridColumn span="6/12">
                        <RadioButton
                          name="accused-appeal-decision"
                          id="accused-appeal"
                          label={formatMessage(
                            m.sections.appealDecision.accusedAppeal,
                            {
                              accused: capitalize(
                                formatAccusedByGender(
                                  workingCase.accusedGender,
                                ),
                              ),
                            },
                          )}
                          value={CaseAppealDecision.APPEAL}
                          checked={
                            workingCase.accusedAppealDecision ===
                            CaseAppealDecision.APPEAL
                          }
                          onChange={() => {
                            setWorkingCase({
                              ...workingCase,
                              accusedAppealDecision: CaseAppealDecision.APPEAL,
                            })

                            updateCase(
                              workingCase.id,
                              parseString(
                                'accusedAppealDecision',
                                CaseAppealDecision.APPEAL,
                              ),
                            )
                          }}
                          large
                          backgroundColor="white"
                        />
                      </GridColumn>
                      <GridColumn span="6/12">
                        <RadioButton
                          name="accused-appeal-decision"
                          id="accused-accept"
                          label={formatMessage(
                            m.sections.appealDecision.accusedAccept,
                            {
                              accused: capitalize(
                                formatAccusedByGender(
                                  workingCase.accusedGender,
                                ),
                              ),
                            },
                          )}
                          value={CaseAppealDecision.ACCEPT}
                          checked={
                            workingCase.accusedAppealDecision ===
                            CaseAppealDecision.ACCEPT
                          }
                          onChange={() => {
                            setWorkingCase({
                              ...workingCase,
                              accusedAppealDecision: CaseAppealDecision.ACCEPT,
                            })

                            updateCase(
                              workingCase.id,
                              parseString(
                                'accusedAppealDecision',
                                CaseAppealDecision.ACCEPT,
                              ),
                            )
                          }}
                          large
                          backgroundColor="white"
                        />
                      </GridColumn>
                    </GridRow>
                  </Box>
                  <Box marginBottom={2}>
                    <GridRow>
                      <GridColumn span="7/12">
                        <RadioButton
                          name="accused-appeal-decision"
                          id="accused-postpone"
                          label={formatMessage(
                            m.sections.appealDecision.accusedPostpone,
                            {
                              accused: capitalize(
                                formatAccusedByGender(
                                  workingCase.accusedGender,
                                ),
                              ),
                            },
                          )}
                          value={CaseAppealDecision.POSTPONE}
                          checked={
                            workingCase.accusedAppealDecision ===
                            CaseAppealDecision.POSTPONE
                          }
                          onChange={() => {
                            setWorkingCase({
                              ...workingCase,
                              accusedAppealDecision:
                                CaseAppealDecision.POSTPONE,
                            })

                            updateCase(
                              workingCase.id,
                              parseString(
                                'accusedAppealDecision',
                                CaseAppealDecision.POSTPONE,
                              ),
                            )
                          }}
                          large
                          backgroundColor="white"
                        />
                      </GridColumn>
                      <GridColumn span="5/12">
                        <RadioButton
                          name="accused-appeal-decision"
                          id="accused-not-applicable"
                          label={formatMessage(
                            m.sections.appealDecision.accusedNotApplicable,
                          )}
                          value={CaseAppealDecision.NOT_APPLICABLE}
                          checked={
                            workingCase.accusedAppealDecision ===
                            CaseAppealDecision.NOT_APPLICABLE
                          }
                          onChange={() => {
                            setWorkingCase({
                              ...workingCase,
                              accusedAppealDecision:
                                CaseAppealDecision.NOT_APPLICABLE,
                            })

                            updateCase(
                              workingCase.id,
                              parseString(
                                'accusedAppealDecision',
                                CaseAppealDecision.NOT_APPLICABLE,
                              ),
                            )
                          }}
                          large
                          backgroundColor="white"
                        />
                      </GridColumn>
                    </GridRow>
                  </Box>
                  <Input
                    name="accusedAppealAnnouncement"
                    data-testid="accusedAppealAnnouncement"
                    label={formatMessage(
                      m.sections.appealDecision.accusedAnnouncementLabel,
                      {
                        accused: formatAccusedByGender(
                          workingCase.accusedGender,
                          NounCases.GENITIVE,
                        ),
                      },
                    )}
                    defaultValue={workingCase.accusedAppealAnnouncement}
                    placeholder={formatMessage(
                      m.sections.appealDecision.accusedAnnouncementPlaceholder,
                      {
                        accused: formatAccusedByGender(
                          workingCase.accusedGender,
                        ),
                      },
                    )}
                    onChange={(event) =>
                      removeTabsValidateAndSet(
                        'accusedAppealAnnouncement',
                        event,
                        [],
                        workingCase,
                        setWorkingCase,
                      )
                    }
                    onBlur={(event) =>
                      validateAndSendToServer(
                        'accusedAppealAnnouncement',
                        event.target.value,
                        [],
                        workingCase,
                        updateCase,
                      )
                    }
                    textarea
                    rows={7}
                  />
                </BlueBox>
              </Box>
              <Box marginBottom={5}>
                <BlueBox>
                  <Box marginBottom={2}>
                    <Text as="h4" variant="h4">
                      {formatMessage(m.sections.appealDecision.prosecutorTitle)}{' '}
                      <Text as="span" color="red400" fontWeight="semiBold">
                        *
                      </Text>
                    </Text>
                  </Box>
                  <Box marginBottom={2}>
                    <GridRow>
                      <GridColumn span="6/12">
                        <RadioButton
                          name="prosecutor-appeal-decision"
                          id="prosecutor-appeal"
                          label={formatMessage(
                            m.sections.appealDecision.prosecutorAppeal,
                          )}
                          value={CaseAppealDecision.APPEAL}
                          checked={
                            workingCase.prosecutorAppealDecision ===
                            CaseAppealDecision.APPEAL
                          }
                          onChange={() => {
                            setWorkingCase({
                              ...workingCase,
                              prosecutorAppealDecision:
                                CaseAppealDecision.APPEAL,
                            })

                            updateCase(
                              workingCase.id,
                              parseString(
                                'prosecutorAppealDecision',
                                CaseAppealDecision.APPEAL,
                              ),
                            )
                          }}
                          large
                          backgroundColor="white"
                        />
                      </GridColumn>
                      <GridColumn span="6/12">
                        <RadioButton
                          name="prosecutor-appeal-decision"
                          id="prosecutor-accept"
                          label={formatMessage(
                            m.sections.appealDecision.prosecutorAccept,
                          )}
                          value={CaseAppealDecision.ACCEPT}
                          checked={
                            workingCase.prosecutorAppealDecision ===
                            CaseAppealDecision.ACCEPT
                          }
                          onChange={() => {
                            setWorkingCase({
                              ...workingCase,
                              prosecutorAppealDecision:
                                CaseAppealDecision.ACCEPT,
                            })

                            updateCase(
                              workingCase.id,
                              parseString(
                                'prosecutorAppealDecision',
                                CaseAppealDecision.ACCEPT,
                              ),
                            )
                          }}
                          large
                          backgroundColor="white"
                        />
                      </GridColumn>
                    </GridRow>
                  </Box>
                  <Box marginBottom={2}>
                    <GridRow>
                      <GridColumn span="7/12">
                        <RadioButton
                          name="prosecutor-appeal-decision"
                          id="prosecutor-postpone"
                          label={formatMessage(
                            m.sections.appealDecision.prosecutorPostpone,
                          )}
                          value={CaseAppealDecision.POSTPONE}
                          checked={
                            workingCase.prosecutorAppealDecision ===
                            CaseAppealDecision.POSTPONE
                          }
                          onChange={() => {
                            setWorkingCase({
                              ...workingCase,
                              prosecutorAppealDecision:
                                CaseAppealDecision.POSTPONE,
                            })

                            updateCase(
                              workingCase.id,
                              parseString(
                                'prosecutorAppealDecision',
                                CaseAppealDecision.POSTPONE,
                              ),
                            )
                          }}
                          large
                          backgroundColor="white"
                        />
                      </GridColumn>
                      <GridColumn span="5/12">
                        <RadioButton
                          name="prosecutor-appeal-decision"
                          id="prosecutor-not-applicable"
                          label={formatMessage(
                            m.sections.appealDecision.prosecutorNotApplicable,
                          )}
                          value={CaseAppealDecision.NOT_APPLICABLE}
                          checked={
                            workingCase.prosecutorAppealDecision ===
                            CaseAppealDecision.NOT_APPLICABLE
                          }
                          onChange={() => {
                            setWorkingCase({
                              ...workingCase,
                              prosecutorAppealDecision:
                                CaseAppealDecision.NOT_APPLICABLE,
                            })

                            updateCase(
                              workingCase.id,
                              parseString(
                                'prosecutorAppealDecision',
                                CaseAppealDecision.NOT_APPLICABLE,
                              ),
                            )
                          }}
                          large
                          backgroundColor="white"
                        />
                      </GridColumn>
                    </GridRow>
                  </Box>
                  <Box>
                    <Input
                      name="prosecutorAppealAnnouncement"
                      data-testid="prosecutorAppealAnnouncement"
                      label={formatMessage(
                        m.sections.appealDecision.prosecutorAnnouncementLabel,
                      )}
                      defaultValue={workingCase.prosecutorAppealAnnouncement}
                      placeholder={formatMessage(
                        m.sections.appealDecision
                          .prosecutorAnnouncementPlaceholder,
                      )}
                      onChange={(event) =>
                        removeTabsValidateAndSet(
                          'prosecutorAppealAnnouncement',
                          event,
                          [],
                          workingCase,
                          setWorkingCase,
                        )
                      }
                      onBlur={(event) =>
                        validateAndSendToServer(
                          'prosecutorAppealAnnouncement',
                          event.target.value,
                          [],
                          workingCase,
                          updateCase,
                        )
                      }
                      textarea
                      rows={7}
                    />
                  </Box>
                </BlueBox>
              </Box>
              {isAcceptingCaseDecision(workingCase.decision) &&
                workingCase.type === CaseType.CUSTODY && (
                  <Box component="section" marginBottom={3}>
                    <Box marginBottom={3}>
                      <Text as="h3" variant="h3">
                        Tilhögun gæsluvarðhalds
                      </Text>
                    </Box>
                    <BlueBox>
                      <CheckboxList
                        checkboxes={restrictions}
                        selected={workingCase.custodyRestrictions}
                        onChange={(id) =>
                          setCheckboxAndSendToServer(
                            'custodyRestrictions',
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
              {(workingCase.decision ===
                CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN ||
                (workingCase.decision === CaseDecision.ACCEPTING &&
                  workingCase.type === CaseType.TRAVEL_BAN)) && (
                <Box component="section" marginBottom={4}>
                  <Box marginBottom={3}>
                    <Text as="h3" variant="h3">
                      Tilhögun farbanns
                    </Text>
                  </Box>
                  <BlueBox>
                    <Box marginBottom={3}>
                      <CheckboxList
                        checkboxes={alternativeTravelBanRestrictions}
                        selected={workingCase.custodyRestrictions}
                        onChange={(id) =>
                          setCheckboxAndSendToServer(
                            'custodyRestrictions',
                            id,
                            workingCase,
                            setWorkingCase,
                            updateCase,
                          )
                        }
                      />
                    </Box>
                    <Input
                      name="otherRestrictions"
                      data-testid="otherRestrictions"
                      label="Nánari útlistun eða aðrar takmarkanir"
                      defaultValue={workingCase.otherRestrictions}
                      placeholder="Til dæmis hvernig tilkynningarskyldu sé háttað..."
                      onChange={(event) =>
                        removeTabsValidateAndSet(
                          'otherRestrictions',
                          event,
                          [],
                          workingCase,
                          setWorkingCase,
                        )
                      }
                      onBlur={(event) =>
                        validateAndSendToServer(
                          'otherRestrictions',
                          event.target.value,
                          [],
                          workingCase,
                          updateCase,
                        )
                      }
                      rows={10}
                      textarea
                    />
                  </BlueBox>
                </Box>
              )}
              {(!workingCase.decision ||
                isAcceptingCaseDecision(workingCase.decision) ||
                workingCase.decision ===
                  CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN) && (
                <Text variant="h4" fontWeight="light">
                  {formatMessage(m.sections.custodyRestrictions.disclaimer, {
                    caseType:
                      workingCase.type === CaseType.CUSTODY &&
                      isAcceptingCaseDecision(workingCase.decision)
                        ? 'gæsluvarðhaldsins'
                        : 'farbannsins',
                  })}
                </Text>
              )}
            </Box>
            <Box marginBottom={10}>
              <Box marginBottom={2}>
                <Text as="h3" variant="h3">
                  Þinghald
                </Text>
              </Box>
              <GridContainer>
                <GridRow>
                  <GridColumn>
                    <TimeInputField
                      onChange={(evt) =>
                        validateAndSetTime(
                          'courtEndTime',
                          workingCase.courtStartDate,
                          evt.target.value,
                          ['empty', 'time-format'],
                          workingCase,
                          setWorkingCase,
                          courtDocumentEndErrorMessage,
                          setCourtDocumentEndErrorMessage,
                        )
                      }
                      onBlur={(evt) =>
                        validateAndSendTimeToServer(
                          'courtEndTime',
                          workingCase.courtStartDate,
                          evt.target.value,
                          ['empty', 'time-format'],
                          workingCase,
                          updateCase,
                          setCourtDocumentEndErrorMessage,
                        )
                      }
                    >
                      <Input
                        data-testid="courtEndTime"
                        name="courtEndTime"
                        label="Þinghaldi lauk (kk:mm)"
                        placeholder="Veldu tíma"
                        autoComplete="off"
                        defaultValue={formatDate(
                          workingCase.courtEndTime,
                          TIME_FORMAT,
                        )}
                        errorMessage={courtDocumentEndErrorMessage}
                        hasError={courtDocumentEndErrorMessage !== ''}
                        required
                      />
                    </TimeInputField>
                  </GridColumn>
                </GridRow>
              </GridContainer>
            </Box>
          </FormContentContainer>
          <FormContentContainer isFooter>
            <FormFooter
              previousUrl={`${Constants.RULING_STEP_ONE_ROUTE}/${workingCase.id}`}
              nextUrl={`${Constants.CONFIRMATION_ROUTE}/${id}`}
              nextIsDisabled={!isRulingStepTwoValidRC(workingCase)}
            />
          </FormContentContainer>
        </>
      ) : null}
    </PageLayout>
  )
}

export default RulingStepTwo
