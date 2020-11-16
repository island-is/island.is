import { NextComponentType } from 'next'
import { NextPageContext } from 'next/dist/next-server/lib/utils'

export type GetInitialPropsContext<Context> = Context & {
  locale: string
}

export type Screen<Props = {}> = NextComponentType<
  GetInitialPropsContext<NextPageContext>,
  Props,
  Props
>
