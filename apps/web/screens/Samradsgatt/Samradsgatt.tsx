import React from 'react'
import { Screen } from '@island.is/web/types'
import { withMainLayout } from '@island.is/web/layouts/main'

interface SamradsgattProps {
  data?: string
}

export const Samradsgatt: Screen<SamradsgattProps> = () => {
  return <div>Hello World</div>
}

export default withMainLayout(Samradsgatt)
