import { Box, Text, Stack, ActionCard } from '@island.is/island-ui/core'
import { useRouter } from 'next/router'
import { useGetPetitionLists } from './useGetPetitionLists'
import format from 'date-fns/format'

const formatDate = (date: string) => {
  try {
    return format(new Date(date), 'dd.MM.yyyy')
  } catch {
    return date
  }
}

export const GeneralPetitionLists = () => {
  const petitionLists = useGetPetitionLists()
  const router = useRouter()

  return (
    <>
      <Box marginBottom={3}>
        <Text variant="h4">{'Virkir undirskriftalistar'}</Text>
      </Box>
      <Stack space={4}>
        {petitionLists?.data?.map((petition: any) => {
          return (
            <ActionCard
              key={petition.title}
              backgroundColor="white"
              heading={petition.title}
              text={
                'Tímabil lista:' +
                ' ' +
                formatDate(petition.openedDate) +
                ' - ' +
                formatDate(petition.closedDate)
              }
              cta={{
                label: 'Skoða lista',
                variant: 'text',
                icon: 'arrowForward',
                onClick: () => {
                  router
                    .push('/undirskriftalistar/' + petition.id)
                    .then(() => window.scrollTo(0, 0))
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
