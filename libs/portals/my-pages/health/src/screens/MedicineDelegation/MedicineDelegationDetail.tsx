import { HealthDirectoratePermitStatus } from '@island.is/api/schema'
import { toast } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  STAFRAEN_HEILSA_SLUG,
  InfoLine,
  InfoLineStack,
  IntroWrapper,
  formatDate,
  m,
} from '@island.is/portals/my-pages/core'
import * as kennitala from 'kennitala'

import { Problem } from '@island.is/react-spa/shared'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { messages } from '../../lib/messages'
import { HealthPaths } from '../../lib/paths'
import DelegationModal from './components/DelegationModal'
import {
  useDeleteMedicineDelegationMutation,
  useGetMedicineDelegationsQuery,
} from './MedicineDelegation.generated'
import { permitTagSelector } from '../../utils/tagSelector'
import { useHealthPlausibleSwap } from '../../utils/useHealthPlausibleSwap'

const MedicineDelegationDetail = () => {
  const { formatMessage, lang } = useLocale()
  useHealthPlausibleSwap()
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [modalVisible, setModalVisible] = useState(false)
  const [refetching, setRefetching] = useState(false)

  const { data, loading, error, refetch } = useGetMedicineDelegationsQuery({
    variables: {
      locale: lang,
      input: {
        status: [
          'active',
          'expired',
          'inactive',
          'unknown',
          'awaitingApproval',
        ],
      },
    },
  })

  const [deleteMedicineDelegation, { loading: deleteLoading }] =
    useDeleteMedicineDelegationMutation()

  const filteredData = data?.healthDirectorateMedicineDelegations?.items?.find(
    (item) => item.nationalId === id,
  )

  const canDelete =
    filteredData?.status === HealthDirectoratePermitStatus.active ||
    filteredData?.status === HealthDirectoratePermitStatus.awaitingApproval

  const onSubmit = () => {
    deleteMedicineDelegation({
      variables: {
        input: {
          nationalId: filteredData?.nationalId || '',
          lookup: filteredData?.lookup,
          from: filteredData?.dates?.from,
          to: filteredData?.dates?.to,
        },
      },
    })
      .then(async (response) => {
        if (response.data?.healthDirectorateMedicineDelegationDelete.success) {
          // Refresh the list before navigating so the overview is up to date.
          // A failed refetch must not be reported as a failed deletion.
          setRefetching(true)
          await refetch().catch(() => undefined)
          setRefetching(false)
          toast.success(formatMessage(messages.permitDeleted))
          setModalVisible(false)
          navigate(HealthPaths.HealthMedicineDelegation, { replace: true })
        } else {
          toast.error(formatMessage(messages.permitDeletedError))
        }
      })
      .catch(() => {
        toast.error(formatMessage(messages.permitDeletedError))
      })
  }

  return (
    <IntroWrapper
      title={formatMessage(messages.medicineDelegation)}
      intro={formatMessage(messages.medicineDelegationIntroText)}
      serviceProvider={{
        slug: STAFRAEN_HEILSA_SLUG,
        tooltip: formatMessage(
          messages.stafraenHeilsaMedicineDelegationTooltip,
        ),
      }}
      loading={loading}
      desktopContentSpan="10/12"
    >
      {!loading && !error && !filteredData && <Problem type="no_data" />}
      <InfoLineStack label={m.info} space={1}>
        <InfoLine
          label={messages.nameHuman}
          content={filteredData?.name ?? ''}
          loading={loading}
        />
        <InfoLine
          loading={loading}
          label={m.natreg}
          content={kennitala.format(filteredData?.nationalId ?? '')}
        />
        <InfoLine
          loading={loading}
          label={messages.status}
          content={
            filteredData?.status
              ? permitTagSelector(filteredData.status, formatMessage).label
              : ''
          }
        />
        <InfoLine
          loading={loading}
          label={messages.validityPeriod}
          content={
            filteredData?.dates?.from && filteredData?.dates?.to
              ? formatDate(filteredData?.dates?.from) +
                ' - ' +
                formatDate(filteredData?.dates?.to)
              : ''
          }
          button={
            canDelete
              ? {
                  type: 'action',
                  label: messages.deleteDelegation,
                  action: () => setModalVisible(true),
                  variant: 'text',
                  icon: 'trash',
                }
              : undefined
          }
        />
        <InfoLine
          loading={loading}
          label={messages.permitValidForShort}
          content={
            filteredData?.lookup
              ? formatMessage(messages.pickupMedicineAndLookup)
              : formatMessage(messages.pickupMedicine)
          }
        />
      </InfoLineStack>

      {filteredData?.nationalId && (
        <DelegationModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSubmit={onSubmit}
          id={filteredData?.nationalId}
          activeDelegation={filteredData}
          loading={deleteLoading || refetching}
        />
      )}
    </IntroWrapper>
  )
}

export default MedicineDelegationDetail
