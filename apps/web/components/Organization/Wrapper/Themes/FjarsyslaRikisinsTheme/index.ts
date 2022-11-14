import dynamic from 'next/dynamic'

export const FjarSyslaRikisinsFooter = dynamic(() =>
  import('./FjarsyslaRikisinsFooter'),
)
