import dynamic from 'next/dynamic'
import Header from './ThjodskjalasafnHeader'

export const ThjodskjalasafnHeader = Header

export const ThjodskjalasafnFooter = dynamic(
  () => import('./ThjodskjalasafnFooter'),
  { ssr: true },
)
