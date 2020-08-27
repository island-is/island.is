import React from 'react'
import {
  Typography,
  Box,
  Stack,
  AccordionCard,
  Columns,
  Column,
  Button,
} from '@island.is/island-ui/core'
import { ServicePortalModuleComponent } from '@island.is/service-portal/core'
import { GET_HELLO_WORLD_GREETING } from '@island.is/service-portal/graphql'
import { useQuery } from '@apollo/client'

const SubjectInfo: ServicePortalModuleComponent = ({ userInfo }) => {
  const { profile } = userInfo.user
  const { data } = useQuery(GET_HELLO_WORLD_GREETING, {
    variables: {
      input: {
        name: 'Service Portal Settings Module',
      },
    },
  })

  return (
    <div>
      <Box marginBottom={7}>
        <Typography variant="h2" as="h2">
          Mínar upplýsingar
        </Typography>
      </Box>
      <Stack space={3}>
        <AccordionCard
          id="graphql-response"
          label="GraphQL API response"
          visibleContent={
            <Box marginTop={1}>T.d vegabréf sem er að renna út eða...</Box>
          }
        >
          <Stack space={2}>
            <Box padding={3} border="standard" borderRadius="large">
              {data?.helloWorld?.message}
            </Box>
          </Stack>
        </AccordionCard>
        <AccordionCard
          id="basic-user-info"
          label="Þínar upplýsingar"
          visibleContent={
            <Box marginTop={1}>T.d vegabréf sem er að renna út eða...</Box>
          }
        >
          <Stack space={2}>
            <Box padding={3} border="standard" borderRadius="large">
              <Columns collapseBelow="sm" alignY="center">
                <Column width="5/12">Nafn</Column>
                <Column width="4/12">{profile.name}</Column>
                <Column width="3/12">
                  <Box textAlign="right">
                    <Button variant="ghost" size="small">
                      Breyta nafni
                    </Button>
                  </Box>
                </Column>
              </Columns>
            </Box>
            <Box padding={3} border="standard" borderRadius="large">
              <Columns collapseBelow="sm" alignY="center">
                <Column width="5/12">Trúfélag / lífsskoðunarfélag</Column>
                <Column width="4/12">{profile.birthdate}</Column>
                <Column width="3/12">
                  <Box textAlign="right">
                    <Button size="small">Breyta um trúfélag</Button>
                  </Box>
                </Column>
              </Columns>
            </Box>
          </Stack>
        </AccordionCard>
        <AccordionCard
          id="real-estate-info"
          label="Lögheimili"
          visibleContent={
            <Columns collapseBelow="sm">
              <Column width="3/4">
                Hvernig skólakerfið virkar, hvaða nám er í boði og hvernig hægt
                er að sækja um. Grunnskólar, framhaldsskólar og háskólar.
              </Column>
            </Columns>
          }
        >
          <Stack space={2}>
            <Box padding={3} border="standard" borderRadius="large">
              <Columns collapseBelow="sm" alignY="center">
                <Column width="5/12">Nafn</Column>
                <Column width="4/12">{profile.name}</Column>
                <Column width="3/12">
                  <Box textAlign="right">
                    <Button variant="ghost" size="small">
                      Breyta nafni
                    </Button>
                  </Box>
                </Column>
              </Columns>
            </Box>
            <Box padding={3} border="standard" borderRadius="large">
              <Columns collapseBelow="sm" alignY="center">
                <Column width="5/12">Trúfélag / lífsskoðunarfélag</Column>
                <Column width="4/12">{profile.birthdate}</Column>
                <Column width="3/12">
                  <Box textAlign="right">
                    <Button size="small">Breyta um trúfélag</Button>
                  </Box>
                </Column>
              </Columns>
            </Box>
          </Stack>
        </AccordionCard>
      </Stack>
    </div>
  )
}

export default SubjectInfo
