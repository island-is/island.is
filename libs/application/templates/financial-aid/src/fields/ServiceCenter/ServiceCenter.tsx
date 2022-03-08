import React from 'react'
import { Text, Button } from '@island.is/island-ui/core'

import { serviceCenters } from '@island.is/financial-aid/shared/data'
import { FAFieldBaseProps } from '../../lib/types'

const ServiceCenter = ({ application }: FAFieldBaseProps) => {
  const { externalData } = application

  const serviceCenter = serviceCenters.find(
    (serviceCenter) =>
      serviceCenter.number ===
      Number(
        externalData.nationalRegistry?.data?.applicant?.address
          ?.municipalityCode,
      ),
  )
  return (
    <>
      <Text marginBottom={[1, 1, 2]} marginTop={2}>
        Samkvæmt <b>Þjóðskrá</b> ert þú með lögheimili í{' '}
        <b>{serviceCenter?.name}</b>.
      </Text>

      <Text marginBottom={[2, 2, 4]}>
        Þitt sveitarfélag er ekki komið inn í þetta umsóknarferli. Kynntu þér
        málið eða sæktu um fjárhagsaðstoð á heimasíðu þíns sveitarfélags eða
        þess sveitarfélags sem sér um fjárhagsaðstoð hjá þínu sveitarfélagi.
      </Text>

      {serviceCenter?.link && (
        <Button
          variant="ghost"
          icon="open"
          iconType="outline"
          onClick={() => {
            window.open(serviceCenter?.link, '_ blank')
          }}
        >
          Fjárhagsaðstoð {serviceCenter?.name}
        </Button>
      )}
    </>
  )
}

export default ServiceCenter
