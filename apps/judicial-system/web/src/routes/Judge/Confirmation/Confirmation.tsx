import {
  Accordion,
  AccordionItem,
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Typography,
} from '@island.is/island-ui/core'
import React, { useEffect } from 'react'
import { FormFooter } from '../../../shared-components/FormFooter'
import { JudgeLogo } from '../../../shared-components/Logos'
import { AppealDecitionRole, Case } from '../../../types'
import useWorkingCase from '../../../utils/hooks/useWorkingCase'
import {
  constructConclusion,
  getAppealDecitionText,
} from '../../../utils/stepHelper'
import * as Constants from '../../../utils/constants'
import { formatDate } from '../../../utils/formatters'

export const Confirmation: React.FC = () => {
  const [workingCase, setWorkingCase] = useWorkingCase()

  useEffect(() => {
    const wc: Case = JSON.parse(window.localStorage.getItem('workingCase'))

    if (wc) {
      setWorkingCase(wc)
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
              <Box display="flex" marginTop={1}>
                <Box marginRight={2}>
                  <Typography variant="pSmall">{`Krafa stofnuð: ${formatDate(
                    workingCase.created,
                    'P',
                  )}`}</Typography>
                </Box>
                <Typography variant="pSmall">{`Þinghald: ${formatDate(
                  workingCase.courtStartTime,
                  'P',
                )}`}</Typography>
              </Box>
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
            <Box marginBottom={9}>
              <Accordion>
                <AccordionItem
                  id="id_1"
                  label="Krafan um gæsluvarðhald frá Lögreglu"
                >
                  {workingCase?.caseFacts && (
                    <Box marginBottom={2}>
                      <Box marginBottom={2}>
                        <Typography variant="h5">Málsatvik rakin</Typography>
                      </Box>
                      <Typography>{workingCase.caseFacts}</Typography>
                    </Box>
                  )}
                </AccordionItem>
                <AccordionItem id="id_2" label="Þingbók">
                  {workingCase?.caseFacts && (
                    <Box marginBottom={2}>
                      <Box marginBottom={2}>
                        <Typography variant="h5">Málsatvik rakin</Typography>
                      </Box>
                      <Typography>{workingCase.caseFacts}</Typography>
                    </Box>
                  )}
                </AccordionItem>
              </Accordion>
            </Box>
            <Box component="section" marginBottom={8}>
              <Box marginBottom={2}>
                <Typography as="h3" variant="h3">
                  Úrskurður Héraðsdóms
                </Typography>
              </Box>
              <Box marginBottom={7}>
                <Typography variant="tag" color="blue400">
                  Niðurstaða úrskurðar
                </Typography>
                <Typography>{workingCase.ruling}</Typography>
              </Box>
            </Box>
            <Box component="section" marginBottom={8}>
              <Box marginBottom={10}>
                <Box marginBottom={2}>
                  <Typography as="h3" variant="h3">
                    Ákvörðun um kæru
                  </Typography>
                </Box>
                <Box marginBottom={1}>
                  <Typography>
                    {getAppealDecitionText(
                      AppealDecitionRole.ACCUSED,
                      workingCase.accusedAppealDecision,
                    )}
                  </Typography>
                </Box>
                <Typography>
                  {getAppealDecitionText(
                    AppealDecitionRole.PROSECUTOR,
                    workingCase.prosecutorAppealDecision,
                  )}
                </Typography>
              </Box>
            </Box>
            <Box component="section" marginBottom={8}>
              <Box marginBottom={10}>
                <Box marginBottom={2}>
                  <Typography as="h3" variant="h3">
                    Úrskurðarorð
                  </Typography>
                </Box>
                <Box marginBottom={1}>
                  <Typography>{constructConclusion(workingCase)}</Typography>
                </Box>
              </Box>
            </Box>
            <FormFooter
              previousUrl={Constants.RULING_ROUTE}
              nextUrl={Constants.DETENTION_REQUESTS_ROUTE}
              nextButtonText="Staðfesta úrskurð"
            />
          </GridColumn>
        </GridRow>
      </GridContainer>
    </Box>
  ) : null
}

export default Confirmation
