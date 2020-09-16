import React from 'react'
import {
  GridContainer,
  GridRow,
  Box,
  GridColumn,
  Typography,
} from '@island.is/island-ui/core'
import { Logo } from '../../shared-components/Logo/Logo'
import { formatDate, capitalize } from '../../utils/formatters'
import is from 'date-fns/locale/is'

export const Overview: React.FC = () => {
  const caseDraft = window.localStorage.getItem('workingCase')
  const caseDraftJSON = JSON.parse(caseDraft)

  return (
    <Box marginTop={7}>
      <GridContainer>
        <GridRow>
          <GridColumn span={'3/12'}>
            <Logo />
          </GridColumn>
          <GridColumn span={'8/12'} offset={'1/12'}>
            <Typography as="h1">Krafa um gæsluvarðhald</Typography>
          </GridColumn>
        </GridRow>
        <GridRow>
          <GridColumn span={['12/12', '3/12']}>
            <Typography>Hliðarstika</Typography>
          </GridColumn>
          <GridColumn span={['12/12', '7/12']} offset={['0', '1/12']}>
            <Box component="section" marginBottom={5}>
              <Box marginBottom={1}>
                <Typography variant="eyebrow" color="blue400">
                  LÖKE málsnúmer
                </Typography>
              </Box>
              <Typography>{caseDraftJSON.case.policeCaseNumber}</Typography>
            </Box>
            <Box component="section" marginBottom={5}>
              <Box marginBottom={1}>
                <Typography variant="eyebrow" color="blue400">
                  Fullt nafn kærða
                </Typography>
              </Box>
              <Typography>{caseDraftJSON.case.suspectName}</Typography>
            </Box>
            <Box component="section" marginBottom={5}>
              <Box marginBottom={1}>
                <Typography variant="eyebrow" color="blue400">
                  Lögheimili/dvalarstaður
                </Typography>
              </Box>
              <Typography>{caseDraftJSON.case.suspectAddress}</Typography>
            </Box>
            <Box component="section" marginBottom={5}>
              <Box marginBottom={1}>
                <Typography variant="eyebrow" color="blue400">
                  Dómstóll
                </Typography>
              </Box>
              <Typography>{caseDraftJSON.case.court}</Typography>
            </Box>
            <Box component="section" marginBottom={5}>
              <Box marginBottom={1}>
                <Typography variant="eyebrow" color="blue400">
                  Tími handtöku
                </Typography>
              </Box>
              <Typography>
                {`${capitalize(
                  formatDate(caseDraftJSON.case.arrestDate, 'PPPP', {
                    locale: is,
                  }),
                )} kl. ${caseDraftJSON.case.arrestTime}`}
              </Typography>
            </Box>
            {caseDraftJSON.case.requestedCourtDate &&
              caseDraftJSON.case.requestedCourtTime && (
                <Box component="section" marginBottom={5}>
                  <Box marginBottom={1}>
                    <Typography variant="eyebrow" color="blue400">
                      Ósk um fyrirtökudag og tíma
                    </Typography>
                  </Box>
                  <Typography>
                    {`${capitalize(
                      formatDate(
                        caseDraftJSON.case.requestedCourtDate,
                        'PPPP',
                        {
                          locale: is,
                        },
                      ),
                    )} kl. ${caseDraftJSON.case.requestedCourtTime}`}
                  </Typography>
                </Box>
              )}
          </GridColumn>
        </GridRow>
      </GridContainer>
    </Box>
  )
}

export default Overview
