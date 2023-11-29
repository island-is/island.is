import {
  ActionCard,
  GridColumn,
  GridContainer,
  GridRow,
  Hidden,
  Stack,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'

import { IntroHeader, PortalNavigation } from '@island.is/portals/core'
import { SignatureCollectionPaths } from '../../lib/paths'
import { useLoaderData, useNavigate, useRevalidator } from 'react-router-dom'
import { useEffect } from 'react'
import { SignatureList } from '@island.is/api/schema'
import { format } from 'date-fns'
import { signatureCollectionNavigation } from '../../lib/navigation'

const Lists = () => {
  const { formatMessage } = useLocale()
  const navigate = useNavigate()
  const lists = useLoaderData() as SignatureList[]
  const { revalidate } = useRevalidator()

  useEffect(() => {
    revalidate()
  }, [])

  return (
    <GridContainer>
      <GridRow direction="row">
        <GridColumn span={['3/12']}>
          <Hidden below="md">
            <PortalNavigation
              navigation={signatureCollectionNavigation}
              title={formatMessage(m.signatureListsTitle)}
            />
          </Hidden>
        </GridColumn>
        <GridColumn
          offset={['0', '0', '1/12']}
          span={['12/12', '12/12', '8/12']}
        >
          <IntroHeader
            title={formatMessage(m.signatureListsTitle)}
            intro={formatMessage(m.signatureListsIntro)}
          />
          <Stack space={5}>
            {lists.map((list: SignatureList) => {
              return (
                <ActionCard
                  key={list.id}
                  eyebrow={
                    formatMessage(m.listDateTil) +
                    ': ' +
                    format(new Date(list.endTime), 'dd.MM.yyyy')
                  }
                  heading={list.owner.name + ' - ' + list.area.name}
                  text={formatMessage(m.collectionTitle)}
                  progressMeter={{
                    currentProgress: list.numberOfSignatures ?? 0,
                    maxProgress: list.area.min,
                    withLabel: true,
                  }}
                  cta={{
                    label: formatMessage(m.viewList),
                    variant: 'text',
                    icon: 'arrowForward',
                    onClick: () => {
                      navigate(
                        SignatureCollectionPaths.SignatureList.replace(
                          ':id',
                          list.id,
                        ),
                        {
                          state: {
                            list,
                          },
                        },
                      )
                    },
                  }}
                />
              )
            })}
          </Stack>
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}

export default Lists
