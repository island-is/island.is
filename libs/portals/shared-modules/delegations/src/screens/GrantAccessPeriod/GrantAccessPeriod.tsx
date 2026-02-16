import { IntroHeader } from '@island.is/portals/core'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { Box, DatePicker, RadioButton, Text } from '@island.is/island-ui/core'
import { useState } from 'react'
import { m as portalMessages } from '@island.is/portals/core'

import { DateScopesTable } from '../../components/ScopesTable/DateScopesTable'
import { useDelegationForm } from '../../context'
import { DelegationPaths } from '../../lib/paths'
import { useNavigate } from 'react-router-dom'
import { ConfirmAccessModal } from '../../components/modals/ConfirmAccessModal'
import { DelegationsFormFooter } from '../../components/delegations/DelegationsFormFooter'
import { useDynamicShadow } from '../../hooks/useDynamicShadow'

export const GrantAccessPeriod = () => {
  const { formatMessage, lang } = useLocale()
  const [isSamePeriod, setIsSamePeriod] = useState<boolean>(true)
  const navigate = useNavigate()
  const [isConfirmModalVisible, setIsConfirmModalVisible] =
    useState<boolean>(false)

  const { identities, selectedScopes, setSelectedScopes } = useDelegationForm()
  const { showShadow, pxProps } = useDynamicShadow({ rootMargin: '-112px' })

  const onValidityPeriodChange = (date: Date) => {
    setSelectedScopes(selectedScopes.map((s) => ({ ...s, validTo: date })))
  }

  // on mount, check if there are identities or scopes selected, if not, navigate to first step
  useEffect(() => {
    if (identities.length === 0 || selectedScopes.length === 0) {
      navigate(DelegationPaths.DelegationsGrantNew)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Box display="flex" flexDirection="column">
      <IntroHeader
        title={formatMessage(m.grantAccessStepsTitle)}
        intro={formatMessage(m.grantAccessStepsIntro)}
      />
      <Text variant="h4" marginBottom={4}>
        {formatMessage(m.accessPeriodTitle)}
      </Text>
      <Box display="flex" flexDirection="column" rowGap={2} marginBottom={4}>
        <RadioButton
          name="accessPeriodType"
          id="accessPeriodCombined"
          label={formatMessage(m.accessPeriodSame)}
          checked={isSamePeriod}
          onChange={() => setIsSamePeriod(true)}
        />
        <RadioButton
          name="accessPeriodType"
          id="accessPeriodSeparate"
          label={formatMessage(m.accessPeriodDifferent)}
          checked={!isSamePeriod}
          onChange={() => setIsSamePeriod(false)}
        />
      </Box>
      {isSamePeriod ? (
        <Box alignSelf="flexStart">
          <DatePicker
            id="validityPeriod"
            size="sm"
            label={formatMessage(portalMessages.date)}
            backgroundColor="blue"
            minDate={new Date()}
            selected={selectedScopes[0]?.validTo}
            locale={lang}
            handleChange={onValidityPeriodChange}
            placeholderText={formatMessage(portalMessages.chooseDate)}
          />
        </Box>
      ) : (
        <Box>
          <DateScopesTable />
        </Box>
      )}
      <Box position="sticky" bottom={0} marginTop={20}>
        <DelegationsFormFooter
          onCancel={() => navigate(DelegationPaths.Delegations)}
          onConfirm={() => {
            setIsConfirmModalVisible(true)
          }}
          confirmLabel={formatMessage(m.saveAccess)}
          showShadow={showShadow}
          confirmIcon="arrowForward"
        />
      </Box>
      <div {...pxProps} />
      <ConfirmAccessModal
        onClose={() => setIsConfirmModalVisible(false)}
        onConfirm={() => {
          console.log('confirm')
        }}
        isVisible={isConfirmModalVisible}
      />
    </Box>
  )
}
