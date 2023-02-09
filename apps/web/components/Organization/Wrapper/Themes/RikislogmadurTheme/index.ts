import dynamic from 'next/dynamic'

export const RikislogmadurHeader = dynamic(() =>
  import('./RikislogmadurHeader'),
)

export const RikislogmadurFooter = dynamic(() =>
  import('./RikislogmadurFooter'),
)
