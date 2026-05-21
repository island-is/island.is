import { useState } from 'react'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  CardLoader,
  m,
  IntroWrapper,
  LinkButton,
  SYSLUMENN_SLUG,
} from '@island.is/portals/my-pages/core'
import { estatesMessages as em } from '../../lib/messages'
import {
  ActionCard,
  Box,
  Checkbox,
  GridColumn,
  GridRow,
  Input,
  Stack,
  Tag,
} from '@island.is/island-ui/core'
import { Problem } from '@island.is/react-spa/shared'
import { useNavigate } from 'react-router-dom'
import { EstatesPaths } from '../../lib/paths'

// TODO: Uncomment and wire up when the GraphQL domain for estates is ready
// import { useEstatesOverviewQuery } from './EstatesOverview.generated'

export const EstatesOverview = () => {
  useNamespaces('sp.estates')
  const { formatMessage } = useLocale()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [showFinished, setShowFinished] = useState(false)

  // TODO: Replace with real query once `getEstates` GraphQL resolver is available.
  // const { data, loading, error } = useEstatesOverviewQuery({
  //   variables: { input: { kennitala: userInfo.nationalId } },
  // })
  const loading = false
  const error = undefined
  const estates: {
    id: string
    caseNumber: string
    deceasedName: string
    isFinished: boolean
  }[] = []

  const filtered = estates.filter((e) => {
    if (!showFinished && e.isFinished) return false
    if (search && !e.deceasedName.toLowerCase().includes(search.toLowerCase()))
      return false
    return true
  })

  return (
    <IntroWrapper
      title={em.title}
      intro={em.intro}
      serviceProvider={{
        slug: SYSLUMENN_SLUG,
        tooltip: formatMessage(m.estatesTooltip),
      }}
      buttonGroup={{
        actions: [
          <LinkButton
            key="info"
            to={formatMessage(em.infoButtonUrl)}
            text={formatMessage(em.infoButtonLabel)}
            icon="open"
            variant="utility"
          />,
        ],
      }}
    >
      <Box marginBottom={3}>
        <GridRow>
          <GridColumn span={['12/12', '6/12', '4/12']}>
            <Input
              icon={{ name: 'search' }}
              backgroundColor="blue"
              size="xs"
              label={formatMessage(em.searchPlaceholder)}
              placeholder={formatMessage(em.searchPlaceholder)}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              name="estates-search"
            />
          </GridColumn>
          <GridColumn span={['12/12', '6/12', '4/12']}>
            <Box display="flex" alignItems="center" height="full" paddingTop={1}>
              <Checkbox
                label={formatMessage(em.showFinished)}
                checked={showFinished}
                onChange={(e) => setShowFinished(e.target.checked)}
                id="show-finished"
              />
            </Box>
          </GridColumn>
        </GridRow>
      </Box>

      {loading && (
        <Box width="full">
          <CardLoader />
        </Box>
      )}

      {error && !loading && <Problem error={error} noBorder={false} />}

      {!loading && !error && filtered.length === 0 && (
        <Problem
          type="no_data"
          title={formatMessage(em.noEstatesFound)}
          message={formatMessage(m.noDataFoundDetail)}
          imgSrc="./assets/images/movingTruck.svg"
          titleSize="h3"
          noBorder={false}
        />
      )}

      <Stack space={4}>
        {!error &&
          filtered.map((estate) => (
            <ActionCard
              key={estate.id}
              heading={estate.deceasedName}
              headingVariant="h4"
              text={`${formatMessage(em.caseNumber)}: ${estate.caseNumber}`}
              tag={{
                label: formatMessage(
                  estate.isFinished ? em.statusFinished : em.statusInProgress,
                ),
                variant: estate.isFinished ? 'mint' : 'blue',
                outlined: true,
              }}
              cta={{
                label: formatMessage(em.view),
                variant: 'text',
                onClick: () =>
                  navigate(
                    EstatesPaths.EstatesDetail.replace(':id', estate.id),
                  ),
              }}
            />
          ))}
      </Stack>
    </IntroWrapper>
  )
}

export default EstatesOverview
