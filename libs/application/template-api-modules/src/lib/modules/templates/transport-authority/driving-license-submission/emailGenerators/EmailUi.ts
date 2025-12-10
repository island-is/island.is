import type {
  ImageComponent,
  HeadingComponent,
  CopyComponent,
  ListComponent,
} from '@island.is/email-service'
import { DrivingLicenseApplicationType } from '@island.is/api/domains/driving-license'
import { m } from './messages'
import { pathToAsset } from './utils'

const Img = (src: string, alt: string) =>
  ({
    component: 'Image',
    context: {
      src: pathToAsset(src),
      alt,
    },
  } as ImageComponent)

const Copy = (copy: string, context?: Omit<CopyComponent['context'], 'copy'>) =>
  ({
    component: 'Copy',
    context: {
      copy,
      ...(context ?? {}),
    },
  } as CopyComponent)

const List = (items: string[]) =>
  ({
    component: 'List',
    context: {
      items,
    },
  } as ListComponent)

const Heading = (
  copy: string,
  context?: Omit<HeadingComponent['context'], 'copy'>,
) =>
  ({
    component: 'Heading',
    context: {
      copy,
      ...(context ?? {}),
    },
  } as HeadingComponent)

type EmailHeaderOptions = {
  applicationFor?: DrivingLicenseApplicationType
  firstName?: string
}

export const EmailHeader = (opts?: EmailHeaderOptions) => {
  const eyebrow = `${m.congratulations} ${opts?.firstName ?? ''}`.trim()
  const applicationFor = opts?.applicationFor || 'B-full'

  return [
    Img('notification.jpg', 'myndskreyting'),
    Heading(m.drivingLicenseHeading[applicationFor], {
      align: 'left',
      small: true,
      eyebrow,
    }),
  ]
}

type EmailCompleteOptions = {
  selectedDistrictCommissioner?: string
}

export const EmailComplete = (opts?: EmailCompleteOptions) => {
  return m.completeFooter.map((str) => {
    if (str.includes('%s') && opts?.selectedDistrictCommissioner) {
      str = str.replace('%s', `<em>${opts?.selectedDistrictCommissioner}</em>`)
    }

    return Copy(str, {
      align: 'left',
      small: true,
    })
  })
}

export const EmailRequirements = (
  applicationFor: DrivingLicenseApplicationType = 'B-full',
  willBringQualityPhoto: boolean,
  willBringHealthCert: boolean,
) => {
  if (!willBringHealthCert && !willBringQualityPhoto) {
    return []
  }

  let i = 0

  const copyContext: Omit<CopyComponent['context'], 'copy'> = {
    small: true,
    style: 'bold',
    align: 'left',
  }

  return [
    Copy(m.inPersonRequirements.title[applicationFor], {
      align: 'left',
      small: true,
    }),
    ...(willBringHealthCert
      ? [
          Copy(
            `${++i}. ${m.inPersonRequirements.healthDeclaration.title}`,
            copyContext,
          ),
        ]
      : []),
    ...(willBringQualityPhoto
      ? [
          Copy(
            `${++i}. ${m.inPersonRequirements.qualityPhoto.title}`,
            copyContext,
          ),
          List(m.inPersonRequirements.qualityPhoto.list),
        ]
      : []),
    ...(applicationFor === 'B-full'
      ? [
          Copy(
            `${++i}. ${m.inPersonRequirements.temporaryLicense.title}`,
            copyContext,
          ),
        ]
      : []),
  ]
}
