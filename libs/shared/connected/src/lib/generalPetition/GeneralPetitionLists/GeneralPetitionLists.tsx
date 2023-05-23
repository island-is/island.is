import { Box, Text, Stack, ActionCard } from '@island.is/island-ui/core'
import { useRouter } from 'next/router'
import { useGetPetitionLists } from './useGetPetitionLists'
import format from 'date-fns/format'
import { FC } from 'react'
import { ConnectedComponent } from '@island.is/api/schema'
import { useLocalization } from '../../../utils'

interface GeneralPetitionProps {
  slice: ConnectedComponent
}

const formatDate = (date: string) => {
  try {
    return format(new Date(date), 'dd.MM.yyyy')
  } catch {
    return date
  }
}

export const GeneralPetitionLists: FC<GeneralPetitionProps> = ({ slice }) => {
  const router = useRouter()
  const petitionLists = useGetPetitionLists()
  const t = useLocalization(slice.json)

  return (
    <>
      <Box marginBottom={3}>
        <Text variant="h4">{t('title', 'Virkir undirskriftalistar')}</Text>
      </Box>
      <Stack space={4}>
        {petitionLists?.data?.map((petition: any) => {
          return (
            <ActionCard
              key={petition.title}
              backgroundColor="white"
              heading={petition.title}
              text={
                t('openTil', 'Virkur til:') +
                ' ' +
                formatDate(petition.closedDate)
              }
              cta={{
                label: t('viewList', 'Skoða lista'),
                variant: 'text',
                icon: 'arrowForward',
                onClick: () => {
                  router.push('/undirskriftalistar/' + petition.id)
                },
              }}
            />
          )
        })}
      </Stack>
    </>
  )
}

export default GeneralPetitionLists
