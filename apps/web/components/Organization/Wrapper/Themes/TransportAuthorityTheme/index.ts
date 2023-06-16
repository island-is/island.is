import dynamic from 'next/dynamic'

export const TransportAuthorityFooter = dynamic(() =>
  import('./TransportAuthorityFooter'),
)
