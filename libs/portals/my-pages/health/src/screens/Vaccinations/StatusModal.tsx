import { HealthDirectorateVaccinationStatusEnum } from '@island.is/api/schema'
import { Stack } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Modal } from '@island.is/portals/my-pages/core'
import React from 'react'
import { messages } from '../../lib/messages'
import { tagSelector } from '../../utils/tagSelector'
import StatusModalItem from './StatusModalItem'

interface StatusModalProps {
  isOpen: boolean
  onClose: () => void
}

const StatusModal: React.FC<StatusModalProps> = ({ isOpen, onClose }) => {
  const { formatMessage } = useLocale()

  return (
    <Modal
      id="vaccinations-status-modal"
      isVisible={isOpen}
      title={formatMessage(messages.vaccinationStatusDesc)}
      onCloseModal={onClose}
      toggleClose={!isOpen}
      initialVisibility={false}
    >
      <Stack space={3}>
        <StatusModalItem
          text={formatMessage(messages.vaccineValidDesc)}
          tagLabel={formatMessage(messages.vaccineValid)}
          tagVariant={tagSelector(HealthDirectorateVaccinationStatusEnum.valid)}
        />
        <StatusModalItem
          text={formatMessage(messages.vaccineFinishedDesc)}
          tagLabel={formatMessage(messages.vaccineFinished)}
          tagVariant={tagSelector(
            HealthDirectorateVaccinationStatusEnum.complete,
          )}
        />
        <StatusModalItem
          text={formatMessage(messages.vaccineUnvaccinedDesc)}
          tagLabel={formatMessage(messages.vaccineUnvaccined)}
          tagVariant={tagSelector(
            HealthDirectorateVaccinationStatusEnum.unvaccinated,
          )}
        />
        <StatusModalItem
          text={formatMessage(messages.vaccineUnfinishedDesc)}
          tagLabel={formatMessage(messages.vaccineUnfinished)}
          tagVariant={tagSelector(
            HealthDirectorateVaccinationStatusEnum.incomplete,
          )}
        />
        <StatusModalItem
          text={formatMessage(messages.vaccineExpiredDesc)}
          tagLabel={formatMessage(messages.vaccineExpired)}
          tagVariant={tagSelector(
            HealthDirectorateVaccinationStatusEnum.expired,
          )}
        />
        <StatusModalItem
          text={formatMessage(messages.vaccineDeclinedDesc)}
          tagLabel={formatMessage(messages.vaccineDeclined)}
          tagVariant={tagSelector(
            HealthDirectorateVaccinationStatusEnum.rejected,
          )}
        />
        <StatusModalItem
          text={formatMessage(messages.vaccineUnregisteredDesc)}
          tagLabel={formatMessage(messages.vaccineUnregistered)}
          tagVariant={tagSelector(
            HealthDirectorateVaccinationStatusEnum.undocumented,
          )}
        />
        <StatusModalItem
          text={formatMessage(messages.vaccineUncertainDesc)}
          tagLabel={formatMessage(messages.vaccineUncertain)}
          tagVariant={tagSelector(
            HealthDirectorateVaccinationStatusEnum.undetermined,
          )}
        />
      </Stack>
    </Modal>
  )
}

export default StatusModal
