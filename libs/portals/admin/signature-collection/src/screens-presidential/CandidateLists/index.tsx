import {
  ActionCard,
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Stack,
  Breadcrumbs,
  Divider,
  SkeletonLoader,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { IntroHeader, PortalNavigation } from '@island.is/portals/core'
import { useNavigate, useParams } from 'react-router-dom'
import { signatureCollectionNavigation } from '../../lib/navigation'
import { getTagConfig } from '../../lib/utils'
import nationalRegistryLogo from '../../../assets/nationalRegistry.svg'
import ActionDrawer from '../../shared-components/actionDrawer'
import { SignatureCollectionPaths } from '../../lib/paths'
import {
  SignatureCollectionCollectionType,
  SignatureCollectionList,
} from '@island.is/api/schema'
import { replaceParams } from '@island.is/react-spa/shared'
import { Actions } from '../../shared-components/actionDrawer/ListActions'
import { useSignatureCollectionAdminListsForCandidateQuery } from './getCandidateLists.generated'

const CandidateLists = () => {
  const { formatMessage } = useLocale()
  const navigate = useNavigate()

  const { candidateId = '' } = useParams<{ candidateId?: string }>()
  const {
    data: { signatureCollectionAdminListsForCandidate: candidateLists } = {},
  } = useSignatureCollectionAdminListsForCandidateQuery({
    variables: {
      input: {
        candidateId,
        collectionType: SignatureCollectionCollectionType.Presidential,
      },
    },
    skip: !candidateId,
  })

  const candidateName = candidateLists?.[0]?.candidate.name || ''

  return (
    <GridContainer>
      <GridRow direction="row">
        <GridColumn
          span={['12/12', '5/12', '5/12', '3/12']}
          offset={['0', '7/12', '7/12', '0']}
        >
          <PortalNavigation
            navigation={signatureCollectionNavigation}
            title={formatMessage(m.signatureListsTitle)}
          />
        </GridColumn>
        <GridColumn
          paddingTop={[5, 5, 5, 0]}
          offset={['0', '0', '0', '1/12']}
          span={['12/12', '12/12', '12/12', '8/12']}
        >
          <Box marginBottom={3}>
            <Breadcrumbs
              items={[
                {
                  title: formatMessage(m.signatureListsTitlePresidential),
                  href: `/stjornbord${SignatureCollectionPaths.PresidentialListOfCandidates}`,
                },
                {
                  title: candidateName,
                },
              ]}
            />
          </Box>
          <IntroHeader
            title={candidateName}
            intro={formatMessage(m.signatureListsIntro)}
            img={nationalRegistryLogo}
            imgPosition="right"
            imgHiddenBelow="sm"
            buttonGroup={
              <ActionDrawer allowedActions={[Actions.DownloadReports]} />
            }
            marginBottom={3}
          />
          <Divider />
          <Box marginTop={9} />
          {candidateLists ? (
            <Stack space={3}>
              {candidateLists.map((list: SignatureCollectionList) => {
                return (
                  <ActionCard
                    key={list.id}
                    eyebrow={list.candidate.name}
                    heading={list.area.name}
                    progressMeter={{
                      currentProgress: list.numberOfSignatures ?? 0,
                      maxProgress: list.area.min,
                      withLabel: true,
                    }}
                    tag={getTagConfig(list)}
                    cta={{
                      label: formatMessage(m.viewList),
                      variant: 'text',
                      icon: 'arrowForward',
                      onClick: () => {
                        navigate(
                          replaceParams({
                            href: SignatureCollectionPaths.PresidentialList,
                            params: {
                              candidateId: list.candidate.id,
                              listId: list.id,
                            },
                          }),
                        )
                      },
                    }}
                  />
                )
              })}
            </Stack>
          ) : (
            <SkeletonLoader
              height={160}
              borderRadius="large"
              repeat={4}
              space={3}
            />
          )}
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}

export default CandidateLists
