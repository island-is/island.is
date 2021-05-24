import React, { useState } from 'react'
import { Box, Text, ActionCard, Stack } from '@island.is/island-ui/core'
import { IntroHeader } from '@island.is/service-portal/core'
import { useLocale } from '@island.is/localization'
import { formatDate } from '@island.is/judicial-system/formatters'
import { useQuery } from '@apollo/client'
import gql from 'graphql-tag'
import { m } from '../../lib/messages'
import { Endorsement } from '@island.is/api/schema'

export type UserEndorsements = Pick<
  Endorsement,
  'id' | 'created' | 'endorsementList'
>

const GET_ENDORSEMENTS = gql`
  query endorsementSystemUserEndorsements {
    endorsementSystemUserEndorsements {
      id
      endorser
      endorsementList {
        id
        title
        description
      }
      meta {
        fullName
        address
      }
      created
      modified
    }
  }
`

const Endorsements = () => {
  const [endorsements, setEndorsements] = useState<UserEndorsements[]>()
  const { formatMessage } = useLocale()

  const { loading, error } = useQuery(GET_ENDORSEMENTS, {
    onCompleted: async ({ endorsementSystemUserEndorsements }) => {
      if (!loading && endorsementSystemUserEndorsements) {
        const organisationsPreview: UserEndorsements[] =
          endorsementSystemUserEndorsements || []
        setEndorsements(organisationsPreview)
      }
    },
  })

  return (
    <Box marginBottom={[6, 6, 10]}>
      <IntroHeader
        title={m.endorsement.introTitle}
        intro={m.endorsement.intro}
      />
      {endorsements && endorsements.length > 0 && (
        <>
          <Text variant="h3" marginTop={4} marginBottom={2}>
            {formatMessage(m.endorsement.myEndorsements)}
          </Text>
          <Stack space={4}>
            {endorsements.map((endorsement) => {
              return (
                <ActionCard
                  key={endorsement.id}
                  backgroundColor="blue"
                  eyebrow={formatDate(endorsement.created, 'dd.MM.yyyy')}
                  heading={`${endorsement.endorsementList?.title} (${endorsement.endorsementList?.description})`}
                  tag={{
                    label: 'Alþingi 2021',
                    variant: 'darkerBlue',
                    outlined: false,
                  }}
                  text="Kjördæmi"
                  cta={{
                    label: formatMessage(m.endorsement.actionCardButton),
                    variant: 'text',
                    icon: undefined,
                  }}
                />
              )
            })}
          </Stack>
        </>
      )}
      <Text variant="h3" marginTop={8} marginBottom={2}>
        {formatMessage(m.endorsement.availableEndorsements)}
      </Text>
      <Stack space={4}>
        <ActionCard
          heading="Framboðslisti Sjálfstæðisflokksins (D)"
          eyebrow="Forsetakosningar 2024"
          tag={{
            label: 'Forsetakosningar 2024',
            variant: 'blue',
            outlined: false,
          }}
          text="Reykjavík Norður"
          cta={{
            label: formatMessage(m.endorsement.actionCardButton),
            variant: 'text',
            icon: undefined,
          }}
        />

        <ActionCard
          heading="Framboðslisti Samfylkingarinnar (S)"
          eyebrow="Forsetakosningar 2024"
          text="Reykjavík Norður"
          tag={{
            label: 'Forsetakosningar 2024',
            variant: 'blue',
            outlined: false,
          }}
          cta={{
            label: formatMessage(m.endorsement.actionCardButton),
            variant: 'text',
            icon: undefined,
          }}
        />
        <ActionCard
          heading="Framboðslisti Miðflokksins (M)"
          eyebrow="Forsetakosningar 2024"
          tag={{
            label: 'Forsetakosningar 2024',
            variant: 'blue',
            outlined: false,
          }}
          text="Reykjavík Norður"
          cta={{
            label: formatMessage(m.endorsement.actionCardButton),
            variant: 'text',
            icon: undefined,
          }}
        />
      </Stack>
    </Box>
  )
}

export default Endorsements
