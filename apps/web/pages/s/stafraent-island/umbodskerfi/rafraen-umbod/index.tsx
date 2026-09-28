import type { ComponentProps } from 'react'

import OrganizationPageScreen from '../../../[...slugs]'
import { getServerSidePropsWrapper } from '../../../../../utils/getServerSidePropsWrapper'

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
