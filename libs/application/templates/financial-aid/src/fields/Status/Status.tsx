import React from 'react'

import { FAFieldBaseProps } from '../../lib/types'
import MoreActions from './MoreActions'

const Status = ({ application }: FAFieldBaseProps) => {
  const { nationalRegistry } = application.externalData

  return (
    <>
      <MoreActions
        rulesPage={nationalRegistry?.data.municipality?.rulesHomepage}
        email={nationalRegistry?.data.municipality?.email}
      />
    </>
  )
}

export default Status
