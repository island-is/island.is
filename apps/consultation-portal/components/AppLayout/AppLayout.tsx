import Head from 'next/head'
import { ReactNode } from 'react'
import localization from './AppLayout.json'

interface Props {
  children: ReactNode
}

const AppLayout = ({ children }: Props) => {
  const loc = localization['appLayout']
  return (
    <div>
      <Head>
        <title>{loc.title}</title>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/samradsgatt/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/samradsgatt/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/samradsgatt/favicon-16x16.png"
        />
        <link rel="manifest" href="/samradsgatt/site.webmanifest" />
        <link rel="shortcut icon" href="/samradsgatt/favicon.ico" />
      </Head>
      {children}
    </div>
  )
}

export default AppLayout
