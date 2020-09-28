import {
  Box,
  Checkbox,
  DatePicker,
  GridColumn,
  GridContainer,
  GridRow,
  Input,
  RadioButton,
  Typography,
} from '@island.is/island-ui/core'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { FormFooter } from '../../shared-components/FormFooter'
import { JudgeLogo } from '../../shared-components/Logos'
import { AppealDecision, GetCaseByIdResponse } from '../../types'
import useWorkingCase from '../../utils/hooks/useWorkingCase'
import * as Constants from '../../utils/constants'
import { formatDate, parseArray, parseString } from '../../utils/formatters'
import useRestrictions from '../../utils/hooks/useRestrictions'
import { CaseState } from '@island.is/judicial-system/types'
import { autoSave, updateState } from '../../utils/stepHelper'
import * as api from '../../api'

export const Verdict: React.FC = () => {
  const [workingCase, setWorkingCase] = useWorkingCase()
  const [requestRecjected, setRequestRejected] = useState(
    workingCase?.state === CaseState.REJECTED,
  )
  const [accusedAppealDecition, setAccusedAppealDecition] = useState<
    AppealDecision
  >(null)
  const [prosecutorAppealDecition, setProsecutorAppealDecition] = useState(null)
  const restrictions = useRestrictions(workingCase, setWorkingCase, true)

  useEffect(() => {
    const wc: GetCaseByIdResponse = JSON.parse(
      window.localStorage.getItem('workingCase'),
    )

    if (wc) {
      setWorkingCase(wc.case)
    }
  }, [])
  return workingCase ? (
    <Box marginTop={7} marginBottom={30}>
      <GridContainer>
        <GridRow>
          <GridColumn span={'3/12'}>
            <JudgeLogo />
          </GridColumn>
          <GridColumn span={'8/12'} offset={'1/12'}>
            <Box marginBottom={10}>
              <Typography as="h1" variant="h1">
                Krafa um gæsluvarðhald
              </Typography>
            </Box>
          </GridColumn>
        </GridRow>
        <GridRow>
          <GridColumn span={['12/12', '3/12']}>
            <Typography>Hliðarstika</Typography>
          </GridColumn>
          <GridColumn span={['12/12', '7/12']} offset={['0', '1/12']}>
            <Box component="section" marginBottom={7}>
              <Typography variant="h2">{`Mál nr. ${workingCase.courtCaseNumber}`}</Typography>
              <Typography fontWeight="semiBold">{`LÖKE málsnr. ${workingCase.policeCaseNumber}`}</Typography>
            </Box>
            <Box component="section" marginBottom={8}>
              <Box marginBottom={2}>
                <Typography as="h3" variant="h3">
                  Úrskurður
                </Typography>
              </Box>
              <Box marginBottom={2}>
                <Input
                  name="verdict"
                  label="Niðurstaða úrskurðar"
                  placeholder="Skrifa hér..."
                  textarea
                  rows={3}
                  onBlur={(evt) => {
                    autoSave(
                      workingCase,
                      'ruling',
                      evt.target.value,
                      setWorkingCase,
                    )
                  }}
                />
              </Box>
              <GridRow>
                <GridColumn span="3/7">
                  <Checkbox
                    name="rejectRequest"
                    label="Hafna kröfu"
                    onChange={({ target }) => {
                      setRequestRejected(target.checked)
                      // Save case
                      api.saveCase(
                        workingCase.id,
                        parseString(
                          'state',
                          target.checked
                            ? CaseState.REJECTED
                            : CaseState.ACCEPTED,
                        ),
                      )

                      updateState(
                        workingCase,
                        'state',
                        target.checked
                          ? CaseState.REJECTED
                          : CaseState.ACCEPTED,
                        setWorkingCase,
                      )
                    }}
                    checked={requestRecjected}
                    large
                  />
                </GridColumn>
              </GridRow>
            </Box>
            <Box component="section" marginBottom={8}>
              <Box marginBottom={2}>
                <Typography as="h3" variant="h3">
                  Dómkröfur
                </Typography>
              </Box>
              <GridRow>
                <GridColumn span="5/8">
                  <DatePicker
                    label="Gæsluvarðhald til"
                    placeholderText="Veldu dagsetningu"
                    selected={
                      workingCase.custodyEndDate
                        ? new Date(workingCase.custodyEndDate)
                        : workingCase.requestedCustodyEndDate
                        ? new Date(workingCase.requestedCustodyEndDate)
                        : null
                    }
                    handleChange={(date) => {
                      updateState(
                        workingCase,
                        'custodyEndDate',
                        date,
                        setWorkingCase,
                      )
                    }}
                  />
                </GridColumn>
                <GridColumn span="3/8">
                  <Input
                    name="requestedCustodyEndTime"
                    defaultValue={formatDate(
                      workingCase.requestedCustodyEndDate,
                      Constants.TIME_FORMAT,
                    )}
                    label="Tímasetning"
                  />
                </GridColumn>
              </GridRow>
            </Box>
            <Box component="section" marginBottom={8}>
              <Box marginBottom={2}>
                <Typography as="h3" variant="h3">
                  Takmarkanir á gæslu
                </Typography>
              </Box>
              <Box marginBottom={1}>
                <GridRow>{restrictions}</GridRow>
              </Box>
              <Typography>
                Úrskurðarorðið er lesið í heyranda hljóði að viðstöddum kærða,
                verjanda hans, túlki og aðstoðarsaksóknara.
              </Typography>
            </Box>
            <Box component="section" marginBottom={8}>
              <Box marginBottom={2}>
                <Typography as="h3" variant="h3">
                  Ákvörðun um kæru
                </Typography>
              </Box>
              <Box marginBottom={1}>
                <Typography>
                  Dómari leiðbeinir málsaðilum um rétt þeirra til að kæra
                  úrskurð þennan til Landsréttar innan þriggja sólarhringa.
                </Typography>
              </Box>
              <Box marginBottom={2}>
                <Typography as="h4" variant="h4">
                  Kærði
                </Typography>
                <div>
                  <RadioButton
                    name="accused-appeal-decition"
                    id="accused-appeal"
                    label="Kærði kærir málið"
                    value={AppealDecision.APPEAL}
                    checked={accusedAppealDecition === AppealDecision.APPEAL}
                    onChange={() => {
                      setAccusedAppealDecition(AppealDecision.APPEAL)
                      api.saveCase(
                        workingCase.id,
                        parseArray('accusedAppealDecision', [
                          AppealDecision.APPEAL,
                        ]),
                      )
                    }}
                  />
                  <RadioButton
                    name="accused-appeal-decition"
                    id="accused-accept"
                    label="Kærði unir úrskurðinum"
                    value={AppealDecision.ACCEPT}
                    checked={accusedAppealDecition === AppealDecision.ACCEPT}
                    onChange={() => {
                      setAccusedAppealDecition(AppealDecision.ACCEPT)

                      api.saveCase(
                        workingCase.id,
                        parseArray('accusedAppealDecision', [
                          AppealDecision.ACCEPT,
                        ]),
                      )
                    }}
                  />
                  <RadioButton
                    name="accused-appeal-decition"
                    id="accused-postpone"
                    label="Kærði tekur sér lögboðinn frest"
                    value={AppealDecision.POSTPONE}
                    checked={accusedAppealDecition === AppealDecision.POSTPONE}
                    onChange={() => {
                      setAccusedAppealDecition(AppealDecision.POSTPONE)

                      api.saveCase(
                        workingCase.id,
                        parseArray('accusedAppealDecision', [
                          AppealDecision.POSTPONE,
                        ]),
                      )
                    }}
                  />
                </div>
              </Box>
              <Box marginBottom={2}>
                <Typography>
                  Dómari bendir kærða á að honum sé heimilt að bera atriði er
                  lúta að framkvæmd gæsluvarðhaldsins undir dómara.
                </Typography>
              </Box>
              <Box>
                <Typography as="h4" variant="h4">
                  Sækjandi
                </Typography>
                <div>
                  <RadioButton
                    name="prosecutor-appeal-decition"
                    id="prosecutor-appeal"
                    label="Sækjandi kærir málið"
                    value={AppealDecision.APPEAL}
                    checked={prosecutorAppealDecition === AppealDecision.APPEAL}
                    onChange={() => {
                      setProsecutorAppealDecition(AppealDecision.APPEAL)
                      api.saveCase(
                        workingCase.id,
                        parseArray('prosecutorAppealDecision', [
                          AppealDecision.APPEAL,
                        ]),
                      )
                    }}
                  />
                  <RadioButton
                    name="prosecutor-appeal-decition"
                    id="prosecutor-accept"
                    label="Sækjandi unir úrskurðinum"
                    value={AppealDecision.ACCEPT}
                    checked={prosecutorAppealDecition === AppealDecision.ACCEPT}
                    onChange={() => {
                      setProsecutorAppealDecition(AppealDecision.ACCEPT)

                      api.saveCase(
                        workingCase.id,
                        parseArray('prosecutorAppealDecision', [
                          AppealDecision.ACCEPT,
                        ]),
                      )
                    }}
                  />
                  <RadioButton
                    name="prosecutor-appeal-decition"
                    id="prosecutor-postpone"
                    label="Sækjandi tekur sér lögboðinn frest"
                    value={AppealDecision.POSTPONE}
                    checked={
                      prosecutorAppealDecition === AppealDecision.POSTPONE
                    }
                    onChange={() => {
                      setProsecutorAppealDecition(AppealDecision.POSTPONE)

                      api.saveCase(
                        workingCase.id,
                        parseArray('prosecutorAppealDecision', [
                          AppealDecision.POSTPONE,
                        ]),
                      )
                    }}
                  />
                </div>
              </Box>
            </Box>
            <FormFooter
              previousUrl="/"
              nextUrl="/"
              nextIsDisabled={
                !workingCase.courtStartTime || !workingCase.courtEndTime
              }
            />
          </GridColumn>
        </GridRow>
      </GridContainer>
    </Box>
  ) : null
}

export default Verdict
