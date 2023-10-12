import dynamic from 'next/dynamic'

export const RettindagaeslaFatladsFolksHeader = dynamic(
  () => import('./RettindagaeslaFatladsFolksHeader'),
  { ssr: false },
)

export const RettindagaeslaFatladsFolksFooter = dynamic(
  () => import('./RettindagaeslaFatladsFolksFooter'),
  { ssr: false },
)
