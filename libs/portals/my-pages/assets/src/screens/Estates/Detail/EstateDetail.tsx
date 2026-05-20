import { useParams, useNavigate } from 'react-router-dom'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  CardLoader,
  m,
  IntroWrapper,
  SYSLUMENN_SLUG,
} from '@island.is/portals/my-pages/core'
import { estatesMessages as em } from '../../../lib/messages'
import { Box, Button, Tabs } from '@island.is/island-ui/core'
import { Problem } from '@island.is/react-spa/shared'
import { AssetsPaths } from '../../../lib/paths'

// TODO: Uncomment and wire up when the GraphQL domain for estates is ready
// import { useEstateDetailQuery } from './EstateDetail.generated'

export const EstateDetail = () => {
  useNamespaces('sp.estates')
  const { formatMessage } = useLocale()
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  // TODO: Replace with real query once `getEstate(id)` GraphQL resolver is available.
  // const { data, loading, error } = useEstateDetailQuery({
  //   variables: { id: id ?? '' },
  //   skip: !id,
  // })
  const loading = false
  const error = undefined
  const estate = undefined as
    | {
        id: string
        caseNumber: string
        deceasedName: string
        deceasedNationalId: string
        deceasedDateOfDeath?: string
        domicile?: string
        assignedOffice?: string
        hasMarriageContract: boolean
        hasWill: boolean
        heirs: { name: string; nationalId: string; relation: string }[]
        assets: { assetType: string; description: string; value?: string; share?: number }[]
        isFinished: boolean
      }
    | undefined

  const tabs = [
    {
      label: formatMessage(em.tabBaseInfo),
      content: (
        <Box paddingTop={3}>
          {/* TODO: Render basic info table once GraphQL data is wired. */}
          <Problem
            type="no_data"
            title={formatMessage(em.tabBaseInfo)}
            message={formatMessage(m.noDataFoundDetail)}
            noBorder={false}
          />
        </Box>
      ),
    },
    {
      label: formatMessage(em.tabHeirs),
      content: (
        <Box paddingTop={3}>
          {/* TODO: Render heirs table once GraphQL data is wired. */}
          <Problem
            type="no_data"
            title={formatMessage(em.heirsTitle)}
            message={formatMessage(m.noDataFoundDetail)}
            noBorder={false}
          />
        </Box>
      ),
    },
    {
      label: formatMessage(em.tabAssets),
      content: (
        <Box paddingTop={3}>
          {/* TODO: Render assets table once GraphQL data is wired. */}
          <Problem
            type="no_data"
            title={formatMessage(em.tabAssets)}
            message={formatMessage(m.noDataFoundDetail)}
            noBorder={false}
          />
        </Box>
      ),
    },
  ]

  return (
    <IntroWrapper
      title={estate?.deceasedName ?? formatMessage(em.detailTitle)}
      intro={
        estate?.caseNumber
          ? `${formatMessage(em.caseNumber)}: ${estate.caseNumber}`
          : formatMessage(em.intro)
      }
      serviceProvider={{
        slug: SYSLUMENN_SLUG,
        tooltip: formatMessage(m.estatesTooltip),
      }}
      buttonGroup={{
        actions: [
          <Button
            key="files"
            variant="utility"
            icon="document"
            iconType="outline"
            onClick={() =>
              navigate(AssetsPaths.AssetsEstateFiles.replace(':id', id ?? ''))
            }
          >
            {formatMessage(em.filesTitle)}
          </Button>,
        ],
      }}
    >
      {loading && <CardLoader />}
      {error && <Problem error={error} noBorder={false} />}
      {!loading && !error && !estate && (
        <Problem
          type="no_data"
          title={formatMessage(em.detailTitle)}
          message={formatMessage(m.noDataFoundDetail)}
          noBorder={false}
        />
      )}
      {!loading && !error && estate && (
        <Tabs
          label={formatMessage(em.tabBaseInfo)}
          tabs={tabs}
          contentBackground="transparent"
          selected="0"
          size="xs"
        />
      )}
    </IntroWrapper>
  )
}

export default EstateDetail
