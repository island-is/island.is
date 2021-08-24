import React from 'react'
import { Text, FormStepper, LoadingDots } from '@island.is/island-ui/core'

import {
  ContentContainer,
  Footer,
  StatusLayout,
} from '@island.is/financial-aid-web/osk/src/components'
import { ApplicationEvent, getState } from '@island.is/financial-aid/shared'

import { useQuery } from '@apollo/client'
import { GetApplicationEventQuery } from '@island.is/financial-aid-web/oskgraphql'

import format from 'date-fns/format'
import { useRouter } from 'next/router'

interface ApplicationEventData {
  applicationEvents: ApplicationEvent[]
}

const Timeline = () => {
  const router = useRouter()

  const { data, loading } = useQuery<ApplicationEventData>(
    GetApplicationEventQuery,
    {
      variables: { input: { id: router.query.id } },
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
              return {
                name: `${getState[event.state]} – ${format(
                  new Date(event.created),
                  'dd.MM.yyyy',
                )}  `,
              }
            })}
          />
        )}
        {loading && <LoadingDots />}
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
