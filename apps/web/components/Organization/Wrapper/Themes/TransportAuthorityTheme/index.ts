import dynamic from 'next/dynamic'

export const TransportAuthorityHeader = dynamic(() =>
  import('./TransportAuthorityHeader'),
)
