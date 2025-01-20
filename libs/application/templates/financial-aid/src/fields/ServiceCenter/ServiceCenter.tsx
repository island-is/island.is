import React from 'react'
import { useIntl } from 'react-intl'
import { Button, Box } from '@island.is/island-ui/core'

import { serviceCenters } from '@island.is/financial-aid/shared/data'
import { FAFieldBaseProps } from '../../lib/types'
import { serviceCenter } from '../../lib/messages'
import { DescriptionText } from '..'

const ServiceCenter = ({ application }: FAFieldBaseProps) => {
  const { formatMessage } = useIntl()

  const { externalData } = application

  const applicantsCenter = serviceCenters.find(
    (serviceCenter) =>
      serviceCenter.number ===
      Number(externalData.nationalRegistry.data.address?.municipalityCode),
  )

  return (
    <>
      <Box marginBottom={[1, 1, 2]} marginTop={2}>
        <DescriptionText
          text={serviceCenter.general.description}
          format={{
            applicantsServiceCenter: applicantsCenter?.name ?? '',
          }}
        />
      </Box>

      <Box marginBottom={[2, 2, 4]}>
        <DescriptionText text={serviceCenter.general.notRegistered} />
      </Box>

      {applicantsCenter?.link && (
        <Button
          variant="ghost"
          icon="open"
          iconType="outline"
          onClick={() => {
            window.open(applicantsCenter?.link, '_ blank')
          }}
        >
          {formatMessage(serviceCenter.general.linkToServiceCenter, {
            applicantsServiceCenter: applicantsCenter?.name ?? '',
          })}
        </Button>
      )}
    </>
  )
}

export default ServiceCenter
