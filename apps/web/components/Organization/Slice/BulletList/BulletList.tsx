import React from 'react'
import { BulletListSlice as BulletListProps } from '@island.is/web/graphql/schema'
import { BulletList } from '@island.is/web/components'

interface SliceProps {
  slice: BulletListProps
}

export const BulletListSlice: React.FC<React.PropsWithChildren<SliceProps>> = ({
  slice,
}) => {
  return (
    <section
      key={slice.id}
      id={slice.id}
      aria-labelledby={'sliceTitle-' + slice.id}
    >
      <BulletList
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore make web strict
        bullets={slice.bullets.map((bullet) => {
          switch (bullet.__typename) {
            case 'IconBullet':
              return {
                ...bullet,
                type: 'IconBullet',
                icon: bullet.icon.url,
              }
            case 'NumberBulletGroup':
              return { ...bullet, type: 'NumberBulletGroup' }
            default:
              return null
          }
        })}
      />
    </section>
  )
}
