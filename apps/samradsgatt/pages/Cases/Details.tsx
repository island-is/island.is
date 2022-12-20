import {
  ActionCard,
  Box,
  Text,
  GridColumn,
  GridRow,
  GridContainer,
  CategoryCard,
  FormStepper,
  Breadcrumbs,
  Divider,
} from '@island.is/island-ui/core'
// import { withMainLayout } from '@island.is/web/layouts/main'
import { FormStepperThemes } from '@island.is/island-ui/core'

const Details = () => {
  return (
    <GridContainer>
      <GridRow>
        <GridColumn span={'3/12'} paddingBottom={3}>
          <Box>
            <Box paddingY={3}>
              <Breadcrumbs
                items={[
                  { title: 'Breadcrumb', href: '/' },
                  { title: 'Breadcrumb', href: '/' },
                  { title: 'Breadcrumb', href: '/' },
                ]}
              />
            </Box>
            <Divider></Divider>
            <Box paddingY={3}>
              <Text variant="h3" color="blue400">
                {'Tímalína máls'}
              </Text>
              <FormStepper
                theme={FormStepperThemes.PURPLE}
                sections={[
                  {
                    name: 'Samráð fyrirhugað',
                  },
                  {
                    name: 'Til umsagnar',
                    children: [
                      {
                        type: 'SUB_SECTION',
                        name: '#Dagsetning',
                      },
                    ],
                  },
                  {
                    name: 'Niðurstöður í vinnslu',
                    children: [
                      {
                        type: 'SUB_SECTION',
                        name: '#Dagsetning',
                      },
                    ],
                  },
                  {
                    name: 'Niðurstöður birtar',
                  },
                ]}
                activeSection={2}
              />
            </Box>
          </Box>
          <Box
            marginBottom={6}
            borderBottomWidth={'standard'}
            borderTopWidth={'standard'}
            borderColor={'blue200'}
            paddingY={2}
            paddingLeft={1}
          >
            <Text variant="h3" color="purple400">
              {'Fjöldi umsagna: X'}
            </Text>
          </Box>
          <Box
            marginBottom={6}
            borderColor="blue300"
            borderWidth="standard"
            padding={3}
            borderStyle="solid"
            borderRadius="standard"
          >
            <Text variant="h3">{'Skrá áskrift'}</Text>
            <Text variant="default">
              {''} Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Delectus exercitationem placeat necessitatibus.....
            </Text>
            <form>{/* <InputController></InputController> */}</form>
          </Box>
        </GridColumn>
        <GridColumn span={'6/12'} paddingBottom={3} paddingTop={10}>
          <Box paddingLeft={4}>
            <GridRow>
              <Box
                marginRight={1}
                borderRightWidth={'standard'}
                borderColor={'purple300'}
                paddingRight={1}
                paddingLeft={2}
              >
                <Text variant="eyebrow" color="purple400">
                  {'Malanumer#'}
                </Text>
              </Box>
              <Box>
                <Text variant="eyebrow" color="purple400">
                  {'Dagsetning#'}
                </Text>
              </Box>
            </GridRow>
            <GridRow marginTop={3}>
              <Box
                marginRight={1}
                borderRightWidth={'standard'}
                borderColor={'blue200'}
                paddingRight={1}
                paddingLeft={2}
              >
                {' '}
                <Text variant="eyebrow" color="blue400">
                  {'Tag1'}
                </Text>
              </Box>
              <Box
                marginRight={2}
                borderRightWidth={'standard'}
                borderColor={'blue200'}
                paddingRight={1}
              >
                {' '}
                <Text variant="eyebrow" color="blue400">
                  {'Tag2'}
                </Text>
              </Box>
              <Text variant="eyebrow" color="blue400">
                {'Tag3'}
              </Text>
            </GridRow>
            <Box marginBottom={4} paddingTop={2}>
              <Text variant="h1" color="blue400">
                {'Titill máls'}
              </Text>
              <Box paddingTop={4}>
                <CategoryCard
                  heading="Niðurstöður í vinnslu"
                  text=" Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                  Repellat dolorem perspiciatis aperiam. Itaque, ipsa ea.
                  Nesciunt labore eveniet, ducimus ullam illo saepe animi. Nemo,
                  fugiat? Corrupti rem expedita magni totam."
                />
              </Box>
              <Box marginBottom={6} marginTop={4}>
                <Text variant="h4">{'Málsefni'}</Text>
                <Text variant="default">
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                  Repellat dolorem perspiciatis aperiam. Itaque, ipsa ea.
                  Nesciunt labore eveniet, ducimus ullam illo saepe animi. Nemo,
                  fugiat? Corrupti rem expedita magni totam.
                </Text>
              </Box>
              <Box>
                <Text variant="h4">{'Nánar um málið'}</Text>
                <Text variant="default">
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                  Repellat dolorem perspiciatis aperiam. Itaque, ipsa ea.
                  Nesciunt labore eveniet, ducimus ullam illo saepe animi. Nemo,
                  fugiat? Corrupti rem expedita magni totam.
                </Text>
              </Box>
            </Box>
            <Box marginBottom={6}>
              <Text variant="h1" color="blue400" paddingY={2}>
                {'Innsendar umsagnir'}
              </Text>
              <Box
                marginBottom={6}
                borderColor="blue300"
                borderWidth="standard"
                padding={3}
                borderStyle="solid"
                borderRadius="standard"
              >
                <Text variant="eyebrow" color="purple400">
                  {'#Dagsetning'}
                </Text>
                <Text variant="h3">{'Umsagnaradili#'}</Text>
                <Text variant="default">
                  {' '}
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                  Repellat dolorem perspiciatis aperiam. Itaque, ipsa ea.
                  Nesciunt labore eveniet, ducimus ullam illo saepe animi. Nemo,
                  fugiat? Corrupti rem expedita magni totam.
                </Text>
              </Box>
            </Box>
            <ActionCard
              headingVariant="h4"
              heading="Skrifa umsögn"
              text="Lorem ipsum dolar, ............"
              cta={{ label: 'Skrá mig inn' }}
            ></ActionCard>
          </Box>
        </GridColumn>
        <GridColumn span={'3/12'}>
          <Box paddingY={8}>
            <Box padding={3}>
              <CategoryCard
                heading="Skjöl til samráðs"
                text="Lorem ipsum......."
              />
            </Box>
            <Box padding={3}>
              <CategoryCard
                heading="Aðillar sem hafa fengið boð um samráð á máli."
                text="Lorem ipsum......."
              />
            </Box>
            <Box padding={3}>
              <CategoryCard
                heading="Ábyrgðaraðilli"
                text="Lorem ipsum......."
              />
            </Box>
          </Box>
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}

export default Details
