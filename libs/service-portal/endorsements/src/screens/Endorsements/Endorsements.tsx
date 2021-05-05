import React from 'react'
import { defineMessage } from 'react-intl'
import { Box, Text, ActionCard, Stack } from '@island.is/island-ui/core'
import { useNamespaces } from '@island.is/localization'
import { IntroHeader } from '@island.is/service-portal/core'
import { useLocale } from '@island.is/localization'
import { MessageDescriptor } from 'react-intl'

function Endorsements(): JSX.Element {
  useNamespaces('sp.endorsements')
  const { formatMessage } = useLocale()
  const introTitle: MessageDescriptor = defineMessage({
    id: 'service.portal:endorsements-title',
    defaultMessage: 'Meðmælendalistar',
  })
  const intro: MessageDescriptor = defineMessage({
    id: 'service.portal:endorsements-intro',
    defaultMessage:
      'Einhver texti um hvaða umboð aðili hefur og hvaða aðgerðir eru í boði',
  })
  const myEndorsements: MessageDescriptor = defineMessage({
    id: 'service.portal:endorsements-my-endorsements',
    defaultMessage: 'Mínar skráningar',
  })
  const availableEndorsements: MessageDescriptor = defineMessage({
    id: 'service.portal:endorsements-available-endorsements',
    defaultMessage: 'Meðmælendalistar sem þú getur stutt í þínu kjördæmi',
  })

  const actionCardButton: MessageDescriptor = defineMessage({
    id: 'service.portal:endorsements-button',
    defaultMessage: 'Skoða nánar',
  })

  return (
    <Box marginBottom={[6, 6, 10]}>
      <IntroHeader title={introTitle} intro={intro} />
      <Text variant="h3" marginTop={4} marginBottom={2}>
        {formatMessage(myEndorsements)}
      </Text>
      <Stack space={4}>
        <ActionCard
          backgroundColor="blue"
          eyebrow="Alþingi 2021"
          heading="Listabókstafur: Drögar (Ö)"
          tag={{
            label: 'Alþingi 2021',
            variant: 'darkerBlue',
            outlined: false,
          }}
          text="Listabókstafur"
          cta={{
            label: formatMessage(actionCardButton),
            variant: 'text',
            icon: undefined,
          }}
        />
        <ActionCard
          backgroundColor="blue"
          eyebrow="Forsetakosningar 2002"
          heading="Ólafur Ragnar Grímsson"
          tag={{
            label: 'Forsetakosningar 2002',
            variant: 'darkerBlue',
            outlined: false,
          }}
          text="Norðurkjördæmi"
          cta={{
            label: formatMessage(actionCardButton),
            variant: 'text',
            icon: undefined,
          }}
        />
        <ActionCard
          backgroundColor="blue"
          eyebrow="Alþingi 2021"
          heading="Listabókstafur: Drögar (Ö)"
          tag={{
            label: 'Alþingi 2021',
            variant: 'darkerBlue',
            outlined: false,
          }}
          text="Listabókstafur"
          cta={{
            label: formatMessage(actionCardButton),
            variant: 'text',
            icon: undefined,
          }}
        />
      </Stack>
      <Text variant="h3" marginTop={8} marginBottom={2}>
        {formatMessage(availableEndorsements)}
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
            label: formatMessage(actionCardButton),
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
            label: formatMessage(actionCardButton),
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
            label: formatMessage(actionCardButton),
            variant: 'text',
            icon: undefined,
          }}
        />
      </Stack>
    </Box>
  )
}

export default Endorsements
