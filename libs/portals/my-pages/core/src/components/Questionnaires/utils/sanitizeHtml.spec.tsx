import { renderToStaticMarkup } from 'react-dom/server'
import { renderQuestionLabel, renderSanitizedHtml } from './sanitizeHtml'

const render = (html?: string | null) =>
  renderToStaticMarkup(<>{renderSanitizedHtml(html)}</>)

describe('renderSanitizedHtml', () => {
  it('keeps the formatting tags questionnaire backends produce', () => {
    // EL: htmlLabel "needs to use some html tags like, <b>, <u>"
    expect(render('Hvernig <b>líður</b> þér <u>í dag</u>?')).toBe(
      'Hvernig <b>líður</b> þér <u>í dag</u>?',
    )
    // LSH: description and instructions joined with <br/>
    expect(render('Lýsing<br/> Leiðbeiningar')).toBe(
      'Lýsing<br/> Leiðbeiningar',
    )
    expect(
      render('<p>Texti með <strong>áherslu</strong> og <em>skáletri</em></p>'),
    ).toBe('<p>Texti með <strong>áherslu</strong> og <em>skáletri</em></p>')
    expect(render('<ul><li>Eitt</li><li>Tvö</li></ul>')).toBe(
      '<ul><li>Eitt</li><li>Tvö</li></ul>',
    )
  })

  it('renders plain text and empty values unchanged', () => {
    expect(render('Hvernig líður þér í dag?')).toBe('Hvernig líður þér í dag?')
    expect(render('')).toBe('')
    expect(render(undefined)).toBe('')
    expect(render(null)).toBe('')
  })

  it('keeps safe links and forces them to open in a new tab', () => {
    expect(render('<a href="https://island.is">Ísland.is</a>')).toBe(
      '<a href="https://island.is" target="_blank" rel="noopener noreferrer">Ísland.is</a>',
    )
  })

  it('strips the Syndis iframe payload down to its text', () => {
    const payload =
      `AAAA<iframe srcdoc="<script src='https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.8.3/angular.min.js'></script>` +
      `<div ng-app>{{constructor.constructor('alert(document.domain)')()}}</div>">BBB`
    expect(render(payload)).toBe('AAAABBB')
  })

  describe('renderQuestionLabel', () => {
    const renderLabel = (htmlLabel?: string | null, label?: string | null) =>
      renderToStaticMarkup(<>{renderQuestionLabel(htmlLabel, label)}</>)

    it('prefers htmlLabel when it has text', () => {
      expect(renderLabel('<b>Feitletrað</b>', 'Venjulegt')).toBe(
        '<b>Feitletrað</b>',
      )
    })

    it('falls back to label when htmlLabel is missing or blank', () => {
      expect(renderLabel(undefined, 'Venjulegt')).toBe('Venjulegt')
      expect(renderLabel('', 'Venjulegt')).toBe('Venjulegt')
      expect(renderLabel('<p></p>', 'Venjulegt')).toBe('Venjulegt')
      expect(renderLabel('<span>&#8203;</span>', 'Venjulegt')).toBe('Venjulegt')
    })

    it('falls back to label when htmlLabel sanitizes down to nothing', () => {
      expect(renderLabel('<script>alert(1)</script>', 'Venjulegt')).toBe(
        'Venjulegt',
      )
    })
  })

  it('strips scripts, event handlers, styles and unsafe hrefs', () => {
    expect(render('<script>alert(1)</script>Spurning')).toBe('Spurning')
    expect(render('<b onclick="alert(1)">Feitletrað</b>')).toBe(
      '<b>Feitletrað</b>',
    )
    expect(render('<span style="color:red">Litað</span>')).toBe(
      '<span>Litað</span>',
    )
    expect(render('<img src="x" onerror="alert(1)">Mynd')).toBe('Mynd')
    expect(render('<a href="javascript:alert(1)">Hlekkur</a>')).toBe(
      '<a target="_blank" rel="noopener noreferrer">Hlekkur</a>',
    )
  })
})
