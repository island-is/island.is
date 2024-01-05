import React, { FC } from 'react'
import Head from 'next/head'

interface HeadWithSocialSharingProps {
  title: string
  description?: string
  imageUrl?: string
  imageWidth?: string
  imageHeight?: string
  imageContentType?: string
}

const usableContentTypes = ['image/jpeg', 'image/gif', 'image/png', undefined]

export const HeadWithSocialSharing: FC<
  React.PropsWithChildren<HeadWithSocialSharingProps>
> = ({
  title,
  description,
  imageUrl,
  imageWidth,
  imageHeight,
  imageContentType,
  children,
}) => {
  const isSvg = imageUrl
    ? imageUrl.trim().toLocaleLowerCase().endsWith('svg')
    : false
  const isUsableImage = !isSvg && usableContentTypes.includes(imageContentType)

  return (
    <Head>
      {title.length > 0 ? (
        <>
          <title>{title}</title>
          <meta name="title" content={title} key="title" />
          <meta property="og:title" content={title} key="ogTitle" />
          <meta property="twitter:title" content={title} key="twitterTitle" />
        </>
      ) : null}

      {description && description.length > 0 ? (
        <>
          <meta name="description" content={description} key="description" />
          <meta
            property="og:description"
            content={description}
            key="ogDescription"
          />
          <meta
            property="twitter:description"
            content={description}
            key="twitterDescription"
          />
        </>
      ) : null}

      {isUsableImage && imageUrl && imageUrl.length > 0 ? (
        <>
          <meta
            property="og:image"
            content={`${imageUrl.startsWith('//') ? 'https:' : ''}${imageUrl}`}
            key="ogImage"
          />
          <meta
            property="twitter:image"
            content={`${imageUrl.startsWith('//') ? 'https:' : ''}${imageUrl}`}
            key="twitterImage"
          />
          <meta
            property="og:image:width"
            content={imageWidth}
            key="ogImageWidth"
          />
          <meta
            property="og:image:height"
            content={imageHeight}
            key="ogImageHeight"
          />
        </>
      ) : null}

      {children}
    </Head>
  )
}

export default HeadWithSocialSharing
