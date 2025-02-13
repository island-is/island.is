import {
  ActionCard,
  Box,
  DialogPrompt,
  GridColumn,
  GridContainer,
  GridRow,
  Icon,
  Stack,
  Tag,
  Text,
} from '@island.is/island-ui/core'
import nationalRegistryLogo from '../../../assets/nationalRegistry.svg'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { PortalNavigation } from '@island.is/portals/core'
import { signatureCollectionNavigation } from '../../lib/navigation'
import ScreenHeader from '../../shared-components/screenHeader'
import { useLoaderData, useLocation, useNavigate, useParams } from 'react-router-dom'
import { ListsLoaderReturn } from '../../loaders/AllLists.loader'
import { SignatureCollectionPaths } from '../../lib/paths'
import { replaceParams } from '@island.is/react-spa/shared'

const LandAreas = () => {
  const { collection, allLists } = useLoaderData() as ListsLoaderReturn
  const { formatMessage } = useLocale()
  const navigate = useNavigate()
  const params = useParams()

  console.log(params)

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
          <ScreenHeader
            electionName={formatMessage(m.municipalCollectionTitle)}
            intro={formatMessage(m.municipalCollectionIntro)}
            image={nationalRegistryLogo}
          />
          <Stack space={3}>
            {allLists.map((list) => (
              <ActionCard
                key={'test'}
                eyebrow={'Höfuðborgarsvæði (3000)'}
                heading={'Reykjavík'}
                text={'Fjöldi framboða: 12'}
                cta={{
                  label: 'Skoða sveitarfélag',
                  variant: 'text',
                  onClick: () => {
                    navigate(
                      replaceParams({
                        href: SignatureCollectionPaths.LandAreaSingleMunicipality,
                        params: {
                          landAreaName: 'hofudborgarsvaedi',
                          municipalityName: 'reykjavik',
                        },
                      }),
                    )
                  },
                }}
                tag={{
                  label: 'Tag',
                  variant: 'blue',
                  renderTag: () => (
                    <Box display="flex" alignItems="center" columnGap={1}>
                      <DialogPrompt
                        baseId="open_collection"
                        ariaLabel=""
                        title="Opna fyrir meðmælasöfnun"
                        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit?"
                        disclosureElement={
                          <Tag outlined variant="blue">
                            <Box display="flex" alignItems="center">
                              <Icon
                                icon="lockClosed"
                                size="small"
                                type="outline"
                              />
                            </Box>
                          </Tag>
                        }
                        onConfirm={() => console.log('opened')}
                        buttonTextConfirm="Já, opna"
                        buttonTextCancel="Hætta við"
                      />
                    </Box>
                  ),
                }}
              />
            ))}
          </Stack>
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}

export default LandAreas
