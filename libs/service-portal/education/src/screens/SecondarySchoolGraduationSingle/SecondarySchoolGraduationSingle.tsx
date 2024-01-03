import {
  formatDate,
  IntroHeader,
  NotFound,
  UserInfoLine,
} from '@island.is/service-portal/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { Box, Divider, Stack, Text } from '@island.is/island-ui/core'
import { defineMessage } from 'react-intl'
import { EducationPaths } from '../../lib/paths'
import { useGetInnaDiplomasQuery } from '../SecondarySchoolCareer/Diplomas.generated'
import { useParams } from 'react-router-dom'
import { edMessage } from '../../lib/messages'

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

  if ((!singleGraduation.length && !loading) || error) {
    return (
      <NotFound
        title={defineMessage({
          id: 'sp.education-secondary-school:not-found',
          defaultMessage: 'Engin gögn fundust',
        })}
      />
    )
  }

  const graduationItem = singleGraduation[0]
  return (
    <Box marginBottom={[6, 6, 10]}>
      <IntroHeader
        title={graduationItem?.organisation ?? ''}
        intro={formatMessage(edMessage.graduationData)}
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
      </GridRow> */}
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
        {/* <Divider />

        <UserInfoLine
          label="Einingum lokið"
          content="203"
          editLink={{
            external: false,
            title: {
              id: 'sp.education:view-education-career',
              defaultMessage: 'Skoða námsferil',
            },
            url: EducationPaths.EducationFramhskoliGraduationDetail.replace(
              ':detail',
              'nanar',
            ).replace(':id', 'menntaskolinn-vid-hamrahlid'),
          }}
        /> */}
        {/* <Divider />
        <UserInfoLine
          label="Gráða"
          content={graduationItem.diplomaName ?? ''}
        /> */}
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

      <Box paddingTop={4}>
        <Text variant="small">{formatMessage(edMessage.gradFooter)}</Text>
      </Box>
    </Box>
  )
}

export default EducationGraduationDetail
