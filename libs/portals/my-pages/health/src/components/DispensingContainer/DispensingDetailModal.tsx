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
  number: number
  toggleClose?: boolean
  isVisible: boolean
  closeModal: () => void
}

const DispensingDetailModal: React.FC<Props> = ({
  id,
  activeDispensation,
  number,
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
                  label={formatMessage(messages.dispensations, { arg: number })}
                  value={formatDate(activeDispensation.issueDate)}
                />
                <DispensingDetailModalItem
                  blue
                  label={formatMessage(messages.medicineName)}
                  value={activeDispensation.name}
                />
                <DispensingDetailModalItem
                  label={formatMessage(messages.type)}
                  value={activeDispensation.type}
                />
                <DispensingDetailModalItem
                  blue
                  label={formatMessage(messages.prescribedAmount)}
                  value={activeDispensation.quantity}
                />
                <DispensingDetailModalItem
                  label={formatMessage(messages.usageInstructions)}
                  value={activeDispensation.dosageInstructions}
                />
                <DispensingDetailModalItem
                  blue
                  label={formatMessage(messages.usedFor)}
                  value={activeDispensation.indication}
                />
                <DispensingDetailModalItem
                  label={formatMessage(messages.publicationDate)}
                  value={formatDate(activeDispensation.issueDate)}
                />
                <DispensingDetailModalItem
                  blue
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
