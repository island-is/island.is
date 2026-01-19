import {
  CardLoader,
  IntroWrapper,
  MMS_SLUG,
  m,
} from '@island.is/portals/my-pages/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { ActionCard, Box } from '@island.is/island-ui/core'
import { EducationPaths } from '../../lib/paths'
import { useGetInnaDiplomasQuery } from '../SecondarySchoolCareer/Diplomas.generated'
import { defineMessage } from 'react-intl'
import { edMessage } from '../../lib/messages'
import { Problem } from '@island.is/react-spa/shared'
import { useNavigate } from 'react-router-dom'

export const EducationGraduationDetail = () => {
  useNamespaces('sp.education-secondary-school')
  const { data: innaDiplomas, loading, error } = useGetInnaDiplomasQuery()
  const { formatMessage } = useLocale()
  const navigate = useNavigate()

  const diplomaItems = innaDiplomas?.innaDiplomas?.items || []

  return (
    <IntroWrapper
      title={edMessage.graduations}
      intro={defineMessage({
        id: 'sp.education-secondary-school:grad-overview-intro',
        defaultMessage:
          'Hér getur þú fundið yfirlit yfir þínar útskriftir úr framhaldsskóla.',
      })}
      serviceProviderSlug={MMS_SLUG}
      serviceProviderTooltip={formatMessage(m.mmsTooltipSecondary)}
    >
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
                heading={item.organisation ?? ''}
                text={item.diplomaName ?? ''}
                key={item.diplomaId}
                cta={{
                  label: formatMessage(edMessage.view),
                  onClick: item.diplomaId
                    ? () =>
                        navigate(
                          EducationPaths.EducationFramhskoliGraduationSingle.replace(
                            ':id',
                            String(item.diplomaId),
                          ),
                        )
                    : undefined,
                  variant: 'text',
                }}
              />
            </Box>
          ))}
      </Box>
    </IntroWrapper>
  )
}

export default EducationGraduationDetail
