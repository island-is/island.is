import React, { FC, useState, useEffect } from 'react'
import { FieldBaseProps } from '@island.is/application/core'
import {
  Box,
  Text,
  Input,
  Checkbox,
  Pagination,
} from '@island.is/island-ui/core'
import { CopyLink } from '@island.is/application/ui-components'
import EndorsementTable from '../EndorsementTable'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import BulkUpload from '../BulkUpload'
import { Endorsement } from '../../types/schema'
import { useEndorsements } from '../../hooks/fetch-endorsements'
import { useIsClosed } from '../../hooks/useIsEndorsementClosed'
import sortBy from 'lodash/sortBy'
import { paginate, totalPages as pages } from '../components/utils'
import { constituencyMapper, EndorsementListTags } from '../../constants'

const EndorsementList: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()
  const endorsementListId = (application.externalData?.createEndorsementList
    .data as any).id
  const [searchTerm, setSearchTerm] = useState('')

  const [endorsements, setEndorsements] = useState<Endorsement[] | undefined>()
  const [filteredEndorsements, setFilteredEndorsements] = useState<
    Endorsement[] | undefined
  >()
  const [showOnlyInvalidated, setShowOnlyInvalidated] = useState(false)
  const isClosedHook = useIsClosed(endorsementListId)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const { endorsements: endorsementsHook, refetch } = useEndorsements(
    endorsementListId,
    true,
  )

  const minEndorsements =
    constituencyMapper[application.answers.constituency as EndorsementListTags]
      .parliamentary_seats * 30

  const maxEndorsements =
    constituencyMapper[application.answers.constituency as EndorsementListTags]
      .parliamentary_seats * 40

  const namesCountString = formatMessage(
    endorsements && endorsements.length > 1
      ? m.endorsementList.namesCount
      : m.endorsementList.nameCount,
  )

  useEffect(() => {
    filter(searchTerm, showOnlyInvalidated)
  }, [endorsementsHook, searchTerm, showOnlyInvalidated])

  const constituency =
    constituencyMapper[application.answers.constituency as EndorsementListTags]

  const voterRegionMismatch = (region: number) => {
    return region !== constituency.region_number
  }

  const filter = (searchTerm: string, showInvalidated: boolean) => {
    //filter by both search and invalidated
    if (searchTerm !== '' && showInvalidated) {
      const filterByBoth = endorsementsHook?.filter(
        (x) =>
          searchTerm !== '' &&
          x.meta.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) &&
          voterRegionMismatch(x.meta.voterRegion),
      )
      handlePagination(1, filterByBoth)
    }
    //filter by invalidated
    else if (searchTerm === '' && showInvalidated) {
      const filterByInvalidated = endorsementsHook?.filter((x) =>
        voterRegionMismatch(x.meta.voterRegion),
      )
      handlePagination(1, filterByInvalidated)

      //filter by search
    } else if (!!searchTerm.length && !showInvalidated) {
      const filterBySearch = endorsementsHook?.filter(
        (x) =>
          searchTerm !== '' &&
          x.meta.fullName?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      handlePagination(1, filterBySearch)
    } else handlePagination(1, endorsementsHook)
  }

  const handlePagination = (
    page: number,
    endorsements: Endorsement[] | undefined,
  ) => {
    const sortEndorements = sortBy(endorsements, 'created')
    setPage(page)
    setTotalPages(pages(endorsements?.length))
    setFilteredEndorsements(sortEndorements)
    setEndorsements(paginate(sortEndorements, 10, page))
  }

  return (
    <Box marginBottom={8}>
      <CopyLink
        linkUrl={window.location.href}
        buttonTitle={formatMessage(m.endorsementList.copyLinkButton)}
      />
      <Box marginTop={4} display="flex" alignItems="baseline">
        <Text variant="h2">
          {endorsementsHook && endorsementsHook.length > 0
            ? endorsementsHook.length
            : 0}
        </Text>
        <Box marginLeft={1}>
          <Text variant="default">{namesCountString}</Text>
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
        {!!endorsementsHook?.length && (
          <Box marginY={3}>
            <Pagination
              page={page}
              totalPages={totalPages}
              renderLink={(page, className, children) => (
                <Box
                  cursor="pointer"
                  className={className}
                  onClick={() => handlePagination(page, filteredEndorsements)}
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
