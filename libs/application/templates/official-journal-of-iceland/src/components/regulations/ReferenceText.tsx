/**
 * Ported from: libs/portals/admin/regulations-admin/src/components/impacts/ReferenceText.tsx
 *
 * Slide-in side panel showing the draft regulation text as a reference
 * while editing an amendment impact. The panel is fixed to the left edge
 * and slides into full view on hover.
 */
import { HTMLText, HTMLDump } from '@island.is/regulations'
import * as s from './ReferenceText.css'

// ---------------------------------------------------------------------------

type ReferenceTextProps = {
  /** Title of the draft regulation */
  title: string
  /** HTML body of the draft regulation */
  text: HTMLText
  /** Appendixes of the draft regulation */
  appendixes?: Array<{ title: string; text: string }>
  /** Label: true for base regulation, false for amending */
  asBase?: boolean
}

export const ReferenceText = (props: ReferenceTextProps) => {
  const { title, text, appendixes, asBase } = props

  return (
    <div className={s.referenceTextContainer}>
      <div className={s.referenceText}>
        <h2 className={s.referenceTextLegend}>
          {asBase
            ? 'Texti stofnreglugerðarinnar'
            : 'Texti breytingareglugerðar'}
        </h2>
        <div className={s.referenceTextInner}>
          {title && <h3 className={s.referenceTextTitle}>{title}</h3>}
          <HTMLDump className={s.referenceTextBody} html={text} />
          {appendixes?.map(({ title: apxTitle, text: apxText }, i) => (
            <div className={s.referenceTextAppendix} key={i}>
              <h4 className={s.referenceTextAppendixTitle}>{apxTitle}</h4>
              <HTMLDump
                className={s.referenceTextBody}
                html={apxText as HTMLText}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
