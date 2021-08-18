import React, { useContext } from 'react'
import { Text, FormStepper } from '@island.is/island-ui/core'

import {
  ContentContainer,
  Footer,
  StatusLayout,
} from '@island.is/financial-aid-web/osk/src/components'
import { ApplicationEvent, getState } from '@island.is/financial-aid/shared'
import { UserContext } from '@island.is/financial-aid-web/osk/src/components/UserProvider/UserProvider'

import { useQuery } from '@apollo/client'
import { GetApplicationEventQuery } from '@island.is/financial-aid-web/oskgraphql'

interface ApplicationEventData {
  applicationEvents: ApplicationEvent[]
}

const Timeline = () => {
  const { user } = useContext(UserContext)

  const { data, error, loading } = useQuery<ApplicationEventData>(
    GetApplicationEventQuery,
    {
      variables: { input: { id: user?.activeApplication } },
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  )

  return (
    <StatusLayout>
      <ContentContainer>
        <Text as="h1" variant="h2" marginBottom={[1, 1, 2]}>
          Staða umsóknar
        </Text>
        <Text marginBottom={[3, 3, 5]}>
          Hér geturðu séð hvað hefur gerst og hvað er framundan. Hikaðu ekki við
          að senda okkur athugasemd ef þú telur eitthvað óljóst eða rangt.
        </Text>
        {data?.applicationEvents && (
          <FormStepper
            activeSection={data?.applicationEvents.length - 1}
            sections={data?.applicationEvents.map((event) => {
              return { name: getState[event.state] }
            })}
          />
        )}
      </ContentContainer>
      <Footer
        previousUrl="/stada"
        prevButtonText="Til baka"
        hideNextButton={true}
      />
    </StatusLayout>
  )
}

export default Timeline
