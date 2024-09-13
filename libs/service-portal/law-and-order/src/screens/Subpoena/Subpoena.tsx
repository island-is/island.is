import {
  AlertMessage,
  Box,
  Divider,
  GridColumn,
  GridContainer,
  GridRow,
  Text,
} from '@island.is/island-ui/core'
import {
  DOMSMALARADUNEYTID_SLUG,
  IntroHeader,
  m,
  Modal,
  UserInfoLine,
} from '@island.is/service-portal/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { isDefined } from '@island.is/shared/utils'
import { Problem } from '@island.is/react-spa/shared'
import { Navigate, useParams } from 'react-router-dom'
import { useState } from 'react'
import InfoLines from '../../components/InfoLines/InfoLines'
import DefenderChoices from '../../components/DefenderChoices/DefenderChoices'
import { useGetSubpoenaQuery } from './Subpoena.generated'
import { LawAndOrderPaths } from '../../lib/paths'
import { DefenseChoices } from '../../lib/const'
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
        locale: lang,
      },
    },
  })

  const subpoena = data?.lawAndOrderSubpoena
  const [defenderPopUp, setDefenderPopUp] = useState<boolean>(false)

  if (
    subpoena?.data &&
    (!isDefined(subpoena.data.acknowledged) ||
      subpoena.data.acknowledged === false)
  ) {
    return <Navigate to={LawAndOrderPaths.CourtCaseDetail.replace(':id', id)} />
  }

  return (
    <>
      <IntroHeader
        loading={loading}
        title={formatMessage(messages.subpoena)}
        intro={subpoena?.texts?.intro ?? undefined}
        serviceProviderSlug={DOMSMALARADUNEYTID_SLUG}
        serviceProviderTooltip={formatMessage(m.domsmalaraduneytidTooltip)}
      />
      {!loading && subpoena?.texts?.confirmation && (
        <GridContainer>
          <GridRow>
            <GridColumn span="10/12">
              <AlertMessage
                type="success"
                message={subpoena.texts.confirmation}
              />
            </GridColumn>
          </GridRow>
        </GridContainer>
      )}
      {error && !loading && <Problem error={error} noBorder={false} />}

      {subpoena?.data?.groups && subpoena.data.groups.length > 0 && (
        <>
          <InfoLines groups={subpoena.data.groups} loading={loading} />
          {isDefined(subpoena?.data.defenderChoice) && (
            <>
              <Box paddingTop={1} />
              <UserInfoLine
                loading={loading}
                label={messages.chooseDefenderTitle}
                content={[
                  formatMessage(
                    DefenseChoices[subpoena.data.defenderChoice].message,
                  ),
                  subpoena.data.chosenDefender,
                ]
                  .filter(Boolean)
                  .join(', ')}
                labelColumnSpan={['1/1', '6/12']}
                valueColumnSpan={['1/1', '4/12']}
                editColumnSpan={['2/12']}
                button={{
                  title: messages.change,
                  onClick: () => {
                    setDefenderPopUp(true)
                  },
                }}
              />
              <Box paddingBottom={1} />
              <Divider />
            </>
          )}

          {subpoena.texts && (
            <GridRow>
              <GridColumn span={['8/8', '8/8', '6/8']} paddingTop={5}>
                <Text>{subpoena?.texts?.description}</Text>
              </GridColumn>
            </GridRow>
          )}

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
