import { IntroHeader, PortalNavigation } from '@island.is/portals/core'
import { signatureCollectionNavigation } from '../../lib/navigation'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import {
  ActionCard,
  GridColumn,
  GridContainer,
  GridRow,
  Stack,
} from '@island.is/island-ui/core'
import { useNavigate } from 'react-router-dom'
import { SignatureCollectionPaths } from '../../lib/paths'

export const SingleConstituencyView = () => {
  const { formatMessage } = useLocale()
  const navigate = useNavigate()

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
          <IntroHeader
            title={formatMessage('Norðausturkjördæmi')}
            intro={formatMessage(m.signatureListsIntro)}
            imgPosition="right"
            imgHiddenBelow="sm"
          />
          <GridRow>
            <GridColumn span={'12/12'}>
              <Stack space={3}>
                <ActionCard
                  heading={'Listi A'}
                  progressMeter={{
                    currentProgress: 10,
                    maxProgress: 130,
                    withLabel: true,
                  }}
                  cta={{
                    label: 'Skoða nánar',
                    variant: 'text',
                    onClick: () => {
                      navigate(
                        SignatureCollectionPaths.ParliamentaryNordausturkjordaemiList.replace(
                          ':id',
                          '1',
                        ),
                      )
                    },
                  }}
                />
                <ActionCard
                  heading={'Listi B'}
                  progressMeter={{
                    currentProgress: 0,
                    maxProgress: 130,
                    withLabel: true,
                  }}
                  cta={{
                    label: 'Skoða nánar',
                    variant: 'text',
                  }}
                />
                <ActionCard
                  heading={'Listi C'}
                  progressMeter={{
                    currentProgress: 70,
                    maxProgress: 130,
                    withLabel: true,
                  }}
                  cta={{
                    label: 'Skoða nánar',
                    variant: 'text',
                  }}
                />
                <ActionCard
                  heading={'Listi D'}
                  progressMeter={{
                    currentProgress: 50,
                    maxProgress: 130,
                    withLabel: true,
                  }}
                  cta={{
                    label: 'Skoða nánar',
                    variant: 'text',
                  }}
                />
              </Stack>
            </GridColumn>
          </GridRow>
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}

export default SingleConstituencyView
