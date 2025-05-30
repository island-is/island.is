import { HealthDirectoratePrescription } from '@island.is/api/schema'
import {
  Box,
  Button,
  GridColumn,
  GridContainer,
  GridRow,
  ModalBase,
  Text,
  toast,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import cn from 'classnames'
import React, { useState } from 'react'
import { messages } from '../../../../lib/messages'
import { HealthCenter } from '../../../../utils/mockData'
import { PrescriptionItem } from '../../../../utils/types'
import { usePostPrescriptionRenewalMutation } from '../../Prescriptions.generated'
import * as styles from './RenewPrescriptionModal.css'

interface Props {
  id: string
  activePrescription: HealthDirectoratePrescription
  toggleClose?: boolean
  isVisible: boolean
  setVisible: (isVisible: boolean) => void
  setActivePrescription: (prescription: PrescriptionItem | null) => void
}

const RenewPrescriptionModal: React.FC<Props> = ({
  id,
  activePrescription,
  toggleClose,
  isVisible,
  setVisible,
  setActivePrescription,
}) => {
  const { formatMessage } = useLocale()
  const [error, setError] = useState<string>()
  const columnWidth = '7/12'
  const titleWidth = '5/12'
  const modulusCalculations = (index: number) => {
    return index % 2 === 0
  }
  const [modalVisible, setModalVisible] = useState<boolean>(isVisible ?? false)

  const [postRenewal, { data: renewalData, error: renewalError, loading }] =
    usePostPrescriptionRenewalMutation()

  const data = [
    {
      title: formatMessage(messages.medicineName),
      value: activePrescription.name ?? '',
    },
    {
      title: formatMessage(messages.type),
      value: activePrescription?.type ?? '',
    },
    {
      title: formatMessage(messages.usedFor),
      value: activePrescription.indication ?? '',
    },
    {
      title: formatMessage(messages.usage),
      value: activePrescription.dosageInstructions ?? '',
    },
    {
      title: formatMessage(messages.prescribedAmount),
      value: activePrescription.totalPrescribedAmount ?? '',
    },
  ]

  const closeModal = () => {
    setModalVisible(false)
    setVisible(false)
    setActivePrescription(null)
  }

  const submitForm = async () => {
    // TODO: Improve form submission when service is ready
    if (
      activePrescription.category === undefined ||
      activePrescription.id === undefined
    ) {
      setError('Please select a valid prescription.')
    }

    postRenewal({
      variables: {
        input: {
          id: activePrescription.id,
          medCardDrugCategory: activePrescription.category ?? '',
          medCardDrugId: activePrescription.medCardDrugId ?? '',
          prescribedItemId: activePrescription.id,
        },
      },
    })
      .catch(() => {
        setError(
          'Ekki tókst að senda endurnýjunarbeiðni. Vinsamlegast reynið aftur síðar.',
        )
        toast.error(
          'Ekki tókst að senda endurnýjunarbeiðni. Vinsamlegast reynið aftur síðar.',
        )
      })
      .then(() => {
        if (renewalData) {
          setError('')
          closeModal()
          toast.success(
            'Endurnýjunarbeiðni hefur verið send. Vinsamlegast hafið samband við heilsugæsly ef þörf er á frekari upplýsingum.',
          )
        } else if (renewalError) {
          setError(
            'Ekki tókst að senda endurnýjunarbeiðni. Vinsamlegast reynið aftur síðar.',
          )
        }
      })
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
      <Box paddingY={[4, 4, 4, 8]} paddingX={[4, 4, 4, 12]}>
        <Box className={styles.closeButton}>
          <Button
            circle
            colorScheme="negative"
            icon="close"
            onClick={() => {
              closeModal()
            }}
            size="large"
          />
        </Box>
        <Box paddingRight={[3, 3, 3, 0]}>
          <Text variant="h3" marginBottom={[2, 2, 2, 5]}>
            {formatMessage(messages.renewalMedicineRequest)}
          </Text>
        </Box>
        <Text marginBottom={3}>
          {formatMessage(messages.renewalMedicineRequestText)}
        </Text>
        <Text variant="small" fontWeight="medium" marginBottom={1}>
          {formatMessage(messages.medicineInformation)}
        </Text>
        <Box>
          <GridContainer className={styles.grid}>
            <GridRow>
              {data.map((item, i) => (
                <GridColumn key={i} span={'12/12'}>
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
                        <Text variant="small">{item.value}</Text>
                      </GridColumn>
                    </GridRow>
                  </GridContainer>
                </GridColumn>
              ))}
            </GridRow>
            <GridRow>
              <GridColumn span={'12/12'}>
                <Box
                  display="flex"
                  flexDirection="row"
                  justifyContent="spaceBetween"
                  alignItems="center"
                  marginTop={5}
                >
                  <Button size="small" variant="ghost" onClick={closeModal}>
                    {formatMessage(m.buttonCancel)}
                  </Button>

                  <Button
                    size="small"
                    type="submit"
                    loading={loading}
                    disabled={loading}
                    onClick={() => submitForm()}
                  >
                    {formatMessage(messages.renew)}
                  </Button>
                </Box>
              </GridColumn>
              {error && (
                <GridColumn>
                  <Box>
                    <Text>{error}</Text>
                  </Box>
                </GridColumn>
              )}
            </GridRow>
          </GridContainer>
        </Box>
        {renewalError && !loading && <Problem />}
      </Box>
    </ModalBase>
  )
}

export default RenewPrescriptionModal
