import React, { FC } from 'react'
import {
  Stack,
  Typography,
  Accordion,
  AccordionItem,
  GridContainer,
  Box,
  GridRow,
  GridColumn,
} from '@island.is/island-ui/core'
import { Card } from '@island.is/skilavottord-web/components'
import Link from 'next/link'

const CompanyList: FC = () => (
  <Stack space={2}>
    <Typography variant="h3">
      Recycling companies
    </Typography>
    <Accordion dividerOnTop={false}>
      <AccordionItem label="VAKA" id="1">
        <Stack space={2}>
          <GridContainer>
            <Box paddingBottom={2}>
              <GridRow>
                <GridColumn span="8/12">
                  <Stack space={2}>
                    <Card title={'Map'} description={'Placeholder'} />
                    <Box>
                      <Typography variant="p">Contact</Typography>
                      <Link href="">
                        <a>Contact</a>
                      </Link>
                      <Link href="">
                        <a>Contact</a>
                      </Link>
                    </Box>
                  </Stack>
                </GridColumn>
                <GridColumn span="4/12">
                  <GridRow>
                    <GridColumn span="12/12">
                      <Typography variant="h5">Opening hours</Typography>
                    </GridColumn>
                    <GridColumn span="3/12">
                      <Typography variant="h5">Mon</Typography>
                    </GridColumn>
                    <GridColumn span="9/12">
                      <Typography variant="p">08:00-18:00</Typography>
                    </GridColumn>
                    <GridColumn span="3/12">
                      <Typography variant="h5">Tue</Typography>
                    </GridColumn>
                    <GridColumn span="9/12">
                      <Typography variant="p">08:00-18:00</Typography>
                    </GridColumn>
                    <GridColumn span="3/12">
                      <Typography variant="h5">Wed</Typography>
                    </GridColumn>
                    <GridColumn span="9/12">
                      <Typography variant="p">08:00-18:00</Typography>
                    </GridColumn>
                  </GridRow>
                </GridColumn>
              </GridRow>
            </Box>
          </GridContainer>
        </Stack>
      </AccordionItem>
      <AccordionItem label="Hringrás" id="2">
        <Stack space={2}>
          <Typography variant="p">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Amet
            molestie viverra molestie pharetra vestibulum. Non erat diam, lorem
            malesuada felis nec turpis enim. Maecenas netus sagittis
            pellentesque ultrices est dolor pretium. Aliquam quis rutrum quam
            sed.
          </Typography>
        </Stack>
      </AccordionItem>
    </Accordion>
  </Stack>
)

export default CompanyList
