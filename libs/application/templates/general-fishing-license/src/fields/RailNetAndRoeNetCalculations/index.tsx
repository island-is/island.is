import React, { FC, useState } from 'react'
import { FieldBaseProps } from '@island.is/application/types'
import { Box, Text, Tooltip } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { fishingLicenseFurtherInformation } from '../../lib/messages'
import { InputController } from '@island.is/shared/form-fields'
import { getErrorViaPath, getValueViaPath } from '@island.is/application/core'
import { motion } from 'framer-motion'

const MAXIMUM_TOTAL_RAIL_NET_LENGTH = 7500

export const RailNetAndRoeNetCalculations: FC<FieldBaseProps> = ({
  application,
  field,
  errors,
}) => {
  const { formatMessage } = useLocale()
  const initialRoeNet = getValueViaPath(
    application.answers,
    `${field}.roenet`,
    '',
  ) as string
  const initialRailNet = getValueViaPath(
    application.answers,
    `${field}.railnet`,
    '',
  ) as string
  const [numRoeNets, setNumRoeNets] = useState(initialRoeNet || '')
  const [lengthRailNet, setLengthRailNet] = useState(initialRailNet || '')

  // Calculates the total sum of rails depending on the number of roe nets
  // To show the calculated result in front end
  const calculateTotalRailNet = () => {
    try {
      const roenet = parseInt(numRoeNets.trim(), 10)
      const railnet = parseInt(lengthRailNet.split('m').join('').trim(), 10)
      return !isNaN(roenet) && !isNaN(railnet) ? roenet * railnet : 0
    } catch (e) {
      return 0
    }
  }

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
        <Box width="half">
          <InputController
            id={`${field}.roenet`}
            name="roenet"
            format="####"
            label={formatMessage(
              fishingLicenseFurtherInformation.labels.roenet,
            )}
            error={errors && getErrorViaPath(errors, `${field}.roenet`)}
            backgroundColor="blue"
            onChange={(e) => setNumRoeNets(e.target.value)}
            defaultValue={numRoeNets}
          />
        </Box>
        <Box width="half">
          <InputController
            id={`${field}.railnet`}
            name="railnet"
            format="####m"
            label={formatMessage(
              fishingLicenseFurtherInformation.labels.railnet,
            )}
            error={errors && getErrorViaPath(errors, `${field}.railnet`)}
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
          {calculateTotalRailNet()
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, '.')}{' '}
          m
        </Text>
        {/* tooltip that expands to signal information if total rail net length is above the limitation */}
        <motion.div
          initial={{ scale: 0, x: 5 }}
          animate={{
            scale:
              calculateTotalRailNet() > MAXIMUM_TOTAL_RAIL_NET_LENGTH ? 1.2 : 0,
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
