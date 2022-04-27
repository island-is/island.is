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

export const Background = ({ variation, small }: BackgroundProps) => {
  const [component, setComponent] = useState<ReactNode | null>(null)

  useEffect(() => {
    switch (variation) {
      case 'syslumenn':
        setComponent(<Syslumenn small={small} />)
        break
      case 'stafraent-island':
        setComponent(<StafraentIsland small={small} />)
        break
      case 'mannaudstorg':
        setComponent(<Mannaudstorg />)
        break
      case 'default':
      default:
        setComponent(<Default />)
        break
    }
  }, [small, variation])

  return (
    <Hidden print={true}>
      <div className={cn(styles.bg, { [styles.bgSmall]: small })}>
        {component}
      </div>
    </Hidden>
  )
}

export default Background
