import { useLocale, useNamespaces } from '@island.is/localization'
import { useParams } from 'react-router-dom'
import {
  HUGVERKASTOFAN_SLUG,
  IntroHeader,
  m,
} from '@island.is/service-portal/core'
import { Box, SkeletonLoader, Stack } from '@island.is/island-ui/core'
import { useGetIntellectualPropertiesPatentByIdQuery } from './IntellectualPropertiesPatentDetail.generated'
import { Problem } from '@island.is/react-spa/shared'
import EP from './patentVariations/EP'
import IS from './patentVariations/IS'
import SPC from './patentVariations/SPC'
import { useMemo } from 'react'

type UseParams = {
  id: string
}

const IntellectualPropertiesPatentDetail = () => {
  useNamespaces('sp.intellectual-property')
  const { formatMessage } = useLocale()
  const { id } = useParams() as UseParams

  const { data, loading, error } = useGetIntellectualPropertiesPatentByIdQuery({
    variables: {
      input: {
        key: id,
      },
    },
  })

  console.log(data)

  const patent = useMemo(() => {
    if (!loading && !error)
      switch (data?.intellectualPropertiesPatent?.__typename) {
        case 'IntellectualPropertiesPatentEP':
          return (
            <EP data={data.intellectualPropertiesPatent} loading={loading} />
          )
        case 'IntellectualPropertiesPatentIS':
          return (
            <IS data={data.intellectualPropertiesPatent} loading={loading} />
          )
        case 'IntellectualPropertiesSPC':
          return (
            <SPC data={data.intellectualPropertiesPatent} loading={loading} />
          )
      }
  }, [data, loading, error])

  if (error && !loading) {
    return <Problem error={error} />
  }

  if (!data?.intellectualPropertiesPatent && !loading) {
    return <Problem type="no_data" />
  }
  return (
    <>
      <Box marginBottom={[1, 1, 3]}>
        <IntroHeader
          title={id}
          serviceProviderSlug={HUGVERKASTOFAN_SLUG}
          serviceProviderTooltip={formatMessage(
            m.intellectualPropertiesTooltip,
          )}
        />
      </Box>
      {
        <Stack space="containerGutter">
          {loading ? (
            <Box marginBottom={[3, 3, 3, 12]}>
              <Box marginBottom={6}>
                <SkeletonLoader height={300} />
              </Box>
              <Box marginBottom={10}>
                <SkeletonLoader height={250} />
              </Box>
              <SkeletonLoader height={300} />
            </Box>
          ) : (
            patent
          )}
        </Stack>
      }
    </>
  )
}

export default IntellectualPropertiesPatentDetail
