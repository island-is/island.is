import { RightsPortalAidOrNutrition } from '@island.is/api/schema'
import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Modal } from '@island.is/portals/my-pages/core'
import cn from 'classnames'
import { messages } from '../../lib/messages'
import * as styles from './AidsAndNutrition.css'

interface LocationModalProps {
  item: RightsPortalAidOrNutrition
  onClose: () => void
  isVisible: boolean
}

const LocationModal = ({ item, onClose, isVisible }: LocationModalProps) => {
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
