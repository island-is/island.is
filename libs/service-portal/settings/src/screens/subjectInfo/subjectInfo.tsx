import React from 'react'
import { Typography, Box, Stack } from '@island.is/island-ui/core'
import { ServicePortalModuleComponent } from '@island.is/service-portal/core'
import { GET_DOCUMENT } from '@island.is/service-portal/graphql'
import { useQuery } from '@apollo/client'
import InfoAccordionCard from '../../components/InfoAccordionCard/InfoAccordionCard'
import UserInfoCard from './cards/UserInfo'

const SubjectInfo: ServicePortalModuleComponent = ({ userInfo }) => {
  const { data } = useQuery(GET_DOCUMENT, {
    variables: {
      input: {
        id: '12456',
      },
    },
  })

  return (
    <>
      <Box marginBottom={7}>
        <Typography variant="h2" as="h2">
          Mínar upplýsingar
        </Typography>
      </Box>
      <Stack space={3}>
        <InfoAccordionCard
          id="graphql-response"
          label="GraphQL API response"
          description="T.d vegabréf sem er að renna út eða..."
          rows={[
            {
              columns: [
                {
                  content: data?.getDocument?.subject,
                },
              ],
            },
          ]}
        />
        <UserInfoCard userInfo={userInfo} />
      </Stack>
    </>
  )
}

export default SubjectInfo
