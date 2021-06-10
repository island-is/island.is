import React, { FC, useState, useEffect } from 'react'
import { FieldBaseProps } from '@island.is/application/core'
import { Box, Text, Input, Checkbox } from '@island.is/island-ui/core'
import { CopyLink } from '@island.is/application/ui-components'
import EndorsementTable from './EndorsementTable'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { useEndorsements } from '../../hooks/useFetchEndorsements'
import { useIsClosed } from '../../hooks/useIsEndorsementClosed'
import { Endorsement } from '../../types/schema'

const EndorsementList: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()
  const endorsementListId = (application.externalData?.createEndorsementList
    .data as any).id
  const [searchTerm, setSearchTerm] = useState('')
  const [endorsements, setEndorsements] = useState<Endorsement[] | undefined>()
  const [showWarning, setShowWarning] = useState(false)
  const endorsementsHook = useEndorsements(endorsementListId, true)
  const isClosedHook = useIsClosed(endorsementListId)

  useEffect(() => {
    setEndorsements(endorsementsHook)
  }, [endorsementsHook])

  const namesCountString = formatMessage(
    endorsementsHook && endorsementsHook.length > 1
      ? m.endorsementList.namesCount
      : m.endorsementList.nameCount,
    { endorsementCount: endorsementsHook?.length ?? 0 },
  )

  return (
    <Box marginBottom={8}>
      <Text marginBottom={3}>
        {formatMessage(m.endorsementList.linkDescription)}
      </Text>
      <CopyLink
        linkUrl={window.location.href}
        buttonTitle={formatMessage(m.endorsementList.copyLinkButton)}
      />
      <Text variant="h3" marginBottom={2} marginTop={5}>
        {`${namesCountString}`}
      </Text>
      <Box marginTop={2}>
        <Box
          display="flex"
          justifyContent="spaceBetween"
          alignItems="center"
          marginBottom={3}
        >
          <Checkbox
            label={formatMessage(m.endorsementList.invalidEndorsements)}
            checked={showWarning}
            onChange={() => {
              setShowWarning(!showWarning)
              setSearchTerm('')
              showWarning
                ? setEndorsements(endorsementsHook)
                : setEndorsements(
                    endorsementsHook
                      ? endorsementsHook.filter((x) => x.meta.invalidated)
                      : endorsementsHook,
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
                endorsementsHook
                  ? endorsementsHook.filter(
                      (x) => x.meta?.fullName?.startsWith(e.target.value) ?? '',
                    )
                  : endorsementsHook,
              )
            }}
          />
        </Box>
        <EndorsementTable
          application={application}
          endorsements={endorsements}
        />
        {/* TODO: Laga þegar bulk er komið inn */}
        {isClosedHook && <Text>ER LOKAÐ GETUR EKKI SETT INN EXCEL!!</Text>}
      </Box>
    </Box>
  )
}

export default EndorsementList
