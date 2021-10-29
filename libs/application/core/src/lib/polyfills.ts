interface SubmitEvent extends Event {
  submitter: HTMLElement | null
}

/**
 * Adding polyfill for submitter property on SubmitEvent
 * https://developer.mozilla.org/en-US/docs/Web/API/SubmitEvent/submitter
 * This property is not yet supported on Safari which breaks the Application System
 * buildSubmitField() with more than one actions.
 */
export const submitterPolyfill = () => {
  let lastBtn: Element | null = null

  document.addEventListener(
    'click',
    (e: Event) => {
      if (e.target instanceof Element) {
        lastBtn = e.target.closest('button, input[type=submit]')
      }
    },
    true,
  )

  document.addEventListener(
    'submit',
    (e: Event) => {
      if ((e as SubmitEvent).submitter) return

      const candidates = [document.activeElement, lastBtn]
      lastBtn = null

      for (let candidate of candidates) {
        if (!candidate) continue
        if (!(candidate as HTMLButtonElement).form) continue
        if (!candidate.matches('button, input[type=button], input[type=image]'))
          continue

        Object.defineProperty(e, 'submitter', { value: candidate })
        return
      }

      Object.defineProperty(e, 'submitter', {
        value: (e.target as Element)?.querySelector(
          'button, input[type=button], input[type=image]',
        ),
      })
    },
    true,
  )
}

/**
 * Register polyfills
 */
submitterPolyfill()
