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
  Stack,
} from '@island.is/island-ui/core'
// import { withMainLayout } from '@island.is/web/layouts/main'
import { FormStepperThemes } from '@island.is/island-ui/core'
import { Screen } from '../../../../apps/web/types'
import { Case } from '../Cases/schema'

interface DetailsProps {
  case: Case
}

const Details: Screen<DetailsProps> = ({ case: Case }) => {
  return (
    <GridContainer>
      <GridRow>
        <GridColumn span={'3/12'} paddingBottom={3}>
          <Box>
            <Breadcrumbs
              items={[
                { title: 'link', href: '/' },
                { title: 'text' },
                { isTag: true, title: 'link tag', href: '/' },
                { isTag: true, title: 'text tag' },
              ]}
            />
            <Divider></Divider>
            <Box padding={3}>
              <Text variant="h2" color="blue400">
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
            paddingY={'p1'}
          >
            {/* <Divider /> */}
            <Text variant="h3" color="purple400">
              {'Fjöldi umsagna:'}
            </Text>
          </Box>
          {/* <Box marginBottom={8}>
            <Divider />
          </Box> */}
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
              {''} Skráðu þig í áskrift af þessu máli. Þú færð e-mail til
              staðfestingar.
            </Text>
            <form>{/* <InputController></InputController> */}</form>
          </Box>
        </GridColumn>
        <GridColumn span={'6/12'} paddingBottom={3} paddingTop={3}>
          <Box paddingX={4}>
            <GridRow>
              <Text variant="eyebrow" color="purple400">
                {'#Malanumer'}
              </Text>
              <Text variant="eyebrow" color="purple400">
                {'#Dagsetning'}
              </Text>
            </GridRow>
            <GridRow>
              {/* <Stack space={2}>
                <Text>{'fleh'}</Text>
                <Text>{'fleh'}</Text>
                <Text>{'fleh'}</Text>
              </Stack> */}
              <Text variant="eyebrow" color="blue400">
                {'Text1'}
              </Text>
              <Text variant="eyebrow" color="blue400">
                {'Text2'}
              </Text>
              <Text variant="eyebrow" color="blue400">
                {'Text3'}
              </Text>
            </GridRow>
            <Box marginBottom={6} paddingTop={3}>
              <Text variant="h1" color="blue400">
                {'#Titill máls'}
              </Text>
              <Box marginBottom={6} marginTop={6}>
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
              >
                <Text variant="eyebrow" color="purple400">
                  {'#Dagsetning'}
                </Text>
                <Text variant="h3">{'Umsagnaradili'}</Text>
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
              text="This is the text"
              cta={{ label: 'Skrá mig inn' }}
            ></ActionCard>
          </Box>
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

// const Details = () => {
//   return (
//     <GridContainer>
//       <GridRow>
//         <GridColumn span={'3/12'} paddingBottom={3}>
//           <Box>
//             <Breadcrumbs
//               items={[
//                 { title: 'link', href: '/' },
//                 { title: 'text' },
//                 { isTag: true, title: 'link tag', href: '/' },
//                 { isTag: true, title: 'text tag' },
//               ]}
//             />
//             <Box padding={3}>
//               <Text variant="h2" color="blue400">
//                 {'Tímalína máls'}
//               </Text>
//               <FormStepper
//                 theme={FormStepperThemes.PURPLE}
//                 sections={[
//                   {
//                     name: 'Section #1',
//                   },
//                   {
//                     name: 'Section #2',
//                     children: [
//                       {
//                         type: 'SUB_SECTION',
//                         name: 'Sub section #1',
//                       },
//                       {
//                         type: 'SUB_SECTION',
//                         name: 'Sub section #2',
//                       },
//                     ],
//                   },
//                   {
//                     name: 'Section #3',
//                   },
//                 ]}
//                 activeSection={1}
//               />
//             </Box>
//           </Box>
//           <Box
//             marginBottom={6}
//             borderBottomWidth={'standard'}
//             borderTopWidth={'standard'}
//             borderColor={'blue200'}
//             paddingY={'p1'}
//           >
//             {/* <Divider /> */}
//             <Text variant="h3" color="purple400">
//               {'Fjöldi umsagna:'}
//             </Text>
//           </Box>
//           {/* <Box marginBottom={8}>
//             <Divider />
//           </Box> */}
//           <Box
//             marginBottom={6}
//             borderColor="blue300"
//             borderWidth="standard"
//             padding={3}
//             borderStyle="solid"
//             borderRadius="standard"
//           ></Box>
//         </GridColumn>
//         <GridColumn span={'6/12'} paddingBottom={3} paddingTop={3}>
//           <Box
//             marginBottom={6}
//             borderColor="blue300"
//             borderWidth="standard"
//             padding={3}
//             borderStyle="solid"
//             borderRadius="standard"
//           ></Box>
//           <Text variant="h1" color="blue400">
//             {'Innsendar umsagnir'}
//           </Text>
//           <Box
//             marginBottom={6}
//             borderColor="blue300"
//             borderWidth="standard"
//             padding={3}
//             borderStyle="solid"
//             borderRadius="standard"
//           ></Box>
//           <ActionCard
//             headingVariant="h4"
//             heading="Skrifa umsögn"
//             text="This is the text"
//             cta={{ label: 'Skrá mig inn' }}
//           ></ActionCard>
//         </GridColumn>
//         <GridColumn span={'3/12'}>
//           <Box>
//             <Box padding={3}>
//               <CategoryCard heading="Niðurstöður í vinnslu" text="fleh" />
//             </Box>
//             <Box padding={3}>
//               <CategoryCard heading="Ábyrgðaraðilli" text="fleh" />
//             </Box>
//             <Box padding={3}>
//               <CategoryCard heading="Skjöl til samráðs" text="fleh" />
//             </Box>
//             <Box padding={3}>
//               <CategoryCard
//                 heading="Aðillar sem hafa fengið boð um samráð á máli."
//                 text="fleh"
//               />
//             </Box>
//           </Box>
//         </GridColumn>
//       </GridRow>
//     </GridContainer>
//   )
// }

// export default withMainLayout(Details)

export default Details
