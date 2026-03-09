import { useRouter } from 'next/router'
import { Box, Text, Stack, ActionCard, Input } from '@island.is/island-ui/core'
import format from 'date-fns/format'
import { FC, useState } from 'react'
import { ConnectedComponent, EndorsementList } from '@island.is/api/schema'
import { useGetPetitionLists } from './useGetPetitionLists'
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

const normalizeSearchTerm = (value: string) => {
  return value.trim().toLowerCase()
}

export const GeneralPetitionLists: FC<
  React.PropsWithChildren<GeneralPetitionProps>
> = ({ slice }) => {
  const router = useRouter()
  const { data: petitionLists, loading } = useGetPetitionLists()
  const t = useLocalization(slice.json)
  const [queryString, setQueryString] = useState<string>('')

  if (loading || !petitionLists) return null

  const filteredPetitionLists =
    petitionLists?.filter((petition: EndorsementList) => {
      const normalizedTitle = normalizeSearchTerm(petition?.title ?? '')
      const normalizedQueryString = normalizeSearchTerm(queryString)
      return (
        normalizedTitle.includes(normalizedQueryString) ||
        normalizedTitle.includes(normalizedQueryString.replaceAll('´', ''))
      )
    }) ?? []

  return (
    <Box marginTop={10}>
      <Stack space={3}>
        <Input
          name="queryString"
          value={queryString}
          onChange={(e) => setQueryString(e.target.value)}
          label={t('search', 'Leita að undirskrifalista')}
          size="sm"
        />

        <Box>
          {filteredPetitionLists.length === 0 && (
            <Box marginBottom={3}>
              <Text>{t('noListsFound', 'Engir listar fundust')}</Text>
            </Box>
          )}
          {filteredPetitionLists.length > 0 && (
            <Box marginBottom={3}>
              <Text variant="h4">{t('title', 'Virkir listar')}</Text>
            </Box>
          )}
          <Stack space={3}>
            {filteredPetitionLists.map((petition: EndorsementList) => {
              return (
                <ActionCard
                  key={petition.id}
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
        </Box>
      </Stack>
    </Box>
  )
}

export default GeneralPetitionLists
