import { NormalizedCacheObject } from '@apollo/client'
import type { GetServerSideProps } from 'next'
import type { ScreenContext } from '../types'

// Hack needed to avoid JSON-Serialization validation error from Next.js https://github.com/zeit/next.js/discussions/11209
// >>> Reason: `undefined` cannot be serialized as JSON. Please use `null` or omit this value all together.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const deleteUndefined = (obj: Record<string, any> | undefined): void => {
  if (obj) {
    Object.keys(obj).forEach((key: string) => {
      if (obj[key] && typeof obj[key] === 'object') {
        deleteUndefined(obj[key])
      } else if (typeof obj[key] === 'undefined') {
        delete obj[key] // eslint-disable-line no-param-reassign
      }
    })
  }
}

type Component = {
  ({
    apolloState,
    pageProps,
  }: {
    apolloState: unknown
    pageProps: unknown
  }): JSX.Element
  getProps(
    ctx: Partial<ScreenContext>,
  ): Promise<{
    pageProps: unknown
    apolloState: NormalizedCacheObject
  }>
}

export const getServerSidePropsWrapper: (
  screen: Component,
) => GetServerSideProps = (screen) => async (ctx) => {
  const props = screen.getProps ? await screen.getProps(ctx) : ctx
  deleteUndefined(props)
  return {
    props,
  }
}
