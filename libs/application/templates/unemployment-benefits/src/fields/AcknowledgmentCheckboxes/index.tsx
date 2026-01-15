import { FieldBaseProps } from '@island.is/application/types'
import { useLocale } from '@island.is/localization'
import { FC } from 'react'

import {
  applicant as applicantMessages,
  employment as employmentMessages,
  payout as payoutMessages,
  employmentSearch as employmentSearchMessages,
  externalData,
} from '../../lib/messages'
import { useMutation } from '@apollo/client'
import { UPDATE_APPLICATION } from '@island.is/application/graphql'

export const AcknowledgementChecksUpdate: FC<
  React.PropsWithChildren<FieldBaseProps>
> = ({ application, setBeforeSubmitCallback }) => {
  const { formatMessage, locale } = useLocale()
  const [updateApplication] = useMutation(UPDATE_APPLICATION)

  //Gagnaöflun
  const dataCollectionAcknowledgement = `${formatMessage(
    externalData.vmst.rskSubTitle,
  )} - ${formatMessage(externalData.vmst.insuranceSubTitle)}`

  //Tilkynna þarf breytingar
  const notifyChangesAcknowledgement = formatMessage(
    applicantMessages.informationChangeAgreement.pageDescription,
  )

  //Réttindi og skyldur á meðan þú ert í atvinnuleit
  const rightsAndObligationsAcknowledgement = formatMessage(
    employmentMessages.yourRightsAgreement.pageDescription,
  )

  //Vinna samhliða greiðslum
  const workAlongsidePaymentsAcknowledgement = formatMessage(
    employmentMessages.concurrentWorkAgreement.pageDescription,
  )

  //Missir bótaréttar
  const lossOfBenefitEntitlementAcknowledgement = formatMessage(
    employmentMessages.lossOfRightsAgreement.pageDescription,
  )

  //Utanlandsferðir og atvinna erlendis
  const foreignTravelAndWorkAbroadAcknowledgement = formatMessage(
    payoutMessages.vacationsAndForeignWorkAgreement.pageDescription,
  )

  //Útborgun atvinnuleysisbóta
  const unemploymentBenefitsPaymentAcknowledgement = formatMessage(
    payoutMessages.unemploymentBenefitsPayoutAgreement.pageDescription,
  )

  //Boðun í viðtal, á fund og í önnur úrræði
  const meetingsAndMeasuresAcknowledgement = formatMessage(
    employmentSearchMessages.interviewAndMeetingAgreement.pageDescription,
  )

  //Staðfesting á atvinnuleit þinni í hverjum mánuði
  const monthlyJobSearchAcknowledgement = formatMessage(
    employmentSearchMessages.employmentSearchConfirmationAgreement
      .pageDescription,
  )

  setBeforeSubmitCallback?.(async () => {
    try {
      await updateApplication({
        variables: {
          input: {
            id: application.id,
            answers: {
              ...application.answers,
              acknowledgements: {
                dataCollectionAcknowledgement,
                notifyChangesAcknowledgement,
                rightsAndObligationsAcknowledgement,
                workAlongsidePaymentsAcknowledgement,
                lossOfBenefitEntitlementAcknowledgement,
                foreignTravelAndWorkAbroadAcknowledgement,
                unemploymentBenefitsPaymentAcknowledgement,
                meetingsAndMeasuresAcknowledgement,
                monthlyJobSearchAcknowledgement,
              },
            },
          },
          locale,
        },
      })
    } catch (e) {
      return [false, 'error occured']
    }

    return [true, null]
  })

  return null
}
