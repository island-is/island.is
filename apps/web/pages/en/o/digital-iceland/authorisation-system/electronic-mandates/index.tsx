import type { ComponentProps } from 'react'

import { getServerSidePropsWrapper } from '../../../../../../utils/getServerSidePropsWrapper'
import OrganizationPageScreen from '../../../[...slugs]'

const Screen = Object.assign(
  ({
    apolloState,
    pageProps,
  }: {
    apolloState: unknown
    pageProps: unknown
  }) => (
    <OrganizationPageScreen
      {...({ apolloState, pageProps } as ComponentProps<
        typeof OrganizationPageScreen
      >)}
    />
  ),
  {
    getProps: (
      context: Parameters<typeof OrganizationPageScreen.getProps>[0],
    ) =>
      OrganizationPageScreen.getProps({
        ...context,
        query: {
          ...context.query,
          slugs: [
            'digital-iceland',
            'authorisation-system',
            'electronic-mandates',
          ],
        },
      }),
  },
)

export default Screen

export const getServerSideProps = getServerSidePropsWrapper(Screen)
