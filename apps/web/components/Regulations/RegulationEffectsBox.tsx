import React from 'react'
import * as s from './RegulationsSidebarBox.css'
import { useNamespaceStrict as useNamespace } from '@island.is/web/hooks'
import { interpolate, prettyName } from '@island.is/regulations'
import { RegulationMaybeDiff } from '@island.is/regulations/web'
import {
  RegulationsSidebarBox,
  RegulationsSidebarLink,
} from './RegulationsSidebarBox'
import { RegulationPageTexts } from './RegulationTexts.types'
import { useRegulationLinkResolver } from './regulationUtils'

export type RegulationEffectsBoxProps = {
  regulation: RegulationMaybeDiff
  texts: RegulationPageTexts
}

export const RegulationEffectsBox = (props: RegulationEffectsBoxProps) => {
  const { regulation, texts } = props
  const txt = useNamespace(texts)
  const { linkToRegulation } = useRegulationLinkResolver()

  if (!regulation.effects.length) {
    return null
  }

  return (
    <RegulationsSidebarBox
      title={interpolate(txt('effectsTitle'), {
        name: prettyName(regulation.name),
      })}
    >
      {regulation.effects.map((item, i) => {
        const name = prettyName(item.name)
        const label = interpolate(
          item.effect === 'amend' ? txt('effectsChange') : txt('effectsCancel'),
          { name },
        )
        const labelLong = label + ' ' + item.title

        return (
          <RegulationsSidebarLink
            key={'effects-' + i}
            href={linkToRegulation(item.name)}
            aria-label={labelLong}
          >
            {label}
          </RegulationsSidebarLink>
        )
      })}
    </RegulationsSidebarBox>
  )
}
