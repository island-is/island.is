import React, { FC, useEffect, useState } from 'react'
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

export const PendingRejected: FC<FieldBaseProps> = ({ application, field }) => {
  const { externalData } = application
  const { answers } = application

  const [stateName, setStateName] = useState<string>(MCEvents.PENDING_REJECTED)

  const [submitApplication] = useMutation(SUBMIT_APPLICATION, {
    onError: (e) => console.error(e.message),
  })

  if (
    (externalData?.submitRequestToSyslumenn?.data as {
      hasSentRequest: boolean
    }).hasSentRequest &&
    stateName !== MCEvents.PENDING_REJECTED_TRY_AGAIN
  ) {
    // to make sure you only call submitApplication once
    setStateName(MCEvents.PENDING_REJECTED_TRY_AGAIN)

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

  const selectedProperty = (externalData.validateMortgageCertificate.data as {
    property?: PropertyDetail
  })?.property

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
          {selectedProperty?.propertyNumber}{' '}
          {selectedProperty?.defaultAddress?.display}
        </Text>
      </Box>
      <Box marginBottom={5}>
        <AlertMessage
          type="warning"
          title="Ekki tókst að sækja veðbókavottorð fyrir þessa eign"
          message="Því miður getum við ekki sótt rafrænt veðbókarvottorð fyrir valda eign þar skráning á viðkomandi eign þarnast uppfærslu. Sýslumanni í því umdæmi sem eignin er í verður send beiðni um lagfæringu, þú munt fá tilkynningu (á netfang) að yfirferð lokinni og getur þá reynt aftur."
        />
      </Box>
      <Box marginBottom={5}>
        <AlertMessage
          type="success"
          title="Beiðni um lagfæringu á veðbókarvottorði hefur verið send sýslumanni"
          message="Þú munt fá tilkynningu á netfangið [netfang] að yfirferð lokinni og getur þá reynt aftur og klárað umsóknina þína."
        />
      </Box>
      <Box display="flex" justifyContent={'flexEnd'}>
        <Link href="https://minarsidur.island.is/">
          <Button variant="primary" icon="arrowForward">
            Mínar síður
          </Button>
        </Link>
      </Box>
    </Box>
  )
}
