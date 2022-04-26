import React from 'react'
import { Box, Text, Button, Divider } from '@island.is/island-ui/core'
import { DirectTaxPayment } from '@island.is/financial-aid/shared/lib'

interface Props {
  directTaxPayments: DirectTaxPayment[]
  hasFetchedPayments: boolean
  setIsModalOpen: (open: boolean) => void
}

const DirectTaxPaymentCell = ({
  directTaxPayments,
  hasFetchedPayments,
  setIsModalOpen,
}: Props) => {
  const fetchFailed = directTaxPayments.length === 0 && !hasFetchedPayments

  if (fetchFailed) {
    return null
  }
  return (
    <>
      <Divider />
      <Box
        display="flex"
        justifyContent="spaceBetween"
        alignItems="flexStart"
        paddingY={[4, 4, 5]}
      >
        <Box marginRight={3}>
          <Text fontWeight="semiBold" color={'dark400'}>
            Staðgreiðsluskrá
          </Text>
          <Text>Staðgreiðsluskrá sótt</Text>
        </Box>

        {directTaxPayments.length === 0 ? (
          <Text marginTop={3}>Engin staðgreiðsla</Text>
        ) : (
          <Button
            onClick={() => setIsModalOpen(true)}
            icon="open"
            iconType="outline"
            variant="utility"
          >
            Opna sundurliðun
          </Button>
        )}
      </Box>
    </>
  )
}

export default DirectTaxPaymentCell
