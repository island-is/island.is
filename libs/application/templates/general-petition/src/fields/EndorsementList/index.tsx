import React, { FC, useState, useEffect } from 'react'
import { FieldBaseProps } from '@island.is/application/core'
import { Box, Text, Input, Pagination } from '@island.is/island-ui/core'
import { CopyLink } from '@island.is/application/ui-components'
import EndorsementTable from './EndorsementTable'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { useEndorsements } from '../../hooks/useFetchEndorsements'
import { useIsClosed } from '../../hooks/useIsEndorsementClosed'
import { Endorsement } from '../../types/schema'
import BulkUpload from '../bulkUpload'
import orderBy from 'lodash/orderBy'
import { paginate, totalPages as pages } from '../components/utils'

const EndorsementList: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()
  const endorsementListId = (application.externalData?.createEndorsementList
    .data as any).id
  const [searchTerm, setSearchTerm] = useState('')
  const [endorsements, setEndorsements] = useState<Endorsement[] | undefined>()
  const [filteredEndorsements, setFilteredEndorsements] = useState<
    Endorsement[] | undefined
  >()
  const [updateOnBulkImport, setUpdateOnBulkImport] = useState(false)
  const { endorsements: endorsementsHook, refetch } = useEndorsements(
    endorsementListId,
    true,
  )
  const isClosedHook = useIsClosed(endorsementListId)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)

  useEffect(() => {
    refetch()
    setEndorsements(orderBy(endorsementsHook, 'created', 'desc'))
  }, [endorsementsHook, updateOnBulkImport])

  useEffect(() => {
    filter(searchTerm)
  }, [endorsementsHook, searchTerm])

  const filter = (searchTerm: string) => {
    if (searchTerm !== '') {
      const filterBySearch = endorsementsHook?.filter((x) =>
        x.meta.fullName?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      handlePagination(1, filterBySearch)
    } else handlePagination(1, endorsementsHook)
  }

  const handlePagination = (
    page: number,
    endorsements: Endorsement[] | undefined,
  ) => {
    const sortEndorements = orderBy(endorsements, 'created', 'desc')
    setPage(page)
    setTotalPages(pages(endorsements?.length))
    setFilteredEndorsements(sortEndorements)
    setEndorsements(paginate(sortEndorements, 10, page))
  }

  return (
    <Box marginBottom={8}>
      <Text marginBottom={3}>
        {formatMessage(m.endorsementList.linkDescription)}
      </Text>
      <CopyLink
        linkUrl={window.location.href}
        buttonTitle={formatMessage(m.endorsementList.copyLinkButton)}
      />
      <Box marginTop={4}>
        <Box
          display="flex"
          justifyContent="spaceBetween"
          alignItems="center"
          marginBottom={3}
        >
          <Box display="flex" alignItems="baseline">
            <Text variant="h2">
              {endorsementsHook && endorsementsHook.length > 0
                ? endorsementsHook.length
                : 0}
            </Text>
            <Box marginLeft={1}>
              <Text variant="default">
                {formatMessage(m.endorsementList.namesCount)}
              </Text>
            </Box>
          </Box>
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
        <EndorsementTable
          application={application}
          endorsements={endorsements}
        />
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
                setUpdateOnBulkImport(true)
              }}
            />
          </Box>
        ) : (
          <Text variant="eyebrow" color="red400" marginTop={5}>
            {formatMessage(m.endorsementForm.isClosedMessage)}
          </Text>
        )}
      </Box>
    </Box>
  )
}

export default EndorsementList
