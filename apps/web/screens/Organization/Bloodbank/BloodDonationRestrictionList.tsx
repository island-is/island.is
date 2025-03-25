import { parseAsInteger, useQueryState } from 'next-usequerystate'

import { Pagination } from '@island.is/island-ui/core'
import { CustomPageUniqueIdentifier } from '@island.is/web/graphql/schema'
import { withMainLayout } from '@island.is/web/layouts/main'

import {
  type CustomScreen,
  withCustomPageWrapper,
} from '../../CustomPage/CustomPageWrapper'
import { GET_BLOOD_DONATION_RESTRICTIONS_QUERY } from '../../queries/BloodDonationRestrictions'

const ITEMS_PER_PAGE = 10

interface BloodDonationRestrictionListProps {
  totalItems: number
  currentPage: number
}

const BloodDonationRestrictionList: CustomScreen<
  BloodDonationRestrictionListProps
> = ({ customPageData, currentPage, totalItems }) => {
  const [selectedPage, setSelectedPage] = useQueryState(
    'page',
    parseAsInteger
      .withOptions({
        clearOnDefault: true,
        shallow: false,
      })
      .withDefault(1),
  )

  return (
    <div>
      <h1>BloodDonationRestrictionList</h1>
      <Pagination
        page={currentPage}
        totalItems={totalItems}
        renderLink={(page, className, children) => (
          <button
            onClick={() => {
              setSelectedPage(page)
            }}
          >
            <span className={className}>{children}</span>
          </button>
        )}
      />
    </div>
  )
}

BloodDonationRestrictionList.getProps = async ({ query, apolloClient }) => {
  let page = parseAsInteger.parseServerSide(query.page) ?? 1
  if (page < 1) {
    page = 1
  }

  apolloClient.query({
    query: GET_BLOOD_DONATION_RESTRICTIONS_QUERY,
    variables: {
      input: {
        page,
      },
    },
  })

  return {
    totalItems: 20,
    currentPage: page,
  }
}

export default withMainLayout(
  withCustomPageWrapper(
    CustomPageUniqueIdentifier.BloodDonationRestrictions,
    BloodDonationRestrictionList,
  ),
)
