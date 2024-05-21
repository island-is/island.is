import {
  AlertMessage,
  Box,
  Divider,
  GridColumn,
  GridContainer,
  Text,
} from '@island.is/island-ui/core'
import {
  DOMSMALARADUNEYTID_SLUG,
  ErrorScreen,
  IntroHeader,
  m,
  Modal,
  NotFound,
  UserInfoLine,
} from '@island.is/service-portal/core'
import { messages } from '../../lib/messages'
import { useLocale, useNamespaces } from '@island.is/localization'
import { getSubpeona } from '../../helpers/mockData'
import { useParams } from 'react-router-dom'
import InfoLines from '../../components/InfoLines/InfoLines'
import DefenderChoices from '../../components/DefenderChoices/DefenderChoices'
import { useState } from 'react'
import ConfirmationModal from '../../components/ConfirmationModal/ConfirmationModal'
import { useLawAndOrderContext } from '../../helpers/LawAndOrderContext'
import CourtCaseDetail from '../CourtCaseDetail/CourtCaseDetail'
import { DefenseDecision } from '../../lib/const'

type UseParams = {
  id: string
}

const Subpeona = () => {
  useNamespaces('sp.law-and-order')
  const { formatMessage } = useLocale()
  const { id } = useParams() as UseParams
  const { data, loading, error } = getSubpeona(parseInt(id))
  const noInfo = data?.subpeonaDetail === null
  const subpeona = data?.subpeonaDetail
  const [defenderPopUp, setDefenderPopUp] = useState<boolean>(false)
  const { subpeonaAcknowledged, defenseChoice, lawyerSelected } =
    useLawAndOrderContext()

  if (error && !loading) {
    return (
      <ErrorScreen
        figure="./assets/images/hourglass.svg"
        tagVariant="red"
        tag={formatMessage(m.errorTitle)}
        title={formatMessage(m.somethingWrong)}
        children={formatMessage(m.errorFetchModule, {
          module: formatMessage(messages.subpoena).toLowerCase(),
        })}
      />
    )
  }

  if (noInfo && !loading) {
    return <NotFound title={formatMessage(messages.subpoenaNotFound)} />
  }

  if (typeof subpeonaAcknowledged === 'undefined') {
    return <ConfirmationModal id={subpeona?.data.id.toString()} />
  }

  if (subpeonaAcknowledged === false) {
    return <CourtCaseDetail />
  }

  return (
    <>
      <IntroHeader
        title={formatMessage(messages.subpoena)}
        intro={subpeona?.texts?.intro}
        serviceProviderSlug={DOMSMALARADUNEYTID_SLUG}
        serviceProviderTooltip={formatMessage(m.domsmalaraduneytidTooltip)}
      />
      {subpeonaAcknowledged && (
        <GridContainer>
          <GridColumn span="10/12">
            <AlertMessage
              type="success"
              message={subpeona?.texts?.confirmation}
            />
          </GridColumn>
        </GridContainer>
      )}
      {subpeona?.data.groups && (
        <InfoLines groups={subpeona?.data.groups} loading={loading} />
      )}
      {(subpeona?.data?.chosenDefender || lawyerSelected || defenseChoice) && (
        <>
          <Box paddingTop={1} />
          <UserInfoLine
            loading={loading}
            label={messages.defenseAttorney}
            content={
              subpeona?.data?.chosenDefender ?? lawyerSelected ?? defenseChoice
            }
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

      <GridColumn span={['8/8', '8/8', '6/8']} paddingTop={5}>
        <Text>{subpeona?.texts?.description}</Text>
      </GridColumn>
      {!subpeona?.data.chosenDefender && !defenseChoice && <DefenderChoices />}

      {defenderPopUp && (
        <Modal
          id="defender-pop-up"
          onCloseModal={() => setDefenderPopUp(false)}
        >
          <DefenderChoices popUp={{ setPopUp: setDefenderPopUp }} />
        </Modal>
      )}
    </>
  )
}

export default Subpeona
