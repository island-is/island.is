import React, { FC } from 'react'
import { FieldBaseProps } from '@island.is/application/core'
import { Text } from '@island.is/island-ui/core'

const SignatureDisclaimer: FC<FieldBaseProps> = () => {
  return (
    <Text>
      Vegna alþingiskosninga 25. september 2021, lýsi ég undirritaður kjósandi í
      Suðurkjördæmi hér með yfir stuðningi við lista:{' '}
      <strong>Q-listi: Demókrataflokkurinn</strong>
    </Text>
  )
}

export default SignatureDisclaimer
