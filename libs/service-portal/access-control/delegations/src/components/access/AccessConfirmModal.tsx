import { AuthCustomDelegation } from '@island.is/api/schema'
import { useAuth } from '@island.is/auth/react'
import {
  AlertBanner,
  Box,
  GridRow,
  GridColumn,
  Text,
  useBreakpoint,
  Divider,
} from '@island.is/island-ui/core'
import { m } from '@island.is/service-portal/core'
import { useLocale } from '@island.is/localization'
import { formatNationalId } from '@island.is/service-portal/core'
import { useState } from 'react'
import format from 'date-fns/format'
import { DATE_FORMAT } from './AccessItem'
import { AccessItemHeader } from './AccessItemHeader'
import { DelegationsFormFooter } from '../delegations/DelegationsFormFooter'
import { Modal, ModalProps } from '../Modal/Modal'
import { IdentityCard } from '../IdentityCard/IdentityCard'
import type { MappedScope } from './access.types'
import * as accessItemStyles from './AccessItem.css'
import * as commonAccessStyles from './access.css'
import { isDefined } from '@island.is/shared/utils'

type AccessConfirmModalProps = Pick<ModalProps, 'onClose' | 'isVisible'> & {
  delegation: AuthCustomDelegation
  scopes?: MappedScope[]
  validityPeriod: Date | null
  loading: boolean
  error?: boolean
  onConfirm(): Promise<void>
}

export const AccessConfirmModal = ({
  delegation,
  onClose,
  onConfirm,
  scopes,
  validityPeriod,
  loading,
  error: formError,
  ...rest
}: AccessConfirmModalProps) => {
  const { formatMessage } = useLocale()
  const { userInfo } = useAuth()
  const [error, setError] = useState(formError ?? false)
  const { md } = useBreakpoint()

  const onConfirmHandler = async () => {
    if (!delegation.id || !scopes) {
      setError(true)
      return
    }

    onConfirm()
  }

  if (isDefined(formError) && formError !== error) {
    setError(formError)
  }

  const toName = delegation?.to?.name
  const toNationalId = delegation?.to?.nationalId
  const fromName = userInfo?.profile.name
  const fromNationalId = userInfo?.profile.nationalId

  return (
    <Modal
      id={`access-confirm-modal-${delegation?.id}`}
      label={formatMessage(m.accessControl)}
      title={formatMessage({
        id: 'sp.settings-access-control:access-confirm-modal-title',
        defaultMessage: 'Þú ert að veita aðgang',
      })}
      {...rest}
      onClose={onClose}
      noPaddingBottom
    >
      <Box marginY={[4, 4, 8]} display="flex" flexDirection="column" rowGap={3}>
        {error && (
          <Box paddingBottom={3}>
            <AlertBanner
              description={formatMessage({
                id: 'sp.access-control-delegations:confirm-error',
                defaultMessage:
                  'Ekki tókst að vista réttindi. Vinsamlegast reyndu aftur',
              })}
              variant="error"
            />
          </Box>
        )}
        <Box
          width="full"
          display="flex"
          flexDirection={['column', 'column', 'column', 'row']}
          rowGap={[3, 3, 3, 0]}
          columnGap={[0, 0, 0, 3]}
        >
          {fromName && fromNationalId && (
            <IdentityCard
              label={formatMessage({
                id: 'sp.access-control-delegations:delegation-to',
                defaultMessage: 'Aðgangsveitandi',
              })}
              title={fromName}
              description={formatNationalId(fromNationalId)}
              color="blue"
            />
          )}
          {toName && toNationalId && (
            <IdentityCard
              label={formatMessage({
                id: 'sp.access-control-delegations:access-holder',
                defaultMessage: 'Aðgangshafi',
              })}
              title={toName}
              description={formatNationalId(toNationalId)}
              color="purple"
            />
          )}
        </Box>
        {delegation.domain && (
          <IdentityCard
            label={formatMessage({
              id: 'sp.access-control-delegations:domain',
              defaultMessage: 'Kerfi',
            })}
            title={delegation.domain.displayName}
            imgSrc={delegation.domain.organisationLogoUrl}
          />
        )}
      </Box>
      <Box display="flex" flexDirection="column" rowGap={3} marginTop={6}>
        <Box display="flex" alignItems="center" justifyContent="spaceBetween">
          <Text variant="h4" as="h4">
            {formatMessage({
              id: 'sp.access-control-delegations:access-title',
              defaultMessage: 'Réttindi',
            })}
          </Text>
          {validityPeriod && (
            <Box display="flex" flexDirection="column" alignItems="flexEnd">
              <Text variant="small">
                {formatMessage({
                  id:
                    'sp.settings-access-control:access-item-datepicker-label-mobile',
                  defaultMessage: 'Í gildi til',
                })}
              </Text>
              <Text fontWeight="semiBold">
                {format(validityPeriod, DATE_FORMAT)}
              </Text>
            </Box>
          )}
        </Box>
        <Box
          marginBottom={[0, 0, 12]}
          className={commonAccessStyles.resetMarginGutter}
        >
          <AccessItemHeader hideValidityPeriod={!!validityPeriod} />
          <Box className={accessItemStyles.dividerContainer}>
            <Divider />
          </Box>
          {scopes?.map(
            (scope, index) =>
              scope?.displayName && (
                <div key={index}>
                  <GridRow className={accessItemStyles.row} key={index}>
                    <GridColumn
                      span={['12/12', '12/12', '3/12']}
                      className={accessItemStyles.item}
                    >
                      <Text fontWeight="light">{scope?.displayName}</Text>
                    </GridColumn>
                    {((!md && scope?.description?.trim()) || md) && (
                      <GridColumn
                        span={['12/12', '12/12', '4/12', '5/12']}
                        className={accessItemStyles.item}
                        paddingTop={[3, 3, 3, 0]}
                      >
                        <Box
                          display="flex"
                          flexDirection="column"
                          className={accessItemStyles.rowGap}
                        >
                          {!md && (
                            <Text variant="small" fontWeight="semiBold">
                              {formatMessage({
                                id: 'sp.access-control-delegations:grant',
                                defaultMessage: 'Heimild',
                              })}
                            </Text>
                          )}
                          <Text variant="small" fontWeight="light">
                            {scope?.description}
                          </Text>
                        </Box>
                      </GridColumn>
                    )}
                    {!validityPeriod && scope?.validTo && (
                      <GridColumn
                        span={['12/12', '8/12', '5/12', '4/12']}
                        paddingTop={[2, 2, 2, 0]}
                      >
                        <Text variant="small">
                          {format(new Date(scope?.validTo), DATE_FORMAT)}
                        </Text>
                      </GridColumn>
                    )}
                  </GridRow>
                  <Box className={accessItemStyles.dividerContainer}>
                    <Divider />
                  </Box>
                </div>
              ),
          )}
        </Box>
      </Box>
      <Box position="sticky" bottom={0}>
        <DelegationsFormFooter
          loading={loading}
          onCancel={onClose}
          onConfirm={onConfirmHandler}
          confirmLabel={formatMessage(m.codeConfirmation)}
          confirmIcon="checkmark"
          containerPaddingBottom={[3, 3, 6]}
        />
      </Box>
    </Modal>
  )
}
