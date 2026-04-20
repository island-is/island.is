import {
  AlertMessage,
  Box,
  Button,
  Divider,
  SkeletonLoader,
  Text,
} from '@island.is/island-ui/core'
import {
  DOMSMALARADUNEYTID_SLUG,
  InfoLine,
  IntroWrapper,
  LinkResolver,
  m,
  Modal,
} from '@island.is/portals/my-pages/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { isDefined } from '@island.is/shared/utils'
import { Problem } from '@island.is/react-spa/shared'
import { Navigate, useParams } from 'react-router-dom'
import { useState } from 'react'
import InfoLines from '../../components/VerdictInfoLines/VerdictInfoLines'
import DefenderChoices from '../../components/DefenderChoices/DefenderChoices'
import { useGetSubpoenaQuery } from './Subpoena.generated'
import { LawAndOrderPaths } from '../../lib/paths'
import { messages } from '../../lib/messages'

type UseParams = {
  id: string
}

const Subpoena = () => {
  useNamespaces('sp.law-and-order')
  const { formatMessage, lang } = useLocale()
  const { id } = useParams() as UseParams

  const { data, error, loading, refetch } = useGetSubpoenaQuery({
    variables: {
      input: {
        id,
      },
      locale: lang,
    },
  })

  const subpoena = data?.lawAndOrderSubpoena

  const [defenderPopUp, setDefenderPopUp] = useState<boolean>(false)

  if (
    subpoena?.data &&
    (!isDefined(subpoena.data.hasBeenServed) ||
      subpoena.data.hasBeenServed === false)
  ) {
    return <Navigate to={LawAndOrderPaths.CourtCaseDetail.replace(':id', id)} />
  }

  return (
    <IntroWrapper
      loading={loading}
      title={formatMessage(messages.subpoena)}
      intro={subpoena?.texts?.description ?? ''}
      serviceProviderSlug={DOMSMALARADUNEYTID_SLUG}
      serviceProviderTooltip={formatMessage(m.domsmalaraduneytidTooltip)}
    >
      {!loading && subpoena?.texts?.confirmation && (
        <Box marginTop={4}>
          <AlertMessage type="success" message={subpoena.texts.confirmation} />
        </Box>
      )}

      {loading && <SkeletonLoader space={2} repeat={4} height={24} />}
      <Box marginTop={3} display="flex" flexWrap="wrap">
        {!loading && subpoena?.data && (
          <Box paddingRight={2} marginBottom={[1]}>
            <LinkResolver
              href={LawAndOrderPaths.CourtCaseDetail.replace(
                ':id',
                id?.toString(),
              )}
            >
              <Button
                as="span"
                unfocusable
                colorScheme="default"
                preTextIcon="arrowBack"
                preTextIconType="outline"
                size="default"
                variant="utility"
              >
                {formatMessage(messages.goBackToCourtCase)}
              </Button>
            </LinkResolver>
          </Box>
        )}
      </Box>

      {error && !loading && <Problem error={error} noBorder={false} />}

      {subpoena?.data?.groups?.length && (
        <>
          <InfoLines groups={subpoena.data.groups} loading={loading} />
          {subpoena.data.hasChosen && isDefined(subpoena?.data.defenderChoice) && (
            <>
              <Box paddingTop={1} />
              <InfoLine
                loading={loading}
                label={messages.chooseDefenderTitle}
                content={subpoena.data.chosenDefender ?? ''}
                button={{
                  type: 'action',
                  variant: 'text',
                  label: messages.change,
                  icon: subpoena.data.canEditDefenderChoice
                    ? 'pencil'
                    : undefined,
                  action: () => {
                    setDefenderPopUp(true)
                  },
                  disabled: subpoena.data.canEditDefenderChoice === false,
                  tooltip: subpoena.data.canEditDefenderChoice
                    ? undefined
                    : subpoena.data.courtContactInfo ?? '',
                }}
              />
              <Box paddingBottom={1} />
              <Divider />
            </>
          )}
          <Box paddingRight={[0, 0, 24]} marginTop={5}>
            <Text marginBottom={2}>
              {subpoena.texts?.information ??
                formatMessage(messages.subpoenaInfoText)}
            </Text>
            <Text>
              {subpoena.texts?.deadline ??
                formatMessage(messages.subpoenaInfoText2)}
            </Text>
          </Box>

          {!loading && subpoena.data.hasChosen === false && (
            <DefenderChoices
              id={id}
              refetch={refetch}
              choice={subpoena.data.defaultChoice}
            />
          )}

          {defenderPopUp && (
            <Modal
              id="defender-pop-up"
              onCloseModal={() => setDefenderPopUp(false)}
            >
              <DefenderChoices
                popUp={{ setPopUp: setDefenderPopUp }}
                id={id}
                refetch={refetch}
                choice={subpoena.data.defenderChoice}
              />
            </Modal>
          )}
        </>
      )}
      {!loading && !error && subpoena === null && (
        <Problem
          type="no_data"
          noBorder={false}
          title={formatMessage(m.noData)}
          message={formatMessage(m.noDataFoundDetail)}
          imgSrc="./assets/images/sofa.svg"
        />
      )}
    </IntroWrapper>
  )
}

export default Subpoena
