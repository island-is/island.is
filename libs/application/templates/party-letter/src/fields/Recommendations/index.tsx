import React, { FC, useState } from 'react'
import { FieldBaseProps } from '@island.is/application/core'
import { Box, Text, Input, Checkbox } from '@island.is/island-ui/core'
import CopyLink from './CopyLink'
import RecommendationTable from './RecommendationTable'

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

const Recommendations: FC<FieldBaseProps> = ({ application }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [signatures, setSignatures] = useState(SIGNATURES)
  const [showWarning, setShowWarning] = useState(false)

  return (
    <Box marginBottom={8}>
      <CopyLink
        linkUrl="www.island.is/listabókstafur/128877634/"
        fieldDescription="Hér er hlekkur til að senda út á fólk"
      />
      <Text variant="h3">{`${SIGNATURES.length} nöfn á lista (300)`}</Text>
      <Box marginTop={2}>
        <Box
          display="flex"
          justifyContent="spaceBetween"
          alignItems="center"
          marginBottom={3}
        >
          <Checkbox
            label="Sjá einungis vafaatkvæði"
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
            name="flightLeg.from"
            placeholder="Leitaðu hér"
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
          <RecommendationTable
            application={application}
            signatures={signatures}
          />
        )}
      </Box>
    </Box>
  )
}

export default Recommendations
