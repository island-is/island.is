import React from 'react'
import { Box, Text, Stack, ActionCard, Link } from '@island.is/island-ui/core'
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
        <Text variant="h4">{'Virkir meðmælendalistar'}</Text>
      </Box>
      <Stack space={4}>
        {petitionLists?.data?.map((petition: any) => {
          return (
            <Link
              href={''}
              key={petition.id}
              onClick={() =>
                router
                  .push('/undirskriftalistar/' + petition.id)
                  .then(() => window.scrollTo(0, 0))
              }
            >
              <ActionCard
                key={petition.title}
                backgroundColor="blue"
                heading={petition.title}
                text={
                  'Tímabil lista:' +
                  ' ' +
                  formatDate(petition.openedDate) +
                  ' - ' +
                  formatDate(petition.closedDate)
                }
                cta={{
                  label: 'Nánar um lista',
                  variant: 'text',
                  icon: 'arrowForward',
                }}
              />
            </Link>
          )
        })}
      </Stack>
    </>
  )
}

export default GeneralPetitionLists
