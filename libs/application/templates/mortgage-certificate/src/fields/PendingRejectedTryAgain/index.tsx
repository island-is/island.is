import React, { FC, useState } from 'react'
import { FieldBaseProps } from '@island.is/application/core'
import { Box, Text, AlertMessage } from '@island.is/island-ui/core'
import { PropertyDetail } from '../../types/schema'

export const PendingRejectedTryAgain: FC<FieldBaseProps> = ({
  application,
  field,
  refetch,
}) => {
  const { externalData } = application

  const [showErrorMsg, setShowErrorMsg] = useState<boolean>(false)

  const selectedProperty = (externalData.validateMortgageCertificate?.data as {
    propertyDetails: PropertyDetail
  })?.propertyDetails

  const validation = (externalData.validateMortgageCertificate?.data as {
    validation: {
      propertyNumber: string
      exists: boolean
      hasKMarking: boolean
    }
  })?.validation

  if (
    !showErrorMsg &&
    validation?.propertyNumber &&
    !(validation?.exists && validation?.hasKMarking)
  ) {
    setShowErrorMsg(true)
  }

  return (
    <Box>
      <Box
        borderRadius="standard"
        background={'blue100'}
        paddingX={2}
        paddingY={1}
        marginBottom={5}
      >
        <Text fontWeight="semiBold">Valin fasteign</Text>
        <Text>
          {selectedProperty?.propertyNumber}{' '}
          {selectedProperty?.defaultAddress?.display}
        </Text>
      </Box>
      <Box paddingBottom={3} hidden={!showErrorMsg}>
        <AlertMessage
          type="error"
          title="Ekki gekk að sækja vottorð fyrir þessa eign"
          message="Vinsamlega hafðu samband við sýslumann, það er búið að senda inn beiðni um leiðréttingu"
        />
      </Box>
    </Box>
  )
}
