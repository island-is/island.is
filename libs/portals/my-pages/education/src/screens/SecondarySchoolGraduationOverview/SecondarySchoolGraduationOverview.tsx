import {
  ActionCard,
  CardLoader,
  IntroHeader,
  MMS_SLUG,
  m,
} from '@island.is/portals/my-pages/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { Box } from '@island.is/island-ui/core'
import { EducationPaths } from '../../lib/paths'
import { useGetInnaDiplomasQuery } from '../SecondarySchoolCareer/Diplomas.generated'
import { defineMessage } from 'react-intl'
import { edMessage } from '../../lib/messages'
import { Problem } from '@island.is/react-spa/shared'

export const EducationGraduationDetail = () => {
  useNamespaces('sp.education-secondary-school')
  const { data: innaDiplomas, loading, error } = useGetInnaDiplomasQuery()
  const { formatMessage } = useLocale()

  const diplomaItems = innaDiplomas?.innaDiplomas?.items || []

  return (
    <Box marginBottom={[6, 6, 10]}>
      <IntroHeader
        title={formatMessage(edMessage.graduations)}
        intro={defineMessage({
          id: 'sp.education-secondary-school:grad-overview-intro',
          defaultMessage:
            'Hér getur þú fundið yfirlit yfir þínar útskriftir úr framhaldsskóla.',
        })}
        serviceProviderSlug={MMS_SLUG}
        serviceProviderTooltip={formatMessage(m.mmsTooltipSecondary)}
      />
      {error && !loading && <Problem error={error} noBorder={false} />}

      {!error && !loading && !diplomaItems.length && (
        <Problem
          type="no_data"
          noBorder={false}
          title={formatMessage(m.noData)}
          message={formatMessage(m.noDataFoundDetail)}
          imgSrc="./assets/images/sofa.svg"
        />
      )}
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
                        String(item.diplomaId),
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
