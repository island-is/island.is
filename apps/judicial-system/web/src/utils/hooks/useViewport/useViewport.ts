import React from 'react'

import {
  ViewportContext,
  Rect,
} from '@island.is/judicial-system-web/src/components/ViewportProvider/ViewportProvider'

export const useViewport = (): Rect => React.useContext<Rect>(ViewportContext)

export default useViewport
