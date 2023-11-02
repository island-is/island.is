import React from 'react'
import {
  ActionCard,
  CardLoader,
  IntroHeader,
  m,
  NotFound,
  SortableTable,
} from '@island.is/service-portal/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { Box } from '@island.is/island-ui/core'
import { EducationPaths } from '../../lib/paths'
import { useGetInnaDiplomasQuery } from '../SecondarySchoolCareer/Diplomas.generated'
import { defineMessage } from 'react-intl'
import { edMessage } from '../../lib/messages'

export const EducationGraduationDetail = () => {
  useNamespaces('sp.education-secondary-school')
  const { data: innaDiplomas, loading, error } = useGetInnaDiplomasQuery()
  const { formatMessage } = useLocale()

  const diplomaItems = innaDiplomas?.innaDiplomas?.items || []

  if ((!diplomaItems.length && !loading) || error) {
    return (
      <NotFound
        title={defineMessage({
          id: 'sp.education-secondary-school:not-found',
          defaultMessage: 'Engin gögn fundust',
        })}
      />
    )
  }
  return (
    <Box marginBottom={[6, 6, 10]}>
      <IntroHeader
        title={formatMessage(edMessage.graduations)}
        intro={defineMessage({
          id: 'sp.education-secondary-school:grad-overview-intro',
          defaultMessage:
            'Hér getur þú fundið yfirlit yfir þínar útskriftir úr framhaldsskóla.',
        })}
      />
      <Box marginTop={4}>{loading && <CardLoader />}</Box>
      <Box marginBottom={3}>
        {diplomaItems.length > 0 &&
          !loading &&
          diplomaItems.map((item, i) => (
            <Box key={i} marginBottom={3}>
              <ActionCard
                // image={{
                //   type: 'image',
                //   url: '',
                // }}
                heading={item.organisation ?? ''}
                text={item.diplomaName ?? ''}
                key={item.diplomaId}
                cta={{
                  label: formatMessage(edMessage.view),
                  url: item.diplomaId
                    ? EducationPaths.EducationFramhskoliGraduationSingle.replace(
                        ':id',
                        item.diplomaId,
                      )
                    : undefined,
                  variant: 'text',
                }}
              />
            </Box>
          ))}
      </Box>
    </Box>
  )
}

export default EducationGraduationDetail
