import { useLocale, useNamespaces } from '@island.is/localization'
// import { useParams } from 'react-router-dom'
import { IntroWrapper } from '@island.is/portals/my-pages/core'
import { ATVINNUVEGARADUNEYTID_SLUG } from '@island.is/portals/my-pages/core'
import { farmerLandsMessages } from '../../../lib/messages'
// import { useDetailQuery } from './Detail.generated'

export const Detail = () => {
  useNamespaces('sp.farmer-lands')
  const { formatMessage } = useLocale()
  // const { id } = useParams<{ id: string }>()

  // TODO: Uncomment when farmerLand detail query is added to API
  // const { data, loading, error } = useDetailQuery({
  //   variables: { id: id || '' },
  //   skip: !id,
  // })

  return (
    <IntroWrapper
      title={formatMessage(farmerLandsMessages.title)}
      intro={formatMessage(farmerLandsMessages.description)}
      serviceProviderSlug={ATVINNUVEGARADUNEYTID_SLUG}
    >
      <p>TODO: Add farmerLand detail query to API domain module</p>
      {/* {loading && <p>Loading...</p>} */}
      {/* {error && <p>Error loading farmer land detail</p>} */}
      {/* {data?.farmerLand && (
        <div>
          <p>Hello World - Farmer Land: {data.farmerLand.name}</p>
        </div>
      )} */}
    </IntroWrapper>
  )
}

export default Detail
