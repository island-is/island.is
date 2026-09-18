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
  Input,
  Stack,
  Text,
  ToggleSwitchCheckbox,
} from '@island.is/island-ui/core'
import { Problem } from '@island.is/react-spa/shared'
import { useNavigate } from 'react-router-dom'
import { EstatesPaths } from '../../lib/paths'

import { useEstatesOverviewQuery } from './EstatesOverview.generated'
import * as styles from './EstatesOverview.css'

export const EstatesOverview = () => {
  useNamespaces('sp.estates')
  const { formatMessage } = useLocale()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [showFinished, setShowFinished] = useState(false)

  const { data, loading, error } = useEstatesOverviewQuery()

  const estates = data?.estates?.data ?? []
  const filtered = estates.filter((e) => {
    if (!showFinished && e.isFinished) return false
    if (
      search &&
      !e.nameOfDeceased.toLowerCase().includes(search.toLowerCase())
    )
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
      <Box
        marginBottom={3}
        display="flex"
        alignItems="flexEnd"
        justifyContent="spaceBetween"
      >
        <Input
          icon={{ name: 'search' }}
          backgroundColor="blue"
          size="xs"
          label={formatMessage(m.searchLabel)}
          placeholder={formatMessage(em.searchPlaceholder)}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          name="estates-search"
        />
        <ToggleSwitchCheckbox
          className={styles.toggleSwitch}
          label={
            <Text as="span" variant="medium">
              {formatMessage(em.showFinished)}
            </Text>
          }
          checked={showFinished}
          onChange={setShowFinished}
        />
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
      <Stack space={2}>
        {!error &&
          filtered.map((estate) => (
            <ActionCard
              key={estate.id}
              heading={estate.nameOfDeceased}
              headingVariant="h4"
              text={`${formatMessage(em.caseNumber)}: ${estate.id}`}
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
