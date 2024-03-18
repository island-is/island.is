import format from 'date-fns/format'
import is from 'date-fns/locale/is'
import { useRouter } from 'next/router'

import { MinistryOfJusticeAdvertsResponse } from '@island.is/api/schema'
import { ActionCard, Box, Inline, Stack, Tag } from '@island.is/island-ui/core'

import { advertUrl } from './OJOIUtils'

export const OJOISearchGridView = ({
  adverts,
}: {
  adverts?: MinistryOfJusticeAdvertsResponse['adverts']
}) => {
  const router = useRouter()

  return (
    <Stack space={2}>
      {adverts?.map((ad) => (
        <ActionCard
          key={ad.id}
          eyebrow={ad.involvedParty?.title}
          heading={ad.publicationNumber?.full}
          tag={{
            label: `${ad.department?.title} - Útg.: ${format(
              new Date(ad.publicationDate),
              'dd.MM.yyyy',
              {
                locale: is,
              },
            )}`,
            outlined: false,
            variant: 'white',
          }}
          text={ad.title}
          cta={{
            icon: 'arrowForward',
            label: 'Skoða nánar',
            variant: 'text',
            size: 'small',
            onClick: () => {
              router.push(advertUrl + '/' + ad.id)
            },
          }}
        >
          <Box marginTop={3}>
            <Inline space={1}>
              {ad.categories?.map((cat) => (
                <Tag key={cat.id} variant="white" outlined disabled>
                  {cat.title}
                </Tag>
              ))}
            </Inline>
          </Box>
        </ActionCard>
      ))}
    </Stack>
  )
}
