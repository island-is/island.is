import React from 'react'
import {
  Box,
  Text,
  GridContainer,
  FormStepper,
  Breadcrumbs,
  Divider,
} from '@island.is/island-ui/core'
import { FormStepperThemes } from '@island.is/island-ui/core'

const LeftSideColumn = () => {
  return (
    <GridContainer>
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
          {''} Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus
          exercitationem placeat necessitatibus.....
        </Text>
        <form>{/* <InputController></InputController> */}</form>
      </Box>
    </GridContainer>
  )
}

export default LeftSideColumn
