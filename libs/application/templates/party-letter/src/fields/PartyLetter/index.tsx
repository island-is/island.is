import React, { FC } from 'react'
import { FieldBaseProps } from '@island.is/application/core'
import {
  Box,
  Text,
  GridRow,
  GridColumn,
  Stack,
} from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'

export const ACTIVE_PARTIES: { letter: string; name: string }[] = [
  { letter: 'A', name: 'Björt framtíð' },
  { letter: 'B', name: 'Framsóknarflokkur' },
  { letter: 'C', name: 'Viðreisn' },
  { letter: 'D', name: 'Sjálfstæðisflokkur' },
  { letter: 'F', name: 'Flokkur fólksins' },
  { letter: 'M', name: 'Miðflokkurinn' },
  { letter: 'P', name: 'Píratar' },
  { letter: 'R', name: 'Alþýðufylkingin' },
  {
    letter: 'S',
    name: 'Samfylkingin – jafnaðarmannaflokkur Íslands',
  },
  {
    letter: 'T',
    name: 'Dögun – stjórnmálasamtök um réttlæti, sanngirni og lýðræði',
  },
  { letter: 'V', name: 'Vinstrihreyfingin – grænt framboð' },
]

const PartyLetter: FC<FieldBaseProps> = () => {
  const { formatMessage } = useLocale()

  const first = ACTIVE_PARTIES.slice(0, Math.ceil(ACTIVE_PARTIES.length / 2))
  const second = ACTIVE_PARTIES.slice(Math.ceil(ACTIVE_PARTIES.length / 2) + 1)

  const renderPartyList = (list: { letter: string; name: string }[]) => (
    <Stack space={1}>
      {list.map((party) => {
        return (
          <Text variant="small" key={party.letter}>
            <strong>{`${party.letter}-listi: `}</strong> {party.name}
          </Text>
        )
      })}
    </Stack>
  )

  return (
    <Box marginTop={4}>
      <Text variant="h5" marginBottom={3} marginTop={5}>
        {formatMessage(m.selectPartyLetter.partyLetterSubtitle)}
      </Text>
      <GridRow>
        <GridColumn span={['12/12', '6/12']}>
          {renderPartyList(first)}
        </GridColumn>
        <GridColumn span={['12/12', '6/12']}>
          {renderPartyList(second)}
        </GridColumn>
      </GridRow>
    </Box>
  )
}

export default PartyLetter
