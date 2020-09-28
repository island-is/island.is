import {
  Box,
  Checkbox,
  DatePicker,
  GridColumn,
  GridContainer,
  GridRow,
  Input,
  Typography,
} from '@island.is/island-ui/core'
import React, { useEffect, useState } from 'react'
import { FormFooter } from '../../shared-components/FormFooter'
import { JudgeLogo } from '../../shared-components/Logos'
import { GetCaseByIdResponse } from '../../types'
import useWorkingCase from '../../utils/hooks/useWorkingCase'
import * as Constants from '../../utils/constants'
import { formatDate } from '../../utils/formatters'
import useRestrictions from '../../utils/hooks/useRestrictions'
import { CaseState } from '@island.is/judicial-system/types'

export const Verdict: React.FC = () => {
  const [workingCase, setWorkingCase] = useWorkingCase()
  const [requestRecjected, setRequestRejected] = useState(
    workingCase?.state === CaseState.REJECTED || false,
  )
  const restrictions = useRestrictions(workingCase, setWorkingCase)

  useEffect(() => {
    const wc: GetCaseByIdResponse = JSON.parse(
      window.localStorage.getItem('workingCase'),
    )

    if (wc) {
      setWorkingCase(wc.case)
    }
  }, [])
  console.log(workingCase)
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
                />
              </Box>
              <GridRow>
                <GridColumn span="3/7">
                  <Checkbox
                    label="Hafna kröfu"
                    onBlur={() => {
                      console.log('here')
                    }}
                    onChange={({ target }) => {
                      console.log(target)
                      setRequestRejected(!target.checked)
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
                <GridColumn span="3/7">
                  <DatePicker
                    label="Gæsluvarðhald til"
                    placeholderText=""
                    selected={new Date(workingCase.requestedCustodyEndDate)}
                  />
                </GridColumn>
                <GridColumn span="3/7">
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
                <Typography>
                  Dómari bendir kærða á að honum sé heimilt að bera atriði er
                  lúta að framkvæmd gæsluvarðhaldsins undir dómara.
                </Typography>
              </Box>
              <Box marginBottom={2}>
                <Typography as="h4" variant="h4">
                  Sækjandi
                </Typography>
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
