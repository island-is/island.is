import dynamic from 'next/dynamic'

export const GrantCardsList = dynamic(() => import('./GrantCardsList'), {
  ssr: true,
})
