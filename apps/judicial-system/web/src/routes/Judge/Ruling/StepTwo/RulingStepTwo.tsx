import {
  Box,
  Checkbox,
  GridColumn,
  GridRow,
  Input,
  RadioButton,
  Text,
} from '@island.is/island-ui/core'
import React, { useEffect, useState } from 'react'
import { FormFooter } from '../../../../shared-components/FormFooter'
import {
  Case,
  CaseAppealDecision,
  CaseCustodyRestrictions,
  CaseDecision,
  UpdateCase,
} from '@island.is/judicial-system/types'
import * as Constants from '../../../../utils/constants'
import { parseArray, parseString } from '../../../../utils/formatters'
import { constructConclusion } from '../../../../utils/stepHelper'
import { PageLayout } from '@island.is/judicial-system-web/src/shared-components/PageLayout/PageLayout'
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
} from '@island.is/judicial-system-web/src/utils/formHelper'

export const RulingStepTwo: React.FC = () => {
  const [workingCase, setWorkingCase] = useState<Case>()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [, setVisitationCheckbox] = useState<boolean>()
  const [, setCommunicationCheckbox] = useState<boolean>()
  const [, setMediaCheckbox] = useState<boolean>()
  const { id } = useParams<{ id: string }>()
  const [updateCaseMutation] = useMutation(UpdateCaseMutation)
  const { data } = useQuery(CaseQuery, {
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
    const getCurrentCase = async () => {
      setIsLoading(true)
      setWorkingCase(resCase)
      setIsLoading(false)
    }
    if (id && !workingCase && resCase) {
      getCurrentCase()
    }
  }, [id, setIsLoading, workingCase, setWorkingCase, resCase])

  const restrictions = [
    {
      restriction: 'C - Heimsóknarbann',
      value: CaseCustodyRestrictions.VISITAION,
      setCheckbox: setVisitationCheckbox,
      explination:
        'Gæslufangar eiga rétt á heimsóknum. Þó getur sá sem rannsókn stýrir bannað heimsóknir ef nauðsyn ber til í þágu hennar en skylt er að verða við óskum gæslufanga um að hafa samband við verjanda og ræða við hann einslega, sbr. 1. mgr. 36. gr., og rétt að verða við óskum hans um að hafa samband við lækni eða prest, ef þess er kostur.',
    },
    {
      restriction: 'D - Bréfskoðun, símabann',
      value: CaseCustodyRestrictions.COMMUNICATION,
      setCheckbox: setCommunicationCheckbox,
      explination:
        'Gæslufangar mega nota síma eða önnur fjarskiptatæki og senda og taka við bréfum og öðrum skjölum. Þó getur sá sem rannsókn stýrir bannað notkun síma eða annarra fjarskiptatækja og látið athuga efni bréfa eða annarra skjala og kyrrsett þau ef nauðsyn ber til í þágu hennar en gera skal sendanda viðvart um kyrrsetningu, ef því er að skipta.',
    },
    {
      restriction: 'E - Fjölmiðlabann',
      value: CaseCustodyRestrictions.MEDIA,
      setCheckbox: setMediaCheckbox,
      explination:
        'Gæslufangar mega lesa dagblöð og bækur, svo og fylgjast með hljóðvarpi og sjónvarpi. Þó getur sá sem rannsókn stýrir takmarkað aðgang gæslufanga að fjölmiðlum ef nauðsyn ber til í þágu rannsóknar.',
    },
  ]

  return (
    <PageLayout
      activeSection={Sections.JUDGE}
      activeSubSection={JudgeSubsections.RULING_STEP_TWO}
      isLoading={isLoading}
      notFound={data?.case === undefined}
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
            <Text fontWeight="semiBold">{`LÖKE málsnr. ${workingCase.policeCaseNumber}`}</Text>
          </Box>
          <Box component="section" marginBottom={8}>
            <Box marginBottom={10}>
              <Box marginBottom={2}>
                <Text as="h4" variant="h4">
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
              <Box marginBottom={2}>
                <Text as="h4" variant="h4">
                  Kærði{' '}
                  <Text as="span" color="red600" fontWeight="semiBold">
                    *
                  </Text>
                </Text>
              </Box>
              <Box marginBottom={3}>
                <GridRow>
                  <GridColumn span="6/12">
                    <RadioButton
                      name="accused-appeal-decition"
                      id="accused-appeal"
                      label="Kærði kærir úrskurðinn"
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
                    />
                  </GridColumn>
                  <GridColumn span="6/12">
                    <RadioButton
                      name="accused-appeal-decition"
                      id="accused-accept"
                      label="Kærði unir úrskurðinum"
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
                    />
                  </GridColumn>
                </GridRow>
              </Box>
              <Box marginBottom={4}>
                <GridRow>
                  <GridColumn span="7/12">
                    <RadioButton
                      name="accused-appeal-decition"
                      id="accused-postpone"
                      label="Kærði tekur sér lögboðinn frest"
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
                    />
                  </GridColumn>
                </GridRow>
              </Box>
              <Input
                name="accusedAppealAnnouncement"
                data-testid="accusedAppealAnnouncement"
                label="Yfirlýsing um kæru kærða"
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
            </Box>
            <Box marginBottom={2}>
              <Text as="h4" variant="h4">
                Sækjandi{' '}
                <Text as="span" color="red400" fontWeight="semiBold">
                  *
                </Text>
              </Text>
            </Box>
            <Box marginBottom={3}>
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
                  />
                </GridColumn>
              </GridRow>
            </Box>
            <Box marginBottom={4}>
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
                        prosecutorAppealDecision: CaseAppealDecision.POSTPONE,
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
                  />
                </GridColumn>
              </GridRow>
            </Box>
            <Box marginBottom={7}>
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
                    ['email-format'],
                    workingCase,
                    setWorkingCase,
                  )
                }
                onBlur={(event) =>
                  validateAndSendToServer(
                    'prosecutorAppealAnnouncement',
                    event.target.value,
                    ['email-format'],
                    workingCase,
                    updateCase,
                  )
                }
                textarea
                rows={7}
              />
            </Box>
            {(!workingCase.decision ||
              workingCase.decision === CaseDecision.ACCEPTING) && (
              <Box component="section" marginBottom={3}>
                <Box marginBottom={2}>
                  <Text as="h3" variant="h3">
                    Tilhögun gæsluvarðhalds
                  </Text>
                </Box>
                <Box marginBottom={1}>
                  <GridRow>
                    {restrictions.map((restriction, index) => {
                      return (
                        <GridColumn span="6/12" key={index}>
                          <Box marginBottom={3}>
                            <Checkbox
                              name={restriction.restriction}
                              label={restriction.restriction}
                              value={restriction.value}
                              checked={workingCase.custodyRestrictions?.includes(
                                restriction.value,
                              )}
                              tooltip={restriction.explination}
                              onChange={({ target }) => {
                                // Create a copy of the state
                                const copyOfState = Object.assign(
                                  workingCase,
                                  {},
                                )

                                const restrictionIsSelected = copyOfState.custodyRestrictions?.includes(
                                  target.value as CaseCustodyRestrictions,
                                )

                                // Toggle the checkbox on or off
                                restriction.setCheckbox(!restrictionIsSelected)

                                // If the user is checking the box, add the restriction to the state
                                if (!restrictionIsSelected) {
                                  if (
                                    copyOfState.custodyRestrictions === null
                                  ) {
                                    copyOfState.custodyRestrictions = []
                                  }

                                  copyOfState.custodyRestrictions &&
                                    copyOfState.custodyRestrictions.push(
                                      target.value as CaseCustodyRestrictions,
                                    )
                                }
                                // If the user is unchecking the box, remove the restriction from the state
                                else {
                                  copyOfState.custodyRestrictions &&
                                    copyOfState.custodyRestrictions.splice(
                                      copyOfState.custodyRestrictions.indexOf(
                                        target.value as CaseCustodyRestrictions,
                                      ),
                                      1,
                                    )
                                }

                                setWorkingCase({
                                  ...workingCase,
                                  custodyRestrictions:
                                    copyOfState.custodyRestrictions,
                                })

                                // Save case
                                updateCase(
                                  workingCase.id,
                                  parseArray(
                                    'custodyRestrictions',
                                    copyOfState.custodyRestrictions || [],
                                  ),
                                )
                              }}
                              large
                            />
                          </Box>
                        </GridColumn>
                      )
                    })}
                  </GridRow>
                </Box>
              </Box>
            )}
            {(!workingCase.decision ||
              workingCase.decision === CaseDecision.ACCEPTING) && (
              <Text variant="h4" fontWeight="light">
                Dómari bendir kærða/umboðsaðila á að honum sé heimilt að bera
                atriði er lúta að framkvæmd gæsluvarðhaldsins undir dómara.
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
