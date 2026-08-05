import dynamic from 'next/dynamic'

export const GrantCardsList = dynamic(() => import('./GrantCardsList'), {
  ssr: true,
})

export const LastCallsForGrantsList = dynamic(
  () => import('./LastCallsForGrantsList'),
  {
    ssr: true,
  },
)
