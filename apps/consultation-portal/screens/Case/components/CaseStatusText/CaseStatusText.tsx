import { ReactNode } from 'react'
import { LinkV2 } from '@island.is/island-ui/core'
import sharedLocalization from '../../../../lib/shared.json'
import { advicePublishTypeKeyHelper } from '../../../../types/enums'

interface TextLinkProps {
  children: ReactNode
  href: string
}

interface CaseStatusText {
  sloc: typeof sharedLocalization['publishingRules']
  status: string
  advicePublishTypeId: number
  shouldDisplayHidden: boolean
  linkProps: {
    href: string
    label: string
  }
  textBefore?: string
  isAdviceForm?: boolean
}

const TextLink = ({ href, children }: TextLinkProps) => {
  return (
    <LinkV2
      href={href}
      color="blue400"
      underline="normal"
      underlineVisibility="always"
      legacyBehavior
      shallow
    >
      {children}
    </LinkV2>
  )
}

const CaseStatusText = ({
  sloc,
  status,
  advicePublishTypeId,
  shouldDisplayHidden,
  linkProps,
  textBefore,
  isAdviceForm = false,
}: CaseStatusText) => {
  const publishRuleText =
    status == 'Til umsagnar'
      ? sloc[advicePublishTypeKeyHelper[advicePublishTypeId]].present
      : sloc[advicePublishTypeKeyHelper[advicePublishTypeId]].past
  const hiddenText =
    status === 'Til umsagnar' ? sloc.hiddenName.present : sloc.hiddenName.past

  const retComp = []
  if (textBefore) {
    retComp.push(textBefore)
    retComp.push(' ')
  }
  retComp.push(publishRuleText)
  if (
    !isAdviceForm &&
    advicePublishTypeKeyHelper[advicePublishTypeId] !== 'publishNever' &&
    status !== 'Til umsagnar'
  ) {
    retComp.push(' ')
    retComp.push(<TextLink href={linkProps.href}>{linkProps.label}</TextLink>)
    retComp.push('.')
  }
  if (shouldDisplayHidden) {
    retComp.push(' ')
    retComp.push(hiddenText)
  }
  if (isAdviceForm) {
    retComp.push(' ')
    retComp.push(sloc.publishLaw.text)
    retComp.push(' ')
    retComp.push(<TextLink href={linkProps.href}>{linkProps.label}</TextLink>)
  }

  return retComp
}

export default CaseStatusText
