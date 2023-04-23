import dynamic from 'next/dynamic'
export const LandingPageFooter = dynamic(() => import('./LandingPageFooter'), {
  ssr: true,
})
export const LandingPage = dynamic(() => import('./LandingPage'), {
  ssr: true,
})
