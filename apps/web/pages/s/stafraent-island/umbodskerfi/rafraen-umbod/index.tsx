import type { ComponentProps } from 'react'

import { getServerSidePropsWrapper } from '../../../../../utils/getServerSidePropsWrapper'
import OrganizationPageScreen from '../../../[...slugs]'

const Screen = Object.assign(
  (props: ComponentProps<typeof OrganizationPageScreen>) => (
    <OrganizationPageScreen {...props} />
  ),
  {
    getProps: (
      context: Parameters<typeof OrganizationPageScreen.getProps>[0],
    ) =>
      OrganizationPageScreen.getProps({
        ...context,
        query: {
          ...context.query,
          slugs: ['stafraent-island', 'umbodskerfi', 'rafraen-umbod'],
        },
      }),
  },
)

export default Screen

export const getServerSideProps = getServerSidePropsWrapper(Screen)
