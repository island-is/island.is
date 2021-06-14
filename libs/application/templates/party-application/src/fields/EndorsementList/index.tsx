import React, { FC, useState, useEffect } from 'react'
import { FieldBaseProps } from '@island.is/application/core'
import { Box, Text, Input, Checkbox } from '@island.is/island-ui/core'
import { CopyLink } from '@island.is/application/ui-components'
import EndorsementTable from './EndorsementTable'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import BulkUpload from '../BulkUpload'
import { Endorsement } from '../../types/schema'
import { useEndorsements } from '../../hooks/fetch-endorsements'

const EndorsementList: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()
  const endorsementListId = (application.externalData?.createEndorsementList
    .data as any).id
  const [searchTerm, setSearchTerm] = useState('')
  const [endorsements, setEndorsements] = useState<Endorsement[] | undefined>()
  const [showWarning, setShowWarning] = useState(false)
  const [updateOnBulkImport, setUpdateOnBulkImport] = useState(false)
  const { endorsements: endorsementsHook, refetch } = useEndorsements(
    endorsementListId,
    true,
  )

  useEffect(() => {
    refetch()
    setEndorsements(endorsementsHook)
  }, [endorsementsHook, updateOnBulkImport])

  const namesCountString = formatMessage(
    endorsements && endorsements.length > 1
      ? m.endorsementList.namesCount
      : m.endorsementList.nameCount,
  )

  return (
    <Box marginBottom={8}>
      <CopyLink
        linkUrl={window.location.href}
        buttonTitle={formatMessage(m.endorsementList.copyLinkButton)}
      />
      <Text variant="h3">{`${
        endorsements && endorsements.length > 0 ? endorsements.length : 0
      } ${namesCountString}`}</Text>
      <Box marginTop={2}>
        <Box
          display="flex"
          justifyContent="spaceBetween"
          alignItems="center"
          marginBottom={3}
        >
          <Checkbox
            label={formatMessage(m.endorsementList.invalidSignatures)}
            checked={showWarning}
            onChange={() => {
              setShowWarning(!showWarning)
              setSearchTerm('')
              showWarning
                ? setEndorsements(endorsements)
                : setEndorsements(
                    endorsements
                      ? endorsements.filter((x) => {
                          x.meta.invalidated
                        })
                      : endorsements,
                  )
            }}
          />

          <Input
            name="searchbar"
            placeholder={formatMessage(m.endorsementList.searchbar)}
            icon="search"
            backgroundColor="blue"
            size="sm"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setEndorsements(
                endorsements && endorsements.length > 0
                  ? endorsements.filter((x) =>
                      (x.meta.fullName ?? '').startsWith(e.target.value),
                    )
                  : endorsements,
              )
            }}
          />
        </Box>
        {endorsements && endorsements.length > 0 && (
          <Box marginY={3}>
            <EndorsementTable
              application={application}
              endorsements={endorsements}
            />
          </Box>
        )}
        <Box marginY={5}>
          <BulkUpload
            application={application}
            onSuccess={() => {
              setUpdateOnBulkImport(true)
            }}
          />
        </Box>
      </Box>
    </Box>
  )
}

export default EndorsementList
