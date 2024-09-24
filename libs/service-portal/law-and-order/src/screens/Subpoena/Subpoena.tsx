import {
  AlertMessage,
  Box,
  Button,
  Divider,
  GridColumn,
  GridContainer,
  GridRow,
  Text,
} from '@island.is/island-ui/core'
import {
  DOMSMALARADUNEYTID_SLUG,
  InfoLine,
  IntroHeader,
  LinkResolver,
  m,
  Modal,
  UserInfoLine,
} from '@island.is/service-portal/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { isDefined } from '@island.is/shared/utils'
import { Problem } from '@island.is/react-spa/shared'
import { useParams } from 'react-router-dom'
import { useState } from 'react'
import InfoLines from '../../components/InfoLines/InfoLines'
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

  // TODO - Uncomment when the feature is ready
  // if (
  //   subpoena?.data &&
  //   (!isDefined(subpoena.data.acknowledged) ||
  //     subpoena.data.acknowledged === false)
  // ) {
  //   return <Navigate to={LawAndOrderPaths.CourtCaseDetail.replace(':id', id)} />
  // }

  return (
    <>
      <IntroHeader
        loading={loading}
        title={formatMessage(messages.subpoena)}
        serviceProviderSlug={DOMSMALARADUNEYTID_SLUG}
        serviceProviderTooltip={formatMessage(m.domsmalaraduneytidTooltip)}
      />
      {!loading && subpoena?.data?.alerts && (
        <GridContainer>
          <GridRow>
            {subpoena.data.alerts.map((alert, index) => (
              <GridColumn span="10/12" key={`alert-message-${index}`}>
                <AlertMessage type="success" message={alert.message} />
              </GridColumn>
            ))}
          </GridRow>
        </GridContainer>
      )}
      <Box marginBottom={3} display="flex" flexWrap="wrap">
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

      {subpoena?.data?.groups && subpoena.data.groups.length > 0 && (
        <>
          <InfoLines groups={subpoena.data.groups} loading={loading} />
          {isDefined(subpoena?.data.defenderChoice) && (
            <>
              <Box paddingTop={1} />
              <InfoLine
                loading={loading}
                label={messages.chooseDefenderTitle}
                content={subpoena.data.chosenDefender ?? ''}
                labelColumnSpan={['1/1', '6/12']}
                valueColumnSpan={['1/1', '4/12']}
                buttonColumnSpan={['2/12']}
                button={{
                  type: 'action',
                  variant: 'text',
                  label: messages.change,
                  icon: 'pencil',
                  action: () => {
                    setDefenderPopUp(true)
                  },
                }}
              />
              <Box paddingBottom={1} />
              <Divider />
            </>
          )}
          <Box paddingRight={[0, 0, 24]} marginTop={5}>
            <Text marginBottom={2}>
              {formatMessage(messages.subpoenaInfoText)}
            </Text>
            <Text>{formatMessage(messages.subpoenaInfoText2)}</Text>
          </Box>

          {!loading && !subpoena?.data.defenderChoice && (
            <DefenderChoices id={id} refetch={refetch} />
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
      {!loading && !error && data?.lawAndOrderSubpoena === null && (
        <Problem
          type="no_data"
          noBorder={false}
          title={formatMessage(m.noData)}
          message={formatMessage(m.noDataFoundDetail)}
          imgSrc="./assets/images/sofa.svg"
        />
      )}
    </>
  )
}

export default Subpoena
