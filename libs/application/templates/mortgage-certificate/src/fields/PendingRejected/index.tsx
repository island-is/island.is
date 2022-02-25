import React, { FC } from 'react'
import { FieldBaseProps } from '@island.is/application/core'

export const PendingRejected: FC<FieldBaseProps> = ({ application }) => {
  const { externalData } = application

  console.log(application)

  return <h2>Pending rejected</h2>
}
