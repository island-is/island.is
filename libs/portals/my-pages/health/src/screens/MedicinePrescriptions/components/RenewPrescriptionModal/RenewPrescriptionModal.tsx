import {
  Box,
  Button,
  GridColumn,
  GridContainer,
  GridRow,
  ModalBase,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import cn from 'classnames'
import React, { useState } from 'react'
import { messages } from '../../../../lib/messages'
import {
  HealthCenter,
  HealthCenterData,
  MedicinePrescriptionDetailData,
} from '../../../../utils/mockData'
import * as styles from './RenewPrescriptionModal.css'
import { HealthDirectoratePrescription } from '@island.is/api/schema'

interface Props {
  id: string
  activePrescription: HealthDirectoratePrescription
  toggleClose?: boolean
  isVisible: boolean
}

interface RenewFormData {
  healthcare?: HealthCenter
  medicineInformation?: HealthDirectoratePrescription
}

const RenewPrescriptionModal: React.FC<Props> = ({
  id,
  activePrescription,
  toggleClose,
  isVisible,
}) => {
  const { formatMessage } = useLocale()
  const columnWidth = '7/12'
  const titleWidth = '5/12'
  const modulusCalculations = (index: number) => {
    return index % 4 === 0 || index % 4 === 1
  }
  const [selectedMedicine, setSelectedMedicine] = useState('')
  const [modalVisible, setModalVisible] = useState<boolean>(isVisible ?? false)
  const [formData, setFormData] = useState<RenewFormData | null>({
    healthcare: HealthCenterData[1],
    medicineInformation: activePrescription,
  })

  const closeModal = () => {
    setModalVisible(false)
  }

  const submitForm = async (
    e: React.FormEvent<HTMLFormElement> | undefined,
  ) => {
    // TODO: Implement form submission when service is ready
    e?.preventDefault()
    try {
      if (!e) return
      const formData2 = e && new FormData(e.currentTarget)
      const data = formData2 && Object.fromEntries((formData2 as any).entries())
      setFormData(null)
      setModalVisible(false)
    } catch (e) {
      //TODO: Add error handling
      console.error('Error submitting form:', e)
    }
  }

  return (
    <ModalBase
      baseId={'renewPrescriptionModal'}
      isVisible={modalVisible}
      initialVisibility={false}
      onVisibilityChange={(visibility) => {
        setModalVisible(visibility)
      }}
      toggleClose={toggleClose}
      removeOnClose
      className={styles.modal}
    >
      <Box paddingY={8} paddingX={12}>
        <Text variant="h3" marginBottom={5}>
          {formatMessage(messages.renewalMedicineRequest)}
        </Text>
        <Text>{formatMessage(messages.renewalMedicineRequestText)}</Text>

        <Text variant="small" fontWeight="medium" marginBottom={1}>
          {formatMessage(messages.medicineInformation)}
        </Text>

        <Box>
          <GridContainer className={styles.grid}>
            <GridRow>
              {MedicinePrescriptionDetailData.map((item, i) => (
                <GridColumn key={i} span={'6/12'}>
                  <GridContainer
                    className={cn(styles.innerGrid, {
                      [styles.blue]: modulusCalculations(i),
                    })}
                  >
                    <GridRow>
                      <GridColumn span={titleWidth}>
                        <Box className={styles.titleCol}>
                          <Text fontWeight="semiBold" variant="small" as="span">
                            {item.title}
                          </Text>
                        </Box>
                      </GridColumn>
                      <GridColumn span={columnWidth} className={styles.data}>
                        <Text variant="small" truncate>
                          {item.value}
                        </Text>
                      </GridColumn>
                    </GridRow>
                  </GridContainer>
                </GridColumn>
              ))}
            </GridRow>
            <GridRow>
              <GridColumn span={'12/12'}>
                <Button>Button</Button>
              </GridColumn>
            </GridRow>
          </GridContainer>
        </Box>
      </Box>
    </ModalBase>
  )
}

export default RenewPrescriptionModal
