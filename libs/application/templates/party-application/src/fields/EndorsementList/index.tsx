import React, { FC, useState, useMemo } from 'react'
import { FieldBaseProps } from '@island.is/application/core'
import {
  Box,
  Text,
  Input,
  Checkbox,
  Pagination,
} from '@island.is/island-ui/core'
import sortBy from 'lodash/sortBy'
import { CopyLink } from '@island.is/application/ui-components'
import EndorsementTable from '../EndorsementTable'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import BulkUpload from '../BulkUpload'
import { Endorsement } from '../../types/schema'
import { useEndorsements } from '../../hooks/fetch-endorsements'
import { useIsClosed } from '../../hooks/useIsEndorsementClosed'
import { paginate, totalPages as findTotalPages } from '../components/utils'
import { constituencyMapper, EndorsementListTags } from '../../constants'

const EndorsementList: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()
  const endorsementListId = (application.externalData?.createEndorsementList
    .data as any).id
  const [searchTerm, setSearchTerm] = useState('')
  const [showOnlyInvalidated, setShowOnlyInvalidated] = useState(false)
  const isClosedHook = useIsClosed(endorsementListId)
  const [page, setPage] = useState(1)
  const { endorsements: endorsementsHook = [], refetch } = useEndorsements(
    endorsementListId,
    true,
  )

  const minEndorsements =
    constituencyMapper[application.answers.constituency as EndorsementListTags]
      .parliamentary_seats * 30

  const maxEndorsements =
    constituencyMapper[application.answers.constituency as EndorsementListTags]
      .parliamentary_seats * 40

  const constituency =
    constituencyMapper[application.answers.constituency as EndorsementListTags]

  const voterRegionMismatch = (region: number) => {
    return region !== constituency.region_number
  }

  const [endorsements, pages] = useMemo<[Endorsement[], number]>(() => {
    const fiteredEndorsements = endorsementsHook.filter(
      (endorsement) =>
        (searchTerm === '' ||
          endorsement.meta.fullName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())) &&
        voterRegionMismatch(endorsement.meta.voterRegion),
    )
    const sortedEndorsements = sortBy(fiteredEndorsements, 'created')
    return [
      paginate(sortedEndorsements, 10, page) ?? [],
      findTotalPages(sortedEndorsements?.length),
    ]
  }, [endorsementsHook, searchTerm, showOnlyInvalidated, page])

  return (
    <Box marginBottom={8}>
      <CopyLink
        linkUrl={window.location.href}
        buttonTitle={formatMessage(m.endorsementList.copyLinkButton)}
      />
      <Box marginTop={4} display="flex" alignItems="baseline">
        <Text variant="h2">{endorsementsHook.length}</Text>
        <Box marginLeft={1}>
          <Text variant="default">
            {formatMessage(m.endorsementList.namesCount)}
          </Text>
        </Box>
      </Box>
      <Text variant="small" color="dark300">
        {'Leyfilegur fjöldi meðmæla í ' +
          constituency.region_name +
          ' er á bilinu ' +
          minEndorsements +
          '-' +
          maxEndorsements}
      </Text>
      <Box marginTop={4}>
        <Box
          display="flex"
          justifyContent="spaceBetween"
          alignItems="center"
          marginBottom={3}
        >
          <Checkbox
            label={formatMessage(m.endorsementList.invalidSignatures)}
            checked={showOnlyInvalidated}
            onChange={() => {
              setShowOnlyInvalidated(!showOnlyInvalidated)
            }}
          />

          <Input
            name="searchbar"
            placeholder={formatMessage(m.endorsementList.searchbar)}
            icon="search"
            backgroundColor="blue"
            size="sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Box>
        <Box marginY={3}>
          <EndorsementTable
            application={application}
            endorsements={endorsements}
          />
        </Box>
        {!!endorsementsHook.length && (
          <Box marginY={3}>
            <Pagination
              page={page}
              totalPages={pages}
              renderLink={(page, className, children) => (
                <Box
                  cursor="pointer"
                  className={className}
                  onClick={() => {
                    setPage(page)
                  }}
                >
                  {children}
                </Box>
              )}
            />
          </Box>
        )}
        {!isClosedHook ? (
          <Box marginY={5}>
            <BulkUpload
              application={application}
              onSuccess={() => {
                refetch()
              }}
            />
          </Box>
        ) : (
          <Text variant="eyebrow" color="red400" marginTop={5}>
            {formatMessage(m.endorsementList.isClosedMessage)}
          </Text>
        )}
      </Box>
    </Box>
  )
}

export default EndorsementList
