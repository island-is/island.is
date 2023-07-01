import { Box, Text, Stack, ActionCard } from '@island.is/island-ui/core'
import { useRouter } from 'next/router'
import { useGetPetitionLists } from './useGetPetitionLists'
import format from 'date-fns/format'
import { FC } from 'react'
import { ConnectedComponent, EndorsementList } from '@island.is/api/schema'
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

const getBaseUrl = () => {
  const baseUrl =
    window.location.origin === 'http://localhost:4200'
      ? 'http://localhost:4242'
      : window.location.origin

  return `${baseUrl}/umsoknir/undirskriftalisti`
}

export const GeneralPetitionLists: FC<
  React.PropsWithChildren<GeneralPetitionProps>
> = ({ slice }) => {
  const router = useRouter()
  const petitionLists = useGetPetitionLists()
  const t = useLocalization(slice.json)

  return (
    <>
      <Box marginY={5}>
        <ActionCard
          heading={t('createList', 'Stofna undirskriftalista')}
          backgroundColor="blue"
          cta={{
            label: t('logIn', 'Innskráning'),
            variant: 'primary',
            icon: 'open',
            iconType: 'outline',
            size: 'small',
            onClick: () => window.open(getBaseUrl(), '_blank'),
          }}
        />
      </Box>
      {petitionLists?.data?.length > 0 && (
        <Box marginTop={10} marginBottom={3}>
          <Text variant="h4">{t('title', 'Virkir listar')}</Text>
        </Box>
      )}
      <Stack space={4}>
        {petitionLists?.data?.map((petition: EndorsementList) => {
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
