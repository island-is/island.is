import React, { FC } from 'react'
import { FieldBaseProps, getValueViaPath } from '@island.is/application/core'
import {
  Box,
  Text,
  GridRow,
  GridColumn,
  Inline,
  Stack,
} from '@island.is/island-ui/core'
import { InputController } from '@island.is/shared/form-fields'
import { useFormContext } from 'react-hook-form'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'

const ACTIVE_PARTIES = [
  { partyLetter: 'A-listi', partyName: 'Björt framtíð' },
  { partyLetter: 'B-listi', partyName: 'Framsóknarflokkur' },
  { partyLetter: 'C-listi', partyName: 'Viðreisn' },
  { partyLetter: 'D-listi', partyName: 'Sjálfstæðisflokkur' },
  { partyLetter: 'F-listi', partyName: 'Flokkur fólksins' },
  { partyLetter: 'M-listi', partyName: 'Miðflokkurinn' },
  { partyLetter: 'P-listi', partyName: 'Píratar' },
  { partyLetter: 'R-listi', partyName: 'Alþýðufylkingin' },
  {
    partyLetter: 'S-listi',
    partyName: 'Samfylkingin – jafnaðarmannaflokkur Íslands',
  },
  {
    partyLetter: 'T-listi',
    partyName: 'Dögun – stjórnmálasamtök um réttlæti, sanngirni og lýðræði',
  },
  { partyLetter: 'V-listi', partyName: 'Vinstrihreyfingin – grænt framboð' },
]

const PARTYLETTER_ID = 'partyLetterInput'
const PARTYNAME_ID = 'patyNameInput'

export const partyLetterIds = [PARTYLETTER_ID, PARTYNAME_ID]

const PartyLetter: FC<FieldBaseProps> = ({ application }) => {
  const { setValue } = useFormContext()
  const { formatMessage } = useLocale()

  const first = ACTIVE_PARTIES.slice(0, Math.ceil(ACTIVE_PARTIES.length / 2))
  const second = ACTIVE_PARTIES.slice(Math.ceil(ACTIVE_PARTIES.length / 2) + 1)

  return (
    <Box marginTop={4}>
      <GridRow>
        <GridColumn span={['12/12', '6/12']}>
          <InputController
            id={PARTYLETTER_ID}
            label={formatMessage(m.selectPartyLetter.partyLetterLabel)}
            placeholder={formatMessage(
              m.selectPartyLetter.partyLetterPlaceholder,
            )}
            name={PARTYLETTER_ID}
            defaultValue={
              getValueViaPath(application.answers, PARTYLETTER_ID) as string
            }
            onChange={(e) => setValue(PARTYLETTER_ID, e.target.value)}
          />
        </GridColumn>
        <GridColumn span={['12/12', '6/12']}>
          <InputController
            id={PARTYNAME_ID}
            label={formatMessage(m.selectPartyLetter.partyNameLabel)}
            placeholder={formatMessage(
              m.selectPartyLetter.partyNamePlaceholder,
            )}
            name={PARTYNAME_ID}
            defaultValue={
              getValueViaPath(application.answers, PARTYNAME_ID) as string
            }
            onChange={(e) => setValue(PARTYNAME_ID, e.target.value)}
          />
        </GridColumn>
      </GridRow>
      <Box marginTop={5} marginBottom={3}>
        <Text variant="h5">
          {formatMessage(m.selectPartyLetter.partyLetterSubtitle)}
        </Text>
      </Box>
      <GridRow>
        <GridColumn span={['12/12', '6/12']}>
          <Stack space={2}>
            {first.map((x) => {
              return (
                <Inline space={1}>
                  <Text variant="small" fontWeight="semiBold">
                    {x.partyLetter}:
                  </Text>
                  <Text variant="small">{x.partyName}</Text>
                </Inline>
              )
            })}
          </Stack>
        </GridColumn>
        <GridColumn span={['12/12', '6/12']}>
          <Stack space={1}>
            {second.map((x) => {
              return (
                <Inline space={1}>
                  <Text variant="small" fontWeight="semiBold">
                    {x.partyLetter}:
                  </Text>
                  <Text variant="small">{x.partyName}</Text>
                </Inline>
              )
            })}
          </Stack>
        </GridColumn>
      </GridRow>
    </Box>
  )
}

export default PartyLetter
