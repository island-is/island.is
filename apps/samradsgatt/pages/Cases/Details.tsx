import {
  ActionCard,
  Box,
  Filter,
  FilterInput,
  FilterMultiChoice,
  FilterProps,
  Checkbox,
  Stack,
  Text,
  Divider,
  Button,
  GridColumn,
  GridRow,
  GridContainer,
  SkeletonLoader,
  CategoryCard,
  FormStepper,
} from '@island.is/island-ui/core'
import { ReactNode } from 'react'
import { withMainLayout } from '@island.is/web/layouts/main'
import { FormStepperThemes } from '@island.is/island-ui/core'

const Details = () => {
  return (
    <GridContainer>
      <GridRow>
        <GridColumn span={'3/12'} paddingBottom={3}>
          <Box>
            <Box padding={3}>
              <FormStepper
                theme={FormStepperThemes.PURPLE}
                sections={[
                  {
                    name: 'Section #1',
                  },
                  {
                    name: 'Section #2',
                    children: [
                      {
                        type: 'SUB_SECTION',
                        name: 'Sub section #1',
                      },
                      {
                        type: 'SUB_SECTION',
                        name: 'Sub section #2',
                      },
                    ],
                  },
                  {
                    name: 'Section #3',
                  },
                ]}
                activeSection={1}
              />
            </Box>
          </Box>
          <Box
            marginBottom={6}
            borderColor="blue300"
            borderWidth="standard"
            padding={3}
            borderStyle="solid"
            borderRadius="standard"
          ></Box>
          <Box
            marginBottom={6}
            borderColor="blue300"
            borderWidth="standard"
            padding={3}
            borderStyle="solid"
            borderRadius="standard"
          ></Box>
        </GridColumn>
        <GridColumn span={'6/12'} paddingBottom={3} paddingTop={3}>
          <Box
            marginBottom={6}
            borderColor="blue300"
            borderWidth="standard"
            padding={3}
            borderStyle="solid"
            borderRadius="standard"
          ></Box>
          <Text variant="h1" color="blue400">
            {'Innsendar umsagnir'}
          </Text>
          <Box
            marginBottom={6}
            borderColor="blue300"
            borderWidth="standard"
            padding={3}
            borderStyle="solid"
            borderRadius="standard"
          ></Box>
          <ActionCard
            headingVariant="h4"
            heading="Skrifa umsögn"
            text="This is the text"
            cta={{ label: 'Skrá mig inn' }}
          ></ActionCard>
        </GridColumn>
        <GridColumn span={'3/12'}>
          <Box>
            <Box padding={3}>
              <CategoryCard heading="Niðurstöður í vinnslu" text="fleh" />
            </Box>
            <Box padding={3}>
              <CategoryCard heading="Ábyrgðaraðilli" text="fleh" />
            </Box>
            <Box padding={3}>
              <CategoryCard heading="Skjöl til samráðs" text="fleh" />
            </Box>
            <Box padding={3}>
              <CategoryCard
                heading="Aðillar sem hafa fengið boð um samráð á máli."
                text="fleh"
              />
            </Box>
          </Box>
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}

export default Details
