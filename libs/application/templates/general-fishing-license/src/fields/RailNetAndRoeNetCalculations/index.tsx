import React, { FC, useState } from 'react'
import { FieldBaseProps } from '@island.is/application/types'
import { Box, Text, Tooltip } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { fishingLicenseFurtherInformation } from '../../lib/messages'
import { InputController } from '@island.is/shared/form-fields'
import { getErrorViaPath, getValueViaPath } from '@island.is/application/core'
import { motion } from 'framer-motion'
import {
  calculateTotalRailNet,
  MAXIMUM_TOTAL_RAIL_NET_LENGTH,
} from '../../utils/licenses'

export const RailNetAndRoeNetCalculations: FC<FieldBaseProps> = ({
  application,
  field,
  errors,
}) => {
  const { formatMessage } = useLocale()
  const initialRoeNet = getValueViaPath(
    application.answers,
    `${field.id}.roenet`,
    '',
  ) as string
  const initialRailNet = getValueViaPath(
    application.answers,
    `${field.id}.railnet`,
    '',
  ) as string
  const [numRoeNets, setNumRoeNets] = useState(initialRoeNet || '0')
  const [lengthRailNet, setLengthRailNet] = useState(initialRailNet || '0')
  return (
    <Box marginTop={6}>
      <Box>
        <Text fontWeight="semiBold" marginBottom={2}>
          Veiðifæri
        </Text>
        <Text marginBottom={2}>
          Athugið að samtals teinalengd má ekki vera hærri en 7500 metrar
        </Text>
      </Box>
      <Box display="flex" justifyContent="spaceBetween">
        <Box width="half" paddingRight={2}>
          <InputController
            id={`${field.id}.roenet`}
            name={`${field.id}.roenet`}
            format="####"
            label={formatMessage(
              fishingLicenseFurtherInformation.labels.roenet,
            )}
            error={errors && getErrorViaPath(errors, `${field.id}`)}
            backgroundColor="blue"
            onChange={(e) => setNumRoeNets(e.target.value)}
            defaultValue={numRoeNets}
          />
        </Box>
        <Box width="half">
          <InputController
            id={`${field.id}.railnet`}
            name={`${field.id}.railnet`}
            format="####m"
            error={errors && getErrorViaPath(errors, `${field.id}`)}
            label={formatMessage(
              fishingLicenseFurtherInformation.labels.railnet,
            )}
            backgroundColor="blue"
            onChange={(e) => setLengthRailNet(e.target.value)}
            defaultValue={lengthRailNet}
          />
        </Box>
      </Box>
      <Box
        marginTop={3}
        marginBottom={3}
        textAlign="right"
        display="flex"
        justifyContent="flexEnd"
      >
        <Text fontWeight="medium">
          {formatMessage(fishingLicenseFurtherInformation.general.total)}{' '}
          {calculateTotalRailNet(numRoeNets, lengthRailNet)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, '.')}{' '}
          m
        </Text>
        {/* tooltip that expands to signal information if total rail net length is above the limitation */}
        <motion.div
          initial={{ scale: 0, x: 5 }}
          animate={{
            scale:
              calculateTotalRailNet(numRoeNets, lengthRailNet) >
              MAXIMUM_TOTAL_RAIL_NET_LENGTH
                ? 1.2
                : 0,
            x: 5,
          }}
        >
          <Tooltip
            text={formatMessage(
              fishingLicenseFurtherInformation.errorMessages.railNetTooLarge,
            )}
          />
        </motion.div>
      </Box>
    </Box>
  )
}
