import React, { FC } from 'react'
import { FieldBaseProps } from '@island.is/application/core'
import { ActionCard } from '@island.is/island-ui/core'

interface Props extends FieldBaseProps {
  name: string
  onClick: () => void
}

const ProfileButton: FC<Props> = ({ name, onClick }) => {
  return (
    <ActionCard
      heading="Persónukjör"
      text="Þarft að vera 35 til að verða forseti"
      cta={{ label: 'Hefja ársskýrsluskil', variant: 'text', onClick: onClick }}
    />
  )
}

export default ProfileButton
