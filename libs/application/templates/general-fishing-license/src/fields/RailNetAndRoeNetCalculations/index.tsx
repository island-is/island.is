import React, { FC, useState } from 'react'
import { FieldBaseProps } from '@island.is/application/types'
import { Box, Text, Tooltip } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { fishingLicenseFurtherInformation } from '../../lib/messages'
import { InputController } from '@island.is/shared/form-fields'
import { getErrorViaPath, getValueViaPath } from '@island.is/application/core'
import { motion } from 'motion/react'
import {
  calculateTotalRailNet,
  MAXIMUM_TOTAL_RAIL_NET_LENGTH,
} from '../../utils/licenses'
import { RAILNET_FIELD_ID, ROENET_FIELD_ID } from '../../utils/fields'

export const RailNetAndRoeNetCalculations: FC<
  React.PropsWithChildren<FieldBaseProps>
> = ({ application, field, errors }) => {
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
          {formatMessage(fishingLicenseFurtherInformation.labels.railAndRoenet)}
        </Text>
        <Text marginBottom={2}>
          {formatMessage(
            fishingLicenseFurtherInformation.fieldInformation.railAndRoenet,
          )}
        </Text>
      </Box>
      <Box display="flex" justifyContent="spaceBetween">
        <Box width="half" paddingRight={2}>
          <InputController
            id={ROENET_FIELD_ID}
            name={ROENET_FIELD_ID}
            required
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
            id={RAILNET_FIELD_ID}
            name={RAILNET_FIELD_ID}
            required
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
