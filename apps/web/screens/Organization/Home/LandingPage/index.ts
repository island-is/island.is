import dynamic from 'next/dynamic'
export const LandingPageFooter = dynamic(() => import('./LandingPageFooter'), {
  ssr: false,
})
export const LandingPage = dynamic(() => import('./LandingPage'), {
  ssr: false,
})
