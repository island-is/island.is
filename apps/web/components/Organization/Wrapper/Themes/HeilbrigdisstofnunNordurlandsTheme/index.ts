import dynamic from 'next/dynamic'

export const HeilbrigdisstofnunNordurlandsHeader = dynamic(() =>
  import('./HeilbrigdisstofnunNordurlandsHeader'),
)

export const HeilbrigdisstofnunNordurlandsFooter = dynamic(() =>
  import('./HeilbrigdisstofnunNordurlandsFooter'),
)
