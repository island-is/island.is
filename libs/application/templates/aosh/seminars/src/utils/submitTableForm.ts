import { ApolloClient } from '@apollo/client'
import {
  QueryAreIndividualsValidArgs,
  SeminarIndividual,
  SeminarsIndividualValidationItem,
} from '@island.is/api/schema'
import { getValueViaPath } from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { ARE_INDIVIDUALS_VALID_QUERY } from '../graphql/queries'
import { ParticipantWithValidation } from '../shared/types'

export const submitTableForm = async (
  application: Application,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tableItems: Array<any>,
  apolloClient: ApolloClient<object>,
) => {
  const courseID =
    getValueViaPath<string>(application.answers, 'initialQuery', '') ?? ''
  const nationalIdOfApplicant = getValueViaPath<string>(
    application.externalData,
    'identity.data.nationalId',
    '',
  )

  const individuals: Array<SeminarIndividual> =
    tableItems?.map((x) => {
      return {
        nationalId: x.nationalIdWithName.nationalId,
        email: x.email,
      }
    }) ?? []
  const { data } = await apolloClient.query<
    { areIndividualsValid: Array<SeminarsIndividualValidationItem> },
    QueryAreIndividualsValidArgs
  >({
    query: ARE_INDIVIDUALS_VALID_QUERY,
    variables: {
      courseID: courseID,
      nationalIdOfRegisterer: nationalIdOfApplicant,
      input: { individuals: individuals },
    },
  })

  const updatedParticipants: Array<ParticipantWithValidation> = tableItems.map(
    (x) => {
      const participantInRes = data.areIndividualsValid.filter(
        (z: SeminarsIndividualValidationItem) =>
          z.nationalID === x.nationalIdWithName.nationalId,
      )
      if (participantInRes.length === 0) {
        return {
          ...x,
          disabled: true,
          errorMessage: 'Ógild gögn',
          errorMessageEn: 'Ógild gögn',
        }
      }
      return {
        ...x,
        disabled: !participantInRes[0].mayTakeCourse,
        errorMessage: participantInRes[0].errorMessage,
        errorMessageEn: participantInRes[0].errorMessageEn,
      }
    },
  )

  const allEmails = tableItems?.map((x) => x.email) ?? []
  const lastEmailAdded = allEmails[allEmails.length - 1]
  const emailAlreadyExists = allEmails.filter(
    (x, i) => x === lastEmailAdded && i < allEmails.length - 1,
  ).length

  const dictionaryOfItems: Array<{ path: string; value: string }> =
    updatedParticipants.map((x, i) => {
      const mostRecentItem = i === tableItems.length - 1
      return {
        path: `participantList[${i}].disabled`,
        value:
          x.disabled || (mostRecentItem && emailAlreadyExists)
            ? 'true'
            : 'false',
      }
    })

  if (emailAlreadyExists > 0) {
    dictionaryOfItems.push({
      path: 'participantValidityError',
      value:
        'Netfang er nú þegar skráð. Ekki er hægt að skrá tvo með sama netfangi. Þú getur eytt þátttakanda út og skráð aftur með öðru netfangi.',
    })
  }

  const disabledItem = updatedParticipants.find((x) => !!x.disabled)
  if (disabledItem) {
    dictionaryOfItems.push({
      path: 'participantValidityError',
      value: disabledItem.errorMessage,
    })
  } else if (emailAlreadyExists === 0) {
    dictionaryOfItems.push({
      path: 'participantValidityError',
      value: '',
    })
    dictionaryOfItems.push({
      path: 'participantFinishedValidation',
      value: 'true',
    })
  }

  return dictionaryOfItems
}
