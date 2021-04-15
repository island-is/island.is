import React, { FC, useState } from 'react'
import { FieldBaseProps } from '@island.is/application/core'
import { Box, Text, Input, Checkbox } from '@island.is/island-ui/core'
import { CopyLink } from '@island.is/application/ui-components'
import EndorsementTable from './EndorsementTable'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'

const ENDORSEMENTS = [
  {
    date: '21.01.2021',
    name: 'Örvar Þór Sigurðsson',
    nationalRegistry: '1991921335',
    address: 'Baugholt 15',
  },
  {
    date: '21.01.2021',
    name: 'Þórhildur Tyrfingsdóttir',
    nationalRegistry: '1991921335',
    address: 'Miðskógar 17',
  },
  {
    date: '21.01.2021',
    name: 'Stefán Haukdal',
    nationalRegistry: '1991921335',
    address: 'Skúr hjá mömmu',
    hasWarning: true,
  },
  {
    date: '21.01.2021',
    name: 'Brian Johannesen',
    nationalRegistry: '1991921335',
    address: 'Reykjavík',
  },
  {
    date: '21.01.2021',
    name: 'Örvar Þór Sigurðsson',
    nationalRegistry: '1991921335',
    address: 'Baugholt 15',
  },
  {
    date: '21.01.2021',
    name: 'Örvar Þór Sigurðsson',
    nationalRegistry: '1991921335',
    address: 'Baugholt 15',
    hasWarning: true,
  },
]

const EndorsementList: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()

  const [searchTerm, setSearchTerm] = useState('')
  const [endorsements, setEndorsements] = useState(ENDORSEMENTS)
  const [showWarning, setShowWarning] = useState(false)

  const namesCountString = formatMessage(
    ENDORSEMENTS.length > 1
      ? m.endorsementList.namesCount
      : m.endorsementList.nameCount,
  )

  return (
    <Box marginBottom={8}>
      <Text marginBottom={3}>
        {formatMessage(m.endorsementList.linkDescription)}
      </Text>
      <CopyLink
        linkUrl={window.location.origin + location.pathname}
        buttonTitle={formatMessage(m.endorsementList.copyLinkButton)}
      />
      <Text
        variant="h3"
        marginBottom={2}
        marginTop={5}
      >{`${ENDORSEMENTS.length} ${namesCountString}`}</Text>
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
                ? setEndorsements(ENDORSEMENTS)
                : setEndorsements(endorsements.filter((x) => x.hasWarning))
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
                ENDORSEMENTS.filter((x) => x.name.startsWith(e.target.value)),
              )
            }}
          />
        </Box>
        {endorsements && endorsements.length > 0 && (
          <EndorsementTable
            application={application}
            endorsements={endorsements}
          />
        )}
      </Box>
    </Box>
  )
}

export default EndorsementList
