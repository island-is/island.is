import React, { FC, useState } from 'react'
import { FieldBaseProps } from '@island.is/application/core'
import { Box, Text, Input, Checkbox } from '@island.is/island-ui/core'
import { CopyLink } from '@island.is/application/ui-components'
import EndorsementTable from './EndorsementTable'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'

const SIGNATURES = [
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
  const [signatures, setSignatures] = useState(SIGNATURES)
  const [showWarning, setShowWarning] = useState(false)

  const namesCountString = formatMessage(
    SIGNATURES.length > 1
      ? formatMessage(m.endorsementList.namesCount)
      : formatMessage(m.endorsementList.nameCount),
  )

  return (
    <Box marginBottom={8}>
      <CopyLink
        linkUrl="www.island.is/listabókstafur/128877634/"
        buttonTitle={formatMessage(m.endorsementList.copyLinkButton)}
      />
      <Text
        variant="h3"
        marginTop={8}
      >{`${SIGNATURES.length} ${namesCountString}`}</Text>
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
                ? setSignatures(SIGNATURES)
                : setSignatures(signatures.filter((x) => x.hasWarning))
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
              setSignatures(
                SIGNATURES.filter((x) => x.name.startsWith(e.target.value)),
              )
            }}
          />
        </Box>
        {signatures && signatures.length > 0 && (
          <EndorsementTable application={application} signatures={signatures} />
        )}
      </Box>
    </Box>
  )
}

export default EndorsementList
