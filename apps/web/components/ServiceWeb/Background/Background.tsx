import { ReactNode, useEffect, useMemo, useState } from 'react'
import cn from 'classnames'
import dynamic from 'next/dynamic'
import { Hidden } from '@island.is/island-ui/core'
import { BackgroundProps } from '../types'
import { useWindowSize } from '@island.is/web/hooks/useViewport'

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
  const { width } = useWindowSize()

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
        setComponent(<Mannaudstorg />)
        break
      case 'default':
      default:
        setComponent(<Default />)
        break
    }
  }, [small, variation])

  const top = useMemo(() => {
    if (typeof document === 'undefined') return 0

    let top = 0
    const mobileAppBanner = document.querySelectorAll(
      '[data-test-id=mobile-app-banner]',
    )
    for (let i = 0; i < mobileAppBanner?.length ?? 0; i += 1) {
      if (window.getComputedStyle(mobileAppBanner.item(i))) {
        top += 72
        console.log('yay')
      } else {
        console.log('nay')
      }
    }

    console.log('TOP', top)

    return top
  }, [width])

  return (
    <Hidden print={true}>
      <div
        style={{ top }}
        className={cn(styles.bg, { [styles.bgSmall]: small })}
      >
        {component}
      </div>
    </Hidden>
  )
}

export default Background
