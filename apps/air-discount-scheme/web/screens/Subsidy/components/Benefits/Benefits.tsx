import React, { useEffect } from 'react'
import { useMutation } from '@apollo/client'
import gql from 'graphql-tag'

import {
  Box,
  Typography,
  Stack,
  Icon,
  SkeletonLoader,
} from '@island.is/island-ui/core'
import { UserCredit, NoBenefits } from '../'
import { Status } from '../UserCredit/UserCredit'

interface PropTypes {
  misc: string
}

const FetchDiscountsMutation = gql`
  mutation FetchDiscountsMutation {
    fetchDiscounts {
      discountCode
      expires
      nationalId
      user {
        nationalId
        name
        fund {
          nationalId
          used
          credit
          total
        }
        meetsADSRequirements
      }
    }
  }
`

function Benefits({ misc }: PropTypes) {
  const [fetchDiscounts, { data, loading, called }] = useMutation(
    FetchDiscountsMutation,
  )
  useEffect(() => {
    fetchDiscounts()
  }, [fetchDiscounts])

  const { fetchDiscounts: discounts = [] } = data || {}
  const { myRights, codeDescription, attention, codeDisclaimer } = JSON.parse(
    misc,
  )
  const { activeCodes, fundUsed, noRights } = discounts.reduce(
    (acc, discount) => {
      const { user } = discount
      const fundUsed = user.fund.used === user.fund.total
      const noRights = !user.meetsADSRequirements
      const status: Status = fundUsed
        ? 'success'
        : noRights
        ? 'error'
        : 'default'
      if (status === 'success') {
        acc.fundUsed.push({ discount, status })
      } else if (status === 'error') {
        acc.noRights.push({ discount, status })
      } else {
        acc.activeCodes.push({ discount, status })
      }
      return acc
    },
    {
      activeCodes: [],
      fundUsed: [],
      noRights: [],
    },
  )
  const noBenefits =
    fundUsed.length <= 0 && activeCodes.length <= 0 && !loading && called
  return (
    <Box marginBottom={6}>
      {!noBenefits && (
        <Box
          marginBottom={8}
          background="yellow200"
          borderColor="yellow400"
          borderWidth="standard"
          borderStyle="solid"
          borderRadius="standard"
          display="flex"
          alignItems="center"
          padding={3}
        >
          <Box marginRight={2}>
            <Icon type="alert" color="yellow600" width={26} />
          </Box>
          <Box marginRight={2}>
            <Typography variant="p">
              <strong>{attention}</strong>
            </Typography>
          </Box>
          <Typography variant="p">{codeDisclaimer}</Typography>
        </Box>
      )}

      <Stack space={3}>
        <Typography variant="h3">{myRights}</Typography>
        {noBenefits ? (
          <NoBenefits misc={misc} />
        ) : (
          <>
            {loading ? (
              <SkeletonLoader height={98} />
            ) : (
              [...activeCodes, ...fundUsed, ...noRights].map((data, index) => {
                return (
                  <UserCredit
                    key={index}
                    misc={misc}
                    discount={data.discount}
                    status={data.status}
                  />
                )
              })
            )}
            <Box textAlign="right">
              <Typography variant="pSmall">{codeDescription}</Typography>
            </Box>
          </>
        )}
      </Stack>
    </Box>
  )
}

export default Benefits
