import React from 'react'

import { User } from '@island.is/judicial-system/types'
import ProsecutorSectionHeading from './ProsecutorSectionHeading'
import ProsecutorSelection from './ProsecutorSelection'

interface Props {
  onChange: (prosecutor: User) => boolean
}

const ProsecutorSection: React.FC<Props> = (props) => {
  const { onChange } = props

  return (
    <>
      <ProsecutorSectionHeading />
      <ProsecutorSelection onChange={onChange} />
    </>
  )
}

export default ProsecutorSection
