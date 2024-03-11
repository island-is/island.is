import { useRouter } from 'next/router'

import { ActionCard, Box, Inline, Stack, Tag } from '@island.is/island-ui/core'

import {
  AdvertType,
  stjornartidindiAdvertUrl,
} from '../../../components/Stjornartidindi'

export const StjornartidindiSearchGridView = ({
  adverts,
}: {
  adverts: Array<AdvertType>
}) => {
  const router = useRouter()

  return (
    <Stack space={2}>
      {adverts.map((ad) => (
        <ActionCard
          key={ad.id}
          eyebrow={ad.stofnun}
          heading={ad.numer}
          tag={{
            label: `${ad.deild} - Útg.: ${ad.utgafa}`,
            outlined: false,
            variant: 'white',
          }}
          text={ad.heiti}
          cta={{
            icon: 'arrowForward',
            label: 'Skoða nánar',
            variant: 'text',
            size: 'small',
            onClick: () => {
              router.push(stjornartidindiAdvertUrl + '/' + ad.id)
            },
          }}
        >
          <Box marginTop={3}>
            <Inline space={1}>
              {ad.flokkar.map((f) => (
                <Tag key={f} variant="white" outlined disabled>
                  {f}
                </Tag>
              ))}
            </Inline>
          </Box>
        </ActionCard>
      ))}
    </Stack>
  )
}
