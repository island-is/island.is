import dynamic from 'next/dynamic'

import Header from './LandlaeknirHeader'

export const LandlaeknirFooter = dynamic(() => import('./LandlaeknirFooter'), {
  ssr: true,
})

export const LandlaeknirHeader = Header
