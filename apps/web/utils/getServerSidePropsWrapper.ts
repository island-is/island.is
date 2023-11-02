import { NormalizedCacheObject } from '@apollo/client'
import { logger } from '@island.is/logging'
import type { GetServerSideProps } from 'next'
import type { ScreenContext } from '../types'
import { CustomNextError } from '../units/errors'

// Taken from here: https://github.com/vercel/next.js/discussions/11209#discussioncomment-38480
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
  getProps(ctx: Partial<ScreenContext>): Promise<{
    pageProps: unknown
    apolloState: NormalizedCacheObject
  }>
}

export const getServerSidePropsWrapper: (
  screen: Component,
) => GetServerSideProps = (screen) => async (ctx) => {
  try {
    const props = screen.getProps ? await screen.getProps(ctx) : ctx
    deleteUndefined(props)
    return {
      props,
    }
  } catch (error) {
    if (error instanceof CustomNextError) {
      if (error.statusCode === 404) {
        logger.info(error.title || '404 error occurred on web', error)
        return {
          notFound: true,
        }
      }
    }
    throw error
  }
}
