import { useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDebounce } from 'react-use'

import {
  ActionCard,
  Box,
  GridColumn,
  GridRow,
  Input,
  Stack,
  VisuallyHidden,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  CardLoader,
  formatDateOnly,
  IntroWrapper,
  LinkButton,
  m,
  SYSLUMENN_SLUG,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'

import { estatesMessages as em } from '../../lib/messages'
import { useEstateFilesQuery } from './EstateFiles.generated'

export const EstateFiles = () => {
  useNamespaces('sp.estates')
  const { formatMessage } = useLocale()
  const { id } = useParams<{ id: string }>()
  const [search, setSearch] = useState('')
  const [announcement, setAnnouncement] = useState('')
  const searchTouched = useRef(false)

  const { data, loading, error } = useEstateFilesQuery({
    variables: { input: { caseId: id ?? '' } },
    skip: !id,
  })

  const documents = data?.estate?.documents ?? []
  const filtered = documents.filter((d) =>
    search ? d.name?.toLowerCase().includes(search.toLowerCase()) : true,
  )

  useDebounce(
    () => {
      if (searchTouched.current) {
        setAnnouncement(
          formatMessage(em.resultCount, { count: filtered.length }),
        )
      }
    },
    500,
    [search],
  )

  return (
    <IntroWrapper
      title={m.estatesFiles}
      intro={em.filesIntro}
      serviceProvider={{
        slug: SYSLUMENN_SLUG,
        tooltip: formatMessage(m.estatesTooltip),
      }}
      buttonGroup={{
        actions: [
          <LinkButton
            key="submit"
            to={formatMessage(em.filesButtonUrl)}
            text={formatMessage(em.filesButtonLabel)}
            icon="open"
            variant="utility"
          />,
        ],
      }}
    >
      {/* TODO: add "Opna síu" availability filter once agreed on */}
      <Box marginBottom={2}>
        <GridRow>
          <GridColumn span={['12/12', '6/12', '4/12']}>
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
              name="estate-files-search"
            />
          </GridColumn>
        </GridRow>
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
          title={formatMessage(em.noFilesFound)}
          message={formatMessage(m.noDataFoundDetail)}
          imgSrc="./assets/images/movingTruck.svg"
          titleSize="h3"
          noBorder={false}
        />
      )}

      {!loading && !error && filtered.length > 0 && (
        <Stack space={3}>
          {filtered.map((doc, i) => {
            const url = doc.requestAction?.url
            const label = doc.requestAction?.label ?? ''
            return (
              <ActionCard
                key={doc.islandIsDocumentId ?? i}
                heading={doc.name ?? ''}
                text={
                  doc.documentDate
                    ? formatDateOnly(doc.documentDate)
                    : undefined
                }
                tag={
                  doc.availability
                    ? // TODO: map availability to tag variant once the values are known (Vantar red, Beðið yellow, Móttekið mint)
                      {
                        label: doc.availability,
                        variant: 'blue',
                        outlined: true,
                      }
                    : undefined
                }
                cta={
                  url
                    ? {
                        label,
                        ariaLabel: `${label}: ${doc.name ?? ''}`,
                        variant: 'text',
                        icon: 'arrowForward',
                        onClick: () =>
                          window.open(url, '_blank', 'noopener,noreferrer'),
                      }
                    : undefined
                }
              />
            )
          })}
        </Stack>
      )}
    </IntroWrapper>
  )
}

export default EstateFiles
