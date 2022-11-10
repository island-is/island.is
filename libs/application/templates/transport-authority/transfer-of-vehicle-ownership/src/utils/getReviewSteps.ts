import { ReviewSectionProps } from '../types'
import { Application } from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'

export const getReviewSteps = (application: Application) => {
  console.log(application)

  const buyerApproved = getValueViaPath(
    application.answers,
    'buyer.approved',
    false,
  ) as boolean

  const steps = [
    //
    {
      tagText: 'Móttekin',
      tagVariant: 'mint',
      title: 'Skráning eigendaskipta á ökutæki OL712',
      description: 'Tilkynning um eigendaskiptu hefur borist til Samgöngustofu',
    },
    {
      tagText: 'Móttekin',
      tagVariant: 'mint',
      title: 'Greiðsla móttekin',
      description: 'Greitt hefur verið fyrir eigendaskiptin af seljanda',
    },
    {
      tagText: 'Samþykki í bið',
      tagVariant: 'purple',
      title: 'Samþykki kaupanda',
      description: 'Beðið er eftir að nýr eigandi staðfesti eigendaskiptin.',
    },
    {
      tagText: 'Samþykki í bið',
      tagVariant: 'purple',
      title: 'Samþykki meðeiganda',
      description:
        'Beðið er eftir að meðeigandi kaupanda staðfesti eigendaskiptin.',
    },
  ] as ReviewSectionProps[]

  return steps
}
