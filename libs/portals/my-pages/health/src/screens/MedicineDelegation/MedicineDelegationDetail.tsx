import { toast } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  HEALTH_DIRECTORATE_SLUG,
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

const MedicineDelegationDetail = () => {
  const { formatMessage, lang } = useLocale()
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [modalVisible, setModalVisible] = useState(false)

  const { data, loading, error } = useGetMedicineDelegationsQuery({
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
    useDeleteMedicineDelegationMutation({
      refetchQueries: ['GetMedicineDelegations'],
    })

  const filteredData = data?.healthDirectorateMedicineDelegations?.items?.find(
    (item) => item.nationalId === id,
  )

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
      .then((response) => {
        if (response.data?.healthDirectorateMedicineDelegationDelete.success) {
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
      serviceProviderSlug={HEALTH_DIRECTORATE_SLUG}
      serviceProviderTooltip={formatMessage(
        messages.landlaeknirMedicineDelegationTooltip,
      )}
      loading={loading}
    >
      {!loading && !error && !filteredData && <Problem type="no_data" />}
      <InfoLineStack label={formatMessage(m.info)} space={1}>
        <InfoLine
          label={formatMessage(messages.nameHuman)}
          content={filteredData?.name ?? ''}
          loading={loading}
        />
        <InfoLine
          loading={loading}
          label={formatMessage(m.natreg)}
          content={kennitala.format(filteredData?.nationalId ?? '')}
        />
        <InfoLine
          loading={loading}
          label={formatMessage(messages.status)}
          content={
            filteredData?.isActive
              ? formatMessage(messages.valid)
              : formatMessage(messages.invalid)
          }
        />
        <InfoLine
          loading={loading}
          label={formatMessage(messages.validityPeriod)}
          content={
            filteredData?.dates?.from && filteredData?.dates?.to
              ? formatDate(filteredData?.dates?.from) +
                ' - ' +
                formatDate(filteredData?.dates?.to)
              : ''
          }
          button={
            filteredData?.isActive
              ? {
                  type: 'action',
                  label: formatMessage(messages.deleteDelegation),
                  action: () => setModalVisible(true),
                  variant: 'text',
                  icon: 'trash',
                }
              : undefined
          }
        />
        <InfoLine
          loading={loading}
          label={formatMessage(messages.permitValidForShort)}
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
          loading={deleteLoading}
        />
      )}
    </IntroWrapper>
  )
}

export default MedicineDelegationDetail
