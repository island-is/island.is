import React, { FC } from 'react'
import { FieldBaseProps } from '@island.is/application/core'
import { m } from '../../forms/messages'
import InfoScreen from '../components/InfoScreen'

const TestPhaseInfoScreen: FC<FieldBaseProps> = ({ field, application }) => {
  return <InfoScreen message={m.testPhaseInfoScreenMessage.defaultMessage} />
}

export default TestPhaseInfoScreen
