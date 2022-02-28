import React, { FC, useEffect } from 'react'
import { FieldBaseProps, getValueViaPath } from '@island.is/application/core'
import {
  Box,
  Text,
  AlertMessage,
  Button,
  Link,
} from '@island.is/island-ui/core'
import { SUBMIT_APPLICATION } from '@island.is/application/graphql'
import { MCEvents } from '../../lib/constants'
import { useMutation } from '@apollo/client'
import { PropertyDetail } from '../../types/schema'

export const PendingRejectedTryAgain: FC<FieldBaseProps> = ({
  application,
  field,
}) => {
  const { externalData } = application
  const { answers } = application

  const [submitApplication] = useMutation(SUBMIT_APPLICATION, {
    onError: (e) => console.error(e.message),
  })

  if (
    (externalData?.submitRequestToSyslumenn?.data as {
      hasSentRequest: boolean
    }).hasSentRequest
  ) {
    submitApplication({
      variables: {
        input: {
          id: application.id,
          event: MCEvents.PENDING_REJECTED_TRY_AGAIN,
          answers: application.answers,
        },
      },
    })
  }

  var selectedProperty = (getValueViaPath(
    application.answers,
    'selectProperty',
  ) as { property: PropertyDetail; isFromSearch: boolean }).property

  return (
    <Box>
      <Text variant="h2" marginBottom={4}>
        Upplýsingar um eign
      </Text>

      <Box
        borderRadius="standard"
        background={'blue100'}
        paddingX={2}
        paddingY={1}
        marginBottom={5}
      >
        <Text fontWeight="semiBold">Valin fasteign</Text>
        <Text>
          {selectedProperty.propertyNumber}{' '}
          {selectedProperty.defaultAddress?.display}
        </Text>
      </Box>
      {/* <Box display="flex" justifyContent={'flexEnd'}>
        <Link href="https://minarsidur.island.is/">
          <Button variant="primary" icon="arrowForward">
            Mínar síður
          </Button>
        </Link>
      </Box> */}
    </Box>
  )
}
