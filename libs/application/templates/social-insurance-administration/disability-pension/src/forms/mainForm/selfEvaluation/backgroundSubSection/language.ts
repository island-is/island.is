import {
    buildAsyncSelectField,
  buildMultiField,
} from '@island.is/application/core'
import * as m from '../../../../lib/messages'
import { SectionRouteEnum } from '../../../../types/routes'
import { siaGeneralLanguagesQuery } from '../../../../graphql/queries'
import { SocialInsuranceGeneralLanguagesQuery } from '../../../../graphql/queries.generated'

export const languageField = buildMultiField({
  id: SectionRouteEnum.BACKGROUND_INFO_LANGUAGE,
  title: m.selfEvaluation.questionFormTitle,
  children: [
    buildAsyncSelectField({
      id: `${SectionRouteEnum.BACKGROUND_INFO_LANGUAGE}.language`,
      title: m.questions.languageTitle,
      width: 'full',
      isSearchable: true,
      placeholder: m.questions.chooseLanguage,
      loadOptions: async ({ apolloClient }) => {
        const { data } =
          await apolloClient.query<SocialInsuranceGeneralLanguagesQuery>({
            query: siaGeneralLanguagesQuery ,
          })

        return (
          data.socialInsuranceGeneral?.languages?.map(({ value, label }) => ({
            value: value.toString(),
            label,
          })) ?? []
        )
      },
    }),
  ],
})
