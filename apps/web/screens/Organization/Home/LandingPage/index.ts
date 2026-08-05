import dynamic from 'next/dynamic'
export const LandingPage = dynamic(() => import('./LandingPage'), {
  ssr: false,
})
