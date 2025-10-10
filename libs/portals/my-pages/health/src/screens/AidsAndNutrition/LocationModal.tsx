import React from 'react'

import { RightsPortalAidOrNutrition } from '@island.is/api/schema'
import {
  InfoLineStack,
  Modal,
  NestedLines,
} from '@island.is/portals/my-pages/core'
import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Text,
} from '@island.is/island-ui/core'
import * as styles from './AidsAndNutrition.css'
import cn from 'classnames'
import { useLocale } from '@island.is/localization'
import { messages } from '../../lib/messages'

interface LocationModalProps {
  item: RightsPortalAidOrNutrition
  onClose: () => void
  isVisible: boolean
}

const LocationModal: React.FC<LocationModalProps> = ({
  item,
  onClose,
  isVisible,
}) => {
  const { formatMessage } = useLocale()
  const modulusCalculations = (index: number) => {
    return index % 2 !== 0
  }

  return (
    <Modal
      id={'health-aids-nutrition-location-modal'}
      isVisible={isVisible}
      onCloseModal={onClose}
      title={formatMessage(messages.dispensationPlaces)}
    >
      <Box background="blue100" width="full" className={styles.locationModal}>
        {item?.location?.map((item, i) => {
          return (
            <Box
              key={i}
              className={cn({
                [styles.white]: modulusCalculations(i),
              })}
              width="full"
              padding={2}
            >
              <Text variant="small">{item}</Text>
            </Box>
          )
        })}
      </Box>
    </Modal>
  )
}

export default LocationModal
