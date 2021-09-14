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
  getTimeFromDate,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import CheckboxList from '@island.is/judicial-system-web/src/shared-components/CheckboxList/CheckboxList'
import {
  alternativeTravelBanRestrictions,
  judgeRestrictions,
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
import {
  useCase,
  useDateTime,
} from '@island.is/judicial-system-web/src/utils/hooks'
import { rcRulingStepTwo } from '@island.is/judicial-system-web/messages'

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

  const { isValidTime: isValidCourtEndTime } = useDateTime({
    time: getTimeFromDate(workingCase?.courtEndTime),
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
        theCase.decision === CaseDecision.REJECTING
          ? formatMessage(
              rcRulingStepTwo.sections.conclusion.rejectingAutofill,
              {
                genderedAccused: formatAccusedByGender(theCase.accusedGender),
                accusedName: theCase.accusedName,
                accusedNationalId: formatNationalId(theCase.accusedNationalId),
                extensionSuffix:
                  theCase.parentCase !== undefined &&
                  theCase.parentCase?.decision === CaseDecision.ACCEPTING
                    ? ' áframhaldandi'
                    : '',
                caseType:
                  theCase.type === CaseType.CUSTODY
                    ? 'gæsluvarðhaldi'
                    : 'farbanni',
              },
            )
          : formatMessage(
              rcRulingStepTwo.sections.conclusion.acceptingAutofill,
              {
                genderedAccused: capitalize(
                  formatAccusedByGender(theCase.accusedGender),
                ),
                accusedName: theCase.accusedName,
                accusedNationalId: formatNationalId(theCase.accusedNationalId),
                caseTypeAndExtensionSuffix:
                  theCase.decision === CaseDecision.ACCEPTING
                    ? `${
                        theCase.parentCase !== undefined &&
                        theCase.parentCase?.decision === CaseDecision.ACCEPTING
                          ? 'áframhaldandi '
                          : ''
                      }${
                        theCase.type === CaseType.CUSTODY
                          ? 'gæsluvarðhaldi'
                          : 'farbanni'
                      }`
                    : // decision === CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN
                      `${
                        theCase.parentCase !== undefined &&
                        theCase.parentCase?.decision ===
                          CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN
                          ? 'áframhaldandi '
                          : ''
                      }farbanni`,
                validToDate: `${formatDate(theCase.validToDate, 'PPPPp')
                  ?.replace('dagur,', 'dagsins')
                  ?.replace(' kl.', ', kl.')}`,
                isolationSuffix:
                  theCase.decision === CaseDecision.ACCEPTING &&
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
              },
            ),
        theCase,
      )

      setWorkingCase(theCase)
    }
  }, [id, workingCase, setWorkingCase, data, autofill, formatMessage])

  return (
    <PageLayout
      activeSection={
        workingCase?.parentCase ? Sections.JUDGE_EXTENSION : Sections.JUDGE
      }
      activeSubSection={JudgeSubsections.RULING_STEP_TWO}
      isLoading={loading}
      notFound={data?.case === undefined}
      caseType={workingCase?.type}
      caseId={workingCase?.id}
    >
      {workingCase ? (
        <>
          <FormContentContainer>
            <Box marginBottom={10}>
              <Text as="h1" variant="h1">
                Úrskurður og kæra
              </Text>
            </Box>
            <Box component="section" marginBottom={7}>
              <Text variant="h2">{`Mál nr. ${workingCase.courtCaseNumber}`}</Text>
              <CaseNumbers workingCase={workingCase} />
            </Box>
            <Box component="section" marginBottom={8}>
              <Box marginBottom={6}>
                <Box marginBottom={2}>
                  <Text as="h3" variant="h3">
                    Úrskurðarorð
                  </Text>
                </Box>
                <Input
                  name="conclusion"
                  data-testid="conclusion"
                  label="Úrskurðarorð"
                  defaultValue={workingCase.conclusion}
                  placeholder="Hver eru úrskurðarorðin"
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
                  Ákvörðun um kæru
                </Text>
              </Box>
              <Box marginBottom={3}>
                <Text variant="h4" fontWeight="light">
                  {formatMessage(
                    rcRulingStepTwo.sections.accusedAppealDecision.disclaimer,
                  )}
                </Text>
              </Box>
              <Box marginBottom={3}>
                <BlueBox>
                  <Box marginBottom={2}>
                    <Text as="h4" variant="h4">
                      {capitalize(
                        formatAccusedByGender(workingCase.accusedGender),
                      )}{' '}
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
                          label={`${capitalize(
                            formatAccusedByGender(workingCase.accusedGender),
                          )} kærir úrskurðinn`}
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
                          label={`${capitalize(
                            formatAccusedByGender(workingCase.accusedGender),
                          )} unir úrskurðinum`}
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
                          label={`${capitalize(
                            formatAccusedByGender(workingCase.accusedGender),
                          )}  tekur sér lögboðinn frest`}
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
                    </GridRow>
                  </Box>
                  <Input
                    name="accusedAppealAnnouncement"
                    data-testid="accusedAppealAnnouncement"
                    label={`Yfirlýsing um kæru ${formatAccusedByGender(
                      workingCase.accusedGender,
                      NounCases.GENITIVE,
                    )}`}
                    defaultValue={workingCase.accusedAppealAnnouncement}
                    disabled={
                      workingCase.accusedAppealDecision !==
                      CaseAppealDecision.APPEAL
                    }
                    placeholder="Í hvaða skyni er kært?"
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
                      Sækjandi{' '}
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
                          label="Sækjandi kærir úrskurðinn"
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
                          label="Sækjandi unir úrskurðinum"
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
                          label="Sækjandi tekur sér lögboðinn frest"
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
                    </GridRow>
                  </Box>
                  <Box>
                    <Input
                      name="prosecutorAppealAnnouncement"
                      data-testid="prosecutorAppealAnnouncement"
                      label="Yfirlýsing um kæru sækjanda"
                      defaultValue={workingCase.prosecutorAppealAnnouncement}
                      disabled={
                        workingCase.prosecutorAppealDecision !==
                        CaseAppealDecision.APPEAL
                      }
                      placeholder="Í hvaða skyni er kært?"
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
              {workingCase.decision === CaseDecision.ACCEPTING &&
                workingCase.type === CaseType.CUSTODY && (
                  <Box component="section" marginBottom={3}>
                    <Box marginBottom={3}>
                      <Text as="h3" variant="h3">
                        Tilhögun gæsluvarðhalds
                      </Text>
                    </Box>
                    <BlueBox>
                      <CheckboxList
                        checkboxes={judgeRestrictions}
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
                workingCase.decision === CaseDecision.ACCEPTING ||
                workingCase.decision ===
                  CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN) && (
                <Text variant="h4" fontWeight="light">
                  {formatMessage(
                    rcRulingStepTwo.sections.custodyRestrictions.disclaimer,
                    {
                      caseType:
                        workingCase.type === CaseType.CUSTODY &&
                        workingCase.decision === CaseDecision.ACCEPTING
                          ? 'gæsluvarðhaldsins'
                          : 'farbannsins',
                    },
                  )}
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
              nextIsDisabled={
                !workingCase.accusedAppealDecision ||
                !workingCase.prosecutorAppealDecision ||
                !workingCase.conclusion ||
                !isValidCourtEndTime?.isValid
              }
            />
          </FormContentContainer>
        </>
      ) : null}
    </PageLayout>
  )
}

export default RulingStepTwo
