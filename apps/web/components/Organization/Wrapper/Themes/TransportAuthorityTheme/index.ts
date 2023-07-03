import dynamic from 'next/dynamic'

export const TransportAuthorityFooter = dynamic(() =>
  import('./TransportAuthorityFooter'),
)

export const TransportAuthorityHeader = dynamic(() =>
  import('./TransportAuthorityHeader'),
)
