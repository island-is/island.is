import React, { FC } from 'react'
import { FieldBaseProps } from '@island.is/application/core'
import { Box, Text, BulletList, Bullet } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  FieldDescription,
  RadioController,
} from '@island.is/shared/form-fields'

const PARTYLETTERS = ['A', 'B', 'C', 'X', 'H', 'I', 'O', 'P', 'Q', 'T', 'R']

const PartyLetter: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()
  return (
    <Box marginBottom={8}>
      <FieldDescription
        description={
          'Hér fyrir neðan getur þú valið listabókstaf sem þú óskar eftir'
        }
      />

      <Box marginTop={5} marginBottom={9}>
        <RadioController
          id={'additionalInfo.hasAdditionalInfo'}
          name={'additionalInfo.hasAdditionalInfo'}
          split={'1/5'}
          options={PARTYLETTERS.map((letter) => ({
            value: letter,
            label: letter,
          }))}
        />
      </Box>
      <Box marginBottom={1}>
        <Text variant="h4">Kröfur fyrir listabókstaf</Text>
      </Box>

      <BulletList>
        <Bullet>300 manns þarf á lista fyrir samþykki á listabókstaf</Bullet>
        <Bullet>Ekki má nota séríslenska stafi sem listabókstaf.</Bullet>
        <Bullet>Bókstafur telst valinn þegar 300 meðmælum er safnað</Bullet>
      </BulletList>
    </Box>
  )
}

export default PartyLetter
