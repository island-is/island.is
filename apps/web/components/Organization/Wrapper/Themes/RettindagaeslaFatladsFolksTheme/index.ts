import dynamic from 'next/dynamic'

export const RettindagaeslaFatladsFolksHeader = dynamic(
  () => import('./RettindagaeslaFatladsFolksHeader'),
  { ssr: false },
)
