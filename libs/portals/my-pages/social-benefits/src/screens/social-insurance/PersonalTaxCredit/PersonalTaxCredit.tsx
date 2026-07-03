import { Box, Button, Inline, Stack, Text } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  CardLoader,
  IntroWrapper,
  LinkButton,
  m as coreMessages,
  TRYGGINGASTOFNUN_SLUG,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import { m } from '../../../lib/messages'
import {
  useGetPersonalTaxCreditQuery,
  useGetPersonalTaxCreditSpouseInfoQuery,
} from './PersonalTaxCredit.generated'
import { PersonalTaxCreditForm } from './PersonalTaxCreditForm'
import { SpouseTaxCreditForm } from './SpouseTaxCreditForm'
import { PersonalTaxCreditTable } from './PersonalTaxCreditTable'
import { usePersonalTaxCreditForm } from './usePersonalTaxCreditForm'

const PersonalTaxCredit = () => {
  useNamespaces('sp.social-insurance-maintenance')
  const { formatMessage } = useLocale()

  const { data, loading, error } = useGetPersonalTaxCreditQuery({
    errorPolicy: 'all',
  })
  const { data: spouseInfoData } = useGetPersonalTaxCreditSpouseInfoQuery({
    errorPolicy: 'all',
  })

  const page = data?.socialInsurancePersonalTaxCredit
  const spouseInfo = spouseInfoData?.socialInsurancePersonalTaxCreditSpouseInfo
  const isAlreadyRegistered = page?.canEdit ?? false
  const hasRegistrations = !!page?.taxCards?.length

  const form = usePersonalTaxCreditForm()
  const { personalAction, spouseAction } = form

  // If personal form is standalone (not yet registered), bottom buttons handle both personal + spouse
  // If personal is edited via inline table row, bottom buttons handle spouse only
  const personalIsStandalone = !isAlreadyRegistered
  const showBottomButtons = personalIsStandalone
    ? personalAction !== null || spouseAction !== null
    : spouseAction !== null

  const isSpouseBlocked =
    (spouseAction === 'grant' &&
      (spouseInfo?.isDeceased === true ||
        (!spouseInfo?.name && !spouseInfo?.nationalId))) ||
    (spouseAction === 'deceased' &&
      (!!spouseInfo?.deceasedReasonNotAllowedCode ||
        !spouseInfo?.deceasedMonthsAndYears?.length))

  const handleBottomCancel = personalIsStandalone
    ? form.handleCancelAll
    : form.handleCancelSpouse
  const handleBottomSave = () => {
    if (personalIsStandalone && spouseAction !== null) {
      void form.handleSaveAll()
    } else if (personalIsStandalone) {
      void form.handleSavePersonal()
    } else {
      void form.handleSaveSpouse()
    }
  }
  const bottomDisabled = personalIsStandalone
    ? !form.canSubmitAll || form.savingAll || isSpouseBlocked
    : !form.canSubmitSpouse || form.savingSpouse || isSpouseBlocked
  const bottomLoading = personalIsStandalone
    ? form.savingAll
    : form.savingSpouse

  return (
    <IntroWrapper
      title={formatMessage(m.personalTaxCredit)}
      intro={formatMessage(m.personalTaxCreditDescription)}
      desktopContentSpan="10/12"
      serviceProvider={{
        slug: TRYGGINGASTOFNUN_SLUG,
        tooltip: formatMessage(coreMessages.socialInsuranceTooltip),
      }}
      buttonGroup={{
        actions: [
          <LinkButton
            key="my-info-settings"
            to="/min-gogn/stillingar/"
            text={formatMessage(coreMessages.userInfo)}
            variant="utility"
            icon="arrowForward"
            size="small"
          />,
        ],
      }}
    >
      {loading ? (
        <CardLoader />
      ) : error ? (
        <Problem error={error} noBorder={false} />
      ) : (
        <Stack space={6}>
          <Box>
            <Text variant="h4" marginBottom={3}>
              {formatMessage(m.myTaxCreditUsage)}
            </Text>

            {hasRegistrations && (
              <PersonalTaxCreditTable
                taxCards={page?.taxCards ?? []}
                renderExpandedRow={
                  isAlreadyRegistered
                    ? ({ close }) => (
                        <Box paddingY={4} paddingX={4} background="blue100">
                          <Stack space={3}>
                            <PersonalTaxCreditForm
                              form={form.personalForm}
                              monthsAndYears={page?.registrationMonthsAndYears}
                              discontinuingMonthsAndYears={
                                page?.discontinuingMonthsAndYears
                              }
                              isAlreadyRegistered={isAlreadyRegistered}
                              canDiscontinue={page?.canDiscontinue ?? false}
                            />
                            <Inline space={2}>
                              <Button
                                variant="primary"
                                colorScheme="negative"
                                size="small"
                                onClick={() => {
                                  form.handleCancelPersonal()
                                  close()
                                }}
                              >
                                {formatMessage(coreMessages.buttonCancel)}
                              </Button>
                              <Button
                                variant="primary"
                                size="small"
                                onClick={async () => {
                                  const saved = await form.handleSavePersonal()
                                  if (saved) close()
                                }}
                                disabled={
                                  !form.canSubmitPersonal || form.savingPersonal
                                }
                                loading={form.savingPersonal}
                              >
                                {formatMessage(coreMessages.submit)}
                              </Button>
                            </Inline>
                          </Stack>
                        </Box>
                      )
                    : undefined
                }
              />
            )}

            {!isAlreadyRegistered && (
              <Box marginTop={hasRegistrations ? 5 : 0}>
                <PersonalTaxCreditForm
                  form={form.personalForm}
                  monthsAndYears={page?.registrationMonthsAndYears}
                  discontinuingMonthsAndYears={
                    page?.discontinuingMonthsAndYears
                  }
                  isAlreadyRegistered={isAlreadyRegistered}
                  canDiscontinue={page?.canDiscontinue ?? false}
                />
              </Box>
            )}
          </Box>

          <Box>
            <Text variant="h4" marginBottom={2}>
              {formatMessage(m.spousePersonalTaxCredit)}
            </Text>
            <Text marginBottom={3}>
              {formatMessage(m.spousePersonalTaxCreditDescription)}
            </Text>

            <SpouseTaxCreditForm
              form={form.spouseForm}
              monthsAndYears={page?.registrationMonthsAndYears}
              deceasedMonthsAndYears={spouseInfo?.deceasedMonthsAndYears}
              deceasedReasonNotAllowedCode={
                spouseInfo?.deceasedReasonNotAllowedCode
              }
              spouseName={spouseInfo?.name}
              spouseNationalId={spouseInfo?.nationalId}
              spouseIsDeceased={spouseInfo?.isDeceased}
            />
          </Box>

          {showBottomButtons && (
            <Inline space={2} justifyContent="flexEnd">
              <Button variant="ghost" size="small" onClick={handleBottomCancel}>
                {formatMessage(coreMessages.buttonCancel)}
              </Button>
              <Button
                size="small"
                onClick={handleBottomSave}
                disabled={bottomDisabled}
                loading={bottomLoading}
              >
                {formatMessage(coreMessages.submit)}
              </Button>
            </Inline>
          )}
        </Stack>
      )}
    </IntroWrapper>
  )
}

export default PersonalTaxCredit
