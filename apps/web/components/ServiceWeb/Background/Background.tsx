import React, { ReactNode, useEffect, useState } from 'react'
import cn from 'classnames'
import dynamic from 'next/dynamic'
import { Hidden } from '@island.is/island-ui/core'
import { BackgroundProps } from '../types'

import * as styles from './Background.css'

const Default = dynamic(() => import('./Variations/Default/Default'), {
  ssr: false,
})

const Syslumenn = dynamic(() => import('./Variations/Syslumenn/Syslumenn'), {
  ssr: false,
})

const StafraentIsland = dynamic(
  () => import('./Variations/StafraentIsland/StafraentIsland'),
  {
    ssr: false,
  },
)

const Mannaudstorg = dynamic(
  () => import('./Variations/Mannaudstorg/Mannaudstorg'),
  {
    ssr: false,
  },
)

const Sjukratryggingar = dynamic(
  () => import('./Variations/Sjukratryggingar/Sjukratryggingar'),
  { ssr: false },
)

const Utlendingastofnun = dynamic(
  () => import('./Variations/Utlendingastofnun/Utlendingastofnun'),
  { ssr: false },
)

export const Background = ({
  variation,
  small,
  namespace,
}: BackgroundProps) => {
  const [component, setComponent] = useState<ReactNode | null>(null)

  useEffect(() => {
    switch (variation) {
      case 'syslumenn':
      case 'district-commissioner':
        setComponent(<Syslumenn small={small} />)
        break
      case 'stafraent-island':
      case 'digital-iceland':
        setComponent(<StafraentIsland small={small} />)
        break
      case 'mannaudstorg':
        setComponent(<Mannaudstorg namespace={namespace} />)
        break
      case 'sjukratryggingar':
      case 'icelandic-health-insurance':
        setComponent(<Sjukratryggingar namespace={namespace} />)
        break
      case 'utlendingastofnun':
      case 'directorate-of-immigration':
        setComponent(<Utlendingastofnun namespace={namespace} />)
        break
      case 'default':
      default:
        setComponent(<Default />)
        break
    }
  }, [small, variation, namespace])

  return (
    <Hidden print={true}>
      <div className={cn(styles.bg, { [styles.bgSmall]: small })}>
        {component}
      </div>
    </Hidden>
  )
}

export default Background
