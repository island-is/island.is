import {
  AlertMessage,
  Box,
  Button,
  GridColumn,
  GridContainer,
  GridRow,
  ModalBase,
  Select,
  Text,
  toast,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '@island.is/portals/my-pages/core'
import cn from 'classnames'
import React, { useState, useEffect } from 'react'
import { messages } from '../../../../lib/messages'
import { PrescriptionItem } from '../../../../utils/types'
import {
  useGetPrescriptionRenewalTargetsLazyQuery,
  usePostPrescriptionRenewalMutation,
} from '../../Prescriptions.generated'
import * as styles from './RenewPrescriptionModal.css'

interface Props {
  id: string
  activePrescription: PrescriptionItem
  toggleClose?: boolean
  isVisible: boolean
  setVisible: (isVisible: boolean) => void
  setActivePrescription: (prescription: PrescriptionItem | null) => void
}

const RenewPrescriptionModal: React.FC<Props> = ({
  activePrescription,
  toggleClose,
  isVisible,
  setVisible,
  setActivePrescription,
}) => {
  const { formatMessage } = useLocale()
  const columnWidth = '7/12'
  const titleWidth = '5/12'
  const modulusCalculations = (index: number) => {
    return index % 2 === 0
  }
  const [modalVisible, setModalVisible] = useState<boolean>(isVisible ?? false)
  const [selectedTarget, setSelectedTarget] = useState<{
    nodeId: string
    groupId: number
  } | null>(null)

  useEffect(() => {
    setModalVisible(isVisible)
  }, [isVisible])

  const [fetchTargets, { data: targetsData, loading: targetsLoading, called: targetsCalled }] =
    useGetPrescriptionRenewalTargetsLazyQuery({ fetchPolicy: 'network-only' })

  useEffect(() => {
    if (isVisible && activePrescription.id) {
      fetchTargets({ variables: { prescriptionId: activePrescription.id } })
    }
  }, [isVisible, activePrescription.id, fetchTargets])

  const targets = targetsData?.healthDirectoratePrescriptionRenewalTargets ?? []
  const targetOptions = targets.map((t) => ({
    label: t.name,
    value: `${t.groupId}:${t.nodeId}`,
  }))
  const selectedOption =
    selectedTarget !== null
      ? targetOptions.find(
          (o) =>
            o.value === `${selectedTarget.groupId}:${selectedTarget.nodeId}`,
        ) ?? null
      : targetOptions[0] ?? null

  const [postRenewal, { loading }] = usePostPrescriptionRenewalMutation({
    refetchQueries: ['GetMedicinePrescriptions'],
  })

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
    setSelectedTarget(null)
  }

  const submitForm = async () => {
    if (activePrescription.id == null) {
      toast.error(formatMessage(messages.renewalInvalidPrescription))
      return
    }

    const active =
      selectedTarget ??
      (targets[0]
        ? { nodeId: targets[0].nodeId, groupId: targets[0].groupId }
        : null)

    try {
      const data = await postRenewal({
        variables: {
          input: {
            id: activePrescription.id,
            ...(active
              ? { nodeId: active.nodeId, groupId: active.groupId }
              : {}),
          },
        },
      })
      if (data) {
        closeModal()
        toast.success(formatMessage(messages.renewalRequestSent))
      }
    } catch (error) {
      const errorMessage = formatMessage(messages.renewalRequestError)
      toast.error(errorMessage)
    }
  }

  return (
    <ModalBase
      baseId={'renewPrescriptionModal'}
      isVisible={modalVisible}
      initialVisibility={false}
      onVisibilityChange={(visibility) => {
        if (!visibility) {
          closeModal()
        }
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
        {targetOptions.length > 0 && (
          <Box marginBottom={3}>
            <Select
              name="renewalTarget"
              label={formatMessage(messages.renewalSendTo)}
              options={targetOptions}
              value={selectedOption}
              onChange={(opt) => {
                if (!opt) return
                const [groupId, nodeId] = opt.value.split(':')
                setSelectedTarget({ nodeId, groupId: Number(groupId) })
              }}
              backgroundColor="blue"
            />
          </Box>
        )}
        {!targetsLoading && targetsCalled && targetOptions.length === 0 && (
          <Box marginBottom={3}>
            <AlertMessage
              type="warning"
              message={formatMessage(messages.renewalNoTarget)}
            />
          </Box>
        )}
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
                    disabled={loading || (!targetsLoading && targetsCalled && targetOptions.length === 0)}
                    onClick={() => submitForm()}
                  >
                    {formatMessage(messages.renew)}
                  </Button>
                </Box>
              </GridColumn>
            </GridRow>
          </GridContainer>
        </Box>
      </Box>
    </ModalBase>
  )
}

export default RenewPrescriptionModal
