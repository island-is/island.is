import { NetworkStatus, QueryResult } from '@apollo/client'
import { GeneralCardSkeleton, Problem } from '../../ui'
import { SafeAreaView, View } from 'react-native'

export function Skeletons() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <GeneralCardSkeleton height={90} key={index} />
      ))}
    </>
  )
}

export function EmptyComponent({ res }: { res: QueryResult<any, any> }) {
  if (res.networkStatus === NetworkStatus.loading) {
    return (
      <>
        {Array.from({ length: 5 }).map((_, index) => (
          <GeneralCardSkeleton height={90} key={index} />
        ))}
      </>
    )
  }

  if (res.error) {
    return (
      <View>
        <Problem error={res.error} />
      </View>
    )
  }

  return (
    <View>
      <Problem type="no_data" />
    </View>
  )
}
