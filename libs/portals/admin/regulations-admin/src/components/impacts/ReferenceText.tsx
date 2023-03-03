import {
  HTMLText,
  RegName,
  Regulation,
  RegulationType,
} from '@island.is/regulations-tools/types'
import { HTMLDump } from '@island.is/regulations-tools/html'
import {
  getTexts,
  prettyName,
  formatdate,
} from '@island.is/regulations-tools/utils'
import * as s from './Impacts.css'
import * as ed from '../Editor.css'
import { RegulationDraftTypes } from '../../types'

type ReferenceTextProps = {
  baseName: RegName
  regulation: Regulation
}

const t = getTexts({
  saveErrorsLegend: 'Villur komu upp í vistun',

  effectiveDate: 'Tekur gildi þann',

  referenceLegend: 'Texti áhrifareglugerðar {name}',
  referenceMeta: 'Útgáfudagur: {published}',
  referenceEditLink: 'Leiðrétta',

  changeLegend: 'Uppfærður texti grunnreglugerðarinnar ({name})',
  changeCancel: 'Hætta við áhrifafærslu',
  changeDelete: 'Eyða áhrifafærslu',
  changeSave: 'Vista áhrifafærslu',
  changeReset: 'Reset',
  changeIntroduce: 'Skrá textabreytingu',
  changeAdd: 'Bæta við annari áhrifafærslu',

  cancellationLegend: 'Brottfelling grunnreglugerðar ({name})',
  cancellationCancel: 'Hætta við brottfellingu',
  cancellationDelete: 'Eyða brottfellingu',
  cancellationSave: 'Vista brottfellingu',
  cancellationReset: 'Reset',
  cancellationIntroduce: 'Skrá brottfellingu',

  buttonNext: 'Halda áfram',
  buttonFinish: 'Loka verkefni',

  savingMsg: 'Vista...',

  commentsTitle: 'Athugasemdir ritstjóra',
})

export const ReferenceText = (props: ReferenceTextProps) => {
  const { regulation } = props
  const { name, text, type, publishedDate, appendixes, comments } = regulation
  return (
    <div className={s.referenceTextContainer}>
      <div className={s.referenceText}>
        <h2 className={s.referenceTextLegend}>
          {t('referenceLegend', { name: prettyName(name) })}
        </h2>
        <div className={s.referenceTextMeta}>
          {t.arr('referenceMeta', {
            published: (
              <strong key="1">
                {formatdate(publishedDate, 'd. MMM yyyy')}
              </strong>
            ),
          })}{' '}
          {type === RegulationDraftTypes.base && (
            <>&nbsp; ({mapRegulationTypeToDisplayString(type)})</>
          )}
        </div>
        <div className={s.referenceTextInner}>
          <HTMLDump className={ed.classes.editor} html={text as HTMLText} />
          {appendixes.map(({ title, text }, i) => (
            <div className={s.referenceTextAppendix} key={i}>
              <h2 className={s.referenceTextAppendixTitle}>{title}</h2>
              <HTMLDump className={ed.classes.editor} html={text as HTMLText} />
            </div>
          ))}

          {comments && (
            <div className={s.referenceTextComments}>
              <h2 className={s.referenceTextCommentsTitle}>
                {t('commentsTitle')}
              </h2>
              <HTMLDump
                className={ed.classes.editor}
                html={comments as HTMLText}
              />
            </div>
          )}
        </div>{' '}
      </div>
    </div>
  )
}

// ===========================================================================

function mapRegulationTypeToDisplayString(type: RegulationType): string {
  const names: Record<RegulationType, string> = {
    base: 'Stofnreglugerð',
    amending: 'Breytingareglugerð',
  }
  return names[type] || 'Óþekkt'
}
