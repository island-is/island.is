import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDebounce } from 'react-use'

import {
  ActionCard,
  Box,
  Input,
  Stack,
  Text,
  ToggleSwitchCheckbox,
  VisuallyHidden,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  CardLoader,
  IntroWrapper,
  LinkButton,
  m,
  SYSLUMENN_SLUG,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'

import { estatesMessages as em } from '../../lib/messages'
import { EstatesPaths } from '../../lib/paths'
import { useEstatesOverviewQuery } from './EstatesOverview.generated'
import * as styles from './EstatesOverview.css'

export const EstatesOverview = () => {
  useNamespaces('sp.estates')
  const { formatMessage } = useLocale()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [showFinished, setShowFinished] = useState(false)
  const [announcement, setAnnouncement] = useState('')
  const searchTouched = useRef(false)

  const { data, loading, error } = useEstatesOverviewQuery()

  const estates = data?.estates?.data ?? []
  const filterEstates = (includeFinished: boolean) =>
    estates.filter((e) => {
      if (!includeFinished && e.isFinished) return false
      if (
        search &&
        !e.nameOfDeceased.toLowerCase().includes(search.toLowerCase())
      )
        return false
      return true
    })
  const filtered = filterEstates(showFinished)

  const announceCount = (count: number) =>
    setAnnouncement(formatMessage(em.resultCount, { count }))

  useDebounce(
    () => {
      if (searchTouched.current) {
        announceCount(filtered.length)
      }
    },
    500,
    [search],
  )

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
          onChange={(e) => {
            searchTouched.current = true
            setSearch(e.target.value)
          }}
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
          onChange={(checked) => {
            setShowFinished(checked)
            announceCount(filterEstates(checked).length)
          }}
        />
      </Box>
      <VisuallyHidden>
        <span role="status">{announcement}</span>
      </VisuallyHidden>
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
              text={`${formatMessage(em.caseNumber)} ${estate.id}`}
              tag={{
                label: formatMessage(
                  estate.isFinished ? em.statusFinished : em.statusInProgress,
                ),
                variant: estate.isFinished ? 'mint' : 'blue',
                outlined: true,
              }}
              cta={{
                label: formatMessage(em.view),
                ariaLabel: `${formatMessage(em.view)}: ${
                  estate.nameOfDeceased
                }`,
                variant: 'text',
                icon: 'arrowForward',
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
