import { HealthDirectorateMedicineHistoryDispensation } from '@island.is/api/schema'
import {
  Box,
  Button,
  GridColumn,
  GridContainer,
  GridRow,
  ModalBase,
  Tag,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { formatDate } from '@island.is/portals/my-pages/core'
import React, { useState } from 'react'
import { messages } from '../../lib/messages'
import * as styles from './DispensingContainer.css'
import DispensingDetailModalItem from './DispensingDetailModalItem'

interface Props {
  id: string
  activeDispensation: HealthDirectorateMedicineHistoryDispensation
  toggleClose?: boolean
  isVisible: boolean
  closeModal: () => void
}

const DispensingDetailModal: React.FC<Props> = ({
  id,
  activeDispensation,
  toggleClose,
  isVisible,
  closeModal,
}) => {
  const { formatMessage } = useLocale()
  const [modalVisible, setModalVisible] = useState<boolean>(isVisible ?? false)

  const close = () => {
    setModalVisible(false)
    closeModal()
  }

  return (
    <ModalBase
      baseId={`dispensingDetailModal-${id}`}
      isVisible={modalVisible}
      initialVisibility={false}
      onVisibilityChange={(visibility) => {
        setModalVisible(visibility)
        if (!visibility) close()
      }}
      toggleClose={toggleClose}
      className={styles.modal}
      removeOnClose
    >
      <Box paddingY={[2, 2, 2, 4, 8]} paddingX={[2, 2, 2, 6, 12]}>
        <Box paddingLeft={1}>
          <Text variant="h3" marginBottom={5}>
            {formatMessage(messages.dispensationInformation)}
          </Text>
        </Box>

        <Box>
          <GridContainer className={styles.grid}>
            <GridRow>
              <GridColumn span={'12/12'}>
                <DispensingDetailModalItem
                  blue
                  label={formatMessage(messages.dispensingPlace)}
                  value={activeDispensation.agentName}
                />
                <DispensingDetailModalItem
                  label={formatMessage(messages.date)}
                  value={formatDate(activeDispensation.date)}
                />
                <DispensingDetailModalItem
                  blue
                  label={formatMessage(messages.medicineName)}
                  value={activeDispensation.name}
                />
                <DispensingDetailModalItem
                  label={formatMessage(messages.medicineStrength)}
                  value={activeDispensation.strength}
                />
                <DispensingDetailModalItem
                  blue
                  label={formatMessage(messages.type)}
                  value={activeDispensation.type}
                />
                <DispensingDetailModalItem
                  label={formatMessage(messages.prescribedAmount)}
                  value={activeDispensation.quantity}
                />
                <DispensingDetailModalItem
                  blue
                  label={formatMessage(messages.usageInstructions)}
                  value={activeDispensation.dosageInstructions}
                />
                <DispensingDetailModalItem
                  label={formatMessage(messages.usedFor)}
                  value={activeDispensation.indication}
                />
                <DispensingDetailModalItem
                  blue
                  label={formatMessage(messages.publicationDate)}
                  value={formatDate(activeDispensation.issueDate)}
                />
                <DispensingDetailModalItem
                  label={formatMessage(messages.medicineValidTo)}
                  value={formatDate(activeDispensation.expirationDate)}
                  tag={
                    <Tag
                      variant={activeDispensation.isExpired ? 'red' : 'blue'}
                      disabled
                      outlined
                    >
                      {activeDispensation.isExpired
                        ? formatMessage(messages.vaccineExpired)
                        : formatMessage(messages.valid)}
                    </Tag>
                  }
                />
                <DispensingDetailModalItem
                  blue
                  label={formatMessage(messages.doctor)}
                  value={activeDispensation.prescriberName}
                />
              </GridColumn>
            </GridRow>
            <GridRow>
              <GridColumn span={'12/12'} paddingTop={3}>
                <Button size="small" onClick={close} variant="ghost">
                  {formatMessage(messages.close)}
                </Button>
              </GridColumn>
            </GridRow>
          </GridContainer>
        </Box>
      </Box>
    </ModalBase>
  )
}

export default DispensingDetailModal
