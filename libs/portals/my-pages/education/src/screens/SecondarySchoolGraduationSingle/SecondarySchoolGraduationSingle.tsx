import {
  formatDate,
  IntroHeader,
  m,
  MMS_SLUG,
  UserInfoLine,
} from '@island.is/portals/my-pages/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { Box, Divider, Stack, Text } from '@island.is/island-ui/core'
import { EducationPaths } from '../../lib/paths'
import { useGetInnaDiplomasQuery } from '../SecondarySchoolCareer/Diplomas.generated'
import { useParams } from 'react-router-dom'
import { edMessage } from '../../lib/messages'
import { Problem } from '@island.is/react-spa/shared'

type UseParams = {
  id: string
}

export const EducationGraduationDetail = () => {
  useNamespaces('sp.education-secondary-school')
  const { data: innaDiplomas, loading, error } = useGetInnaDiplomasQuery()
  const { formatMessage } = useLocale()

  const { id } = useParams() as UseParams
  const diplomaItems = innaDiplomas?.innaDiplomas?.items || []

  const singleGraduation = diplomaItems.filter(
    (item) => String(item.diplomaId) === id,
  )

  const graduationItem = singleGraduation[0]
  return (
    <Box marginBottom={[6, 6, 10]}>
      <IntroHeader
        title={graduationItem?.organisation ?? ''}
        intro={formatMessage(edMessage.graduationData)}
        serviceProviderSlug={MMS_SLUG}
        serviceProviderTooltip={formatMessage(m.mmsTooltipSecondary)}
      />
      {/* <GridRow marginTop={4}>
        <GridColumn span="1/1">
          <Box
            display="flex"
            justifyContent="flexStart"
            printHidden
            marginBottom={4}
          >
            <Button
              colorScheme="default"
              icon="document"
              iconType="filled"
              size="default"
              type="button"
              variant="utility"
            >
              Útskriftarskírteini
            </Button>
          </Box>
        </GridColumn>
      </GridRow> */}{' '}
      {error && !loading && <Problem error={error} noBorder={false} />}
      {!error && !loading && !singleGraduation.length && (
        <Problem
          type="no_data"
          noBorder={false}
          title={formatMessage(m.noData)}
          message={formatMessage(m.noDataFoundDetail)}
          imgSrc="./assets/images/sofa.svg"
        />
      )}
      {!error && !loading && singleGraduation.length > 0 && (
        <Stack space={2}>
          <UserInfoLine
            title={formatMessage(edMessage.overview)}
            label={formatMessage(edMessage.graduationDate)}
            content={formatDate(graduationItem?.diplomaDate ?? '')}
            loading={loading}
            editLink={{
              external: false,
              title: {
                id: 'sp.education:view-education-career',
                defaultMessage: formatMessage(edMessage.viewCareer),
              },
              url: EducationPaths.EducationFramhskoliGraduationDetail.replace(
                ':detail',
                'nanar',
              ).replace(':id', id),
            }}
          />
          <Divider />
          <UserInfoLine
            label={formatMessage(edMessage.graduationPath)}
            content={graduationItem?.diplomaName ?? ''}
            loading={loading}
          />
          <Divider />
          <UserInfoLine
            label={formatMessage(edMessage.school)}
            content={graduationItem?.organisation ?? ''}
            loading={loading}
          />
          <Divider />
        </Stack>
      )}
      <Box paddingTop={4}>
        <Text variant="small">{formatMessage(edMessage.gradFooter)}</Text>
      </Box>
    </Box>
  )
}

export default EducationGraduationDetail
