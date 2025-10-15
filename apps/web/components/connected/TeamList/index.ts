import dynamic from 'next/dynamic'

export const ConnectedTeamList = dynamic(() => import('./TeamList'), {
  ssr: true,
})
