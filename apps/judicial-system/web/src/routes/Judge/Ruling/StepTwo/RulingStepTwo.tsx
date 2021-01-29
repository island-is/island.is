import {
  Box,
  GridColumn,
  GridRow,
  Input,
  RadioButton,
  Text,
} from '@island.is/island-ui/core'
import React, { useEffect, useState } from 'react'
import {
  FormFooter,
  PageLayout,
  BlueBox,
  CaseNumbers,
} from '@island.is/judicial-system-web/src/shared-components'
import {
  Case,
  CaseAppealDecision,
  CaseDecision,
  CaseType,
  CaseGender,
  UpdateCase,
} from '@island.is/judicial-system/types'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'
import { parseString } from '@island.is/judicial-system-web/src/utils/formatters'
import { constructConclusion } from '@island.is/judicial-system-web/src/utils/stepHelper'
import { useParams } from 'react-router-dom'
import { useMutation, useQuery } from '@apollo/client'
import {
  CaseQuery,
  UpdateCaseMutation,
} from '@island.is/judicial-system-web/src/graphql'
import {
  JudgeSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import {
  validateAndSendToServer,
  removeTabsValidateAndSet,
  setCheckboxAndSendToServer,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import CheckboxList from '@island.is/judicial-system-web/src/shared-components/CheckboxList/CheckboxList'
import {
  alternativeTravelBanRestrictions,
  judgeRestrictions,
} from '@island.is/judicial-system-web/src/utils/Restrictions'
import {
  capitalize,
  formatAccusedByGender,
  NounCases,
} from '@island.is/judicial-system/formatters'

export const RulingStepTwo: React.FC = () => {
  const [workingCase, setWorkingCase] = useState<Case>()

  const { id } = useParams<{ id: string }>()
  const [updateCaseMutation] = useMutation(UpdateCaseMutation)
  const { data, loading } = useQuery(CaseQuery, {
    variables: { input: { id: id } },
    fetchPolicy: 'no-cache',
  })
  const resCase = data?.case

  const updateCase = async (id: string, updateCase: UpdateCase) => {
    const { data } = await updateCaseMutation({
      variables: { input: { id, ...updateCase } },
    })

    const resCase = data?.updateCase

    if (resCase) {
      // Do smoething with the result. In particular, we want th modified timestamp passed between
      // the client and the backend so that we can handle multiple simultanious updates.
    }

    return resCase
  }

  useEffect(() => {
    document.title = 'Úrskurðarorð - Réttarvörslugátt'
  }, [])

  useEffect(() => {
    if (id && !workingCase && resCase) {
      setWorkingCase(resCase)
    }
  }, [id, workingCase, setWorkingCase, resCase])

  return (
    <PageLayout
      activeSection={
        workingCase?.parentCase ? Sections.JUDGE_EXTENSION : Sections.JUDGE
      }
      activeSubSection={JudgeSubsections.RULING_STEP_TWO}
      isLoading={loading}
      notFound={data?.case === undefined}
      // TODO: UNCOMMENT
      caseType={CaseType.TRAVEL_BAN} // {workingCase.caseType}
    >
      {workingCase ? (
        <>
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
            <Box marginBottom={10}>
              <Box marginBottom={2}>
                <Text as="h3" variant="h3">
                  Úrskurðarorð
                </Text>
              </Box>
              <Box marginBottom={3}>
                <Text>{constructConclusion(workingCase)}</Text>
              </Box>
              <Text variant="h4" fontWeight="light">
                Úrskurðarorðið er lesið í heyranda hljóði fyrir viðstadda.
              </Text>
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
                Dómari leiðbeinir málsaðilum um rétt þeirra til að kæra úrskurð
                þennan til Landsréttar innan þriggja sólarhringa.
              </Text>
            </Box>
            <Box marginBottom={3}>
              <BlueBox>
                <Box marginBottom={2}>
                  <Text as="h4" variant="h4">
                    {capitalize(
                      formatAccusedByGender(
                        workingCase.accusedGender || CaseGender.OTHER,
                      ),
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
                        name="accused-appeal-decition"
                        id="accused-appeal"
                        label={`${capitalize(
                          formatAccusedByGender(
                            workingCase.accusedGender || CaseGender.OTHER,
                          ),
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
                        filled
                      />
                    </GridColumn>
                    <GridColumn span="6/12">
                      <RadioButton
                        name="accused-appeal-decition"
                        id="accused-accept"
                        label={`${capitalize(
                          formatAccusedByGender(
                            workingCase.accusedGender || CaseGender.OTHER,
                          ),
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
                        filled
                      />
                    </GridColumn>
                  </GridRow>
                </Box>
                <Box marginBottom={2}>
                  <GridRow>
                    <GridColumn span="7/12">
                      <RadioButton
                        name="accused-appeal-decition"
                        id="accused-postpone"
                        label={`${capitalize(
                          formatAccusedByGender(
                            workingCase.accusedGender || CaseGender.OTHER,
                          ),
                        )}  tekur sér lögboðinn frest`}
                        value={CaseAppealDecision.POSTPONE}
                        checked={
                          workingCase.accusedAppealDecision ===
                          CaseAppealDecision.POSTPONE
                        }
                        onChange={() => {
                          setWorkingCase({
                            ...workingCase,
                            accusedAppealDecision: CaseAppealDecision.POSTPONE,
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
                        filled
                      />
                    </GridColumn>
                  </GridRow>
                </Box>
                <Input
                  name="accusedAppealAnnouncement"
                  data-testid="accusedAppealAnnouncement"
                  label={`Yfirlýsing um kæru ${formatAccusedByGender(
                    workingCase.accusedGender || CaseGender.OTHER,
                    NounCases.DATIVE,
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
                        name="prosecutor-appeal-decition"
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
                            prosecutorAppealDecision: CaseAppealDecision.APPEAL,
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
                        filled
                      />
                    </GridColumn>
                    <GridColumn span="6/12">
                      <RadioButton
                        name="prosecutor-appeal-decition"
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
                            prosecutorAppealDecision: CaseAppealDecision.ACCEPT,
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
                        filled
                      />
                    </GridColumn>
                  </GridRow>
                </Box>
                <Box marginBottom={2}>
                  <GridRow>
                    <GridColumn span="7/12">
                      <RadioButton
                        name="prosecutor-appeal-decition"
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
                        filled
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
            {(!workingCase.decision ||
              workingCase.decision === CaseDecision.ACCEPTING) && (
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
            {(!workingCase.decision ||
              workingCase.decision ===
                CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN) && (
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
                {`Dómari bendir sakborningi/umboðsaðila á að honum sé heimilt að bera
                atriði er lúta að framkvæmd ${
                  workingCase.decision === CaseDecision.ACCEPTING
                    ? 'gæsluvarðhaldsins'
                    : 'farbannsins'
                } undir dómara.`}
              </Text>
            )}
          </Box>
          <FormFooter
            nextUrl={`${Constants.CONFIRMATION_ROUTE}/${id}`}
            nextIsDisabled={
              !workingCase.accusedAppealDecision ||
              !workingCase.prosecutorAppealDecision
            }
          />
        </>
      ) : null}
    </PageLayout>
  )
}

export default RulingStepTwo
