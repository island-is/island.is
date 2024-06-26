import dynamic from 'next/dynamic'

import Header from './LandlaeknirHeader'

export const LandlaeknirFooter = dynamic(() => import('./LandlaeknirFooter'), {
  ssr: false,
})

export const LandlaeknirHeader = Header
