import dynamic from 'next/dynamic'

export const HeilbrigdisstofnunSudurlandsHeader = dynamic(() =>
  import('./HeilbrigdisstofnunSudurlandsHeader'),
)

export const HeilbrigdisstofnunSudurlandsFooter = dynamic(() =>
  import('./HeilbrigdisstofnunSudurlandsFooter'),
)
