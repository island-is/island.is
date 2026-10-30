/**
 * @jest-environment jsdom
 */
import {
  generateFormHtml,
  GATEWAY_FORM_SUBMIT_TIMEOUT_MS,
  ThreeDSFormData,
  watchGatewayFormSubmit,
} from './3ds'

jest.mock('../environments/runtimeEnvironment', () => ({
  getPublicRuntimeEnv: () => ({ basepath: '/greida' }),
}))

const SCRIPT_PATH =
  'https://rapyd3ds.uat.valitor.com/ThreeDSecureManager/js/modirum/red.js'

const baseData: ThreeDSFormData = {
  postUrl: 'https://rapyd3ds.uat.valitor.com/challenge',
  scriptPath: SCRIPT_PATH,
  verificationFields: [
    { name: 'MD', value: 'md-1' },
    { name: 'PaReq', value: 'pareq-1' },
  ],
  authenticationType: 'Challenge',
}

const render = (data: ThreeDSFormData) => {
  const container = document.createElement('div')
  container.innerHTML = generateFormHtml(data)
  return container
}

describe('generateFormHtml', () => {
  it('renders the form the gateway script expects and loads the gateway script', () => {
    const container = render(baseData)

    const form = container.querySelector<HTMLFormElement>('form#webform0')
    expect(form?.getAttribute('action')).toBe(baseData.postUrl)
    expect(form?.getAttribute('method')).toBe('POST')
    expect(form?.getAttribute('accept-charset')).toBe('UTF-8')
    expect(
      form?.querySelector<HTMLInputElement>('input[name="MD"]')?.value,
    ).toBe('md-1')

    expect(
      container.querySelector('#flowType')?.getAttribute('data-value'),
    ).toBe('Challenge')

    const scripts = container.querySelectorAll('script')
    expect(scripts).toHaveLength(1)
    expect(scripts[0].getAttribute('src')).toBe(SCRIPT_PATH)
  })

  it('falls back to our own submit script when the gateway sends no scriptPath', () => {
    const container = render({ ...baseData, scriptPath: null })

    expect(container.querySelector('script')?.getAttribute('src')).toBe(
      '/greida/scripts/submitForm.js',
    )
  })

  it('ignores a scriptPath outside the gateway domain', () => {
    jest.spyOn(console, 'error').mockImplementation(() => undefined)

    for (const scriptPath of [
      'https://evil.example/red.js',
      'http://rapyd3ds.uat.valitor.com/red.js',
      'https://valitor.com.evil.example/red.js',
      'not a url',
    ]) {
      const container = render({ ...baseData, scriptPath })
      expect(container.querySelector('script')?.getAttribute('src')).toBe(
        '/greida/scripts/submitForm.js',
      )
    }
  })

  it('loads the execution script from the gateway page instead of a logging scriptPath', () => {
    // Shape of the Rapyd UAT response from 2026-10-30
    const container = render({
      ...baseData,
      scriptPath:
        'https://rapyd3ds.uat.valitor.com/ThreeDSecureManager/js/datadog-3ds-logging/datadog-3ds-core.js',
      cardVerificationRawResponse: `<html><head>
        <script src="https://rapyd3ds.uat.valitor.com/ThreeDSecureManager/js/datadog-3ds-logging/datadog-3ds-core.js"></script>
        <script src="https://rapyd3ds.uat.valitor.com/ThreeDSecureManager/js/datadog-3ds-logging/init.js"></script>
        </head><body><form id="webform0"></form>
        <script src="${SCRIPT_PATH}"></script>
        </body></html>`,
    })

    const scripts = container.querySelectorAll('script')
    expect(scripts).toHaveLength(1)
    expect(scripts[0].getAttribute('src')).toBe(SCRIPT_PATH)
  })

  it('ignores scripts outside the gateway domain in the gateway page', () => {
    const container = render({
      ...baseData,
      cardVerificationRawResponse: `<script src="${SCRIPT_PATH}"></script>
        <script src="https://www.datadoghq-browser-agent.com/eu1/v6/datadog-logs.js"></script>`,
    })

    expect(container.querySelector('script')?.getAttribute('src')).toBe(
      SCRIPT_PATH,
    )
  })

  it('falls back to scriptPath when the gateway page has no gateway script', () => {
    const container = render({
      ...baseData,
      cardVerificationRawResponse: '<html><body></body></html>',
    })

    expect(container.querySelector('script')?.getAttribute('src')).toBe(
      SCRIPT_PATH,
    )
  })

  it('renders the 3DS Method iframe and form when the gateway requires it', () => {
    const container = render({
      ...baseData,
      authenticationType: 'Method',
      tdsMethodPostUrl: 'https://acs.example.com/method',
      tdsMethodFields: [{ name: 'threeDSMethodData', value: 'abc' }],
    })

    const iframe = container.querySelector('iframe#tdsMmethodTgtFrame')
    expect(iframe?.getAttribute('name')).toBe('tdsMmethodTgtFrame')

    const methodForm = container.querySelector<HTMLFormElement>(
      'form#tdsMmethodForm',
    )
    expect(methodForm?.getAttribute('action')).toBe(
      'https://acs.example.com/method',
    )
    expect(methodForm?.getAttribute('target')).toBe('tdsMmethodTgtFrame')
    expect(
      methodForm?.querySelector<HTMLInputElement>(
        'input[name="threeDSMethodData"]',
      )?.value,
    ).toBe('abc')

    // The gateway script writes the method outcome into a txid input
    expect(
      container.querySelectorAll('form#webform0 input[name="txid"]'),
    ).toHaveLength(1)

    // The script must come after the elements it looks up
    const html = generateFormHtml({
      ...baseData,
      tdsMethodPostUrl: 'https://acs.example.com/method',
      tdsMethodFields: [{ name: 'threeDSMethodData', value: 'abc' }],
    })
    expect(html.indexOf('<script')).toBeGreaterThan(html.indexOf('webform0'))
    expect(html.indexOf('<script')).toBeGreaterThan(
      html.indexOf('tdsMmethodForm'),
    )
  })

  it('does not duplicate txid when the gateway already provides it', () => {
    const container = render({
      ...baseData,
      verificationFields: [
        ...baseData.verificationFields,
        { name: 'txid', value: '' },
      ],
      tdsMethodPostUrl: 'https://acs.example.com/method',
      tdsMethodFields: [{ name: 'threeDSMethodData', value: 'abc' }],
    })

    expect(container.querySelectorAll('input[name="txid"]')).toHaveLength(1)
  })

  it('omits the 3DS Method elements when the gateway does not require it', () => {
    const container = render(baseData)

    expect(container.querySelector('#tdsMmethodForm')).toBeNull()
    expect(container.querySelector('#tdsMmethodTgtFrame')).toBeNull()
    expect(container.querySelector('input[name="txid"]')).toBeNull()
  })

  it('uses the charset from the _charset_ verification field', () => {
    const container = render({
      ...baseData,
      verificationFields: [{ name: '_charset_', value: 'ISO-8859-1' }],
    })

    expect(
      container.querySelector('form#webform0')?.getAttribute('accept-charset'),
    ).toBe('ISO-8859-1')
  })

  it('escapes field values so they cannot break out of the markup', () => {
    const container = render({
      ...baseData,
      verificationFields: [
        { name: 'MD', value: '"><script src="https://evil.example"></script>' },
      ],
    })

    expect(container.querySelectorAll('script')).toHaveLength(1)
    expect(
      container.querySelector<HTMLInputElement>('input[name="MD"]')?.value,
    ).toBe('"><script src="https://evil.example"></script>')
  })
})

describe('watchGatewayFormSubmit', () => {
  let iframe: HTMLIFrameElement
  let iframeWindow: Window
  let submitSpy: jest.SpyInstance

  beforeEach(() => {
    jest.useFakeTimers()
    jest.spyOn(console, 'error').mockImplementation(() => undefined)

    iframe = document.createElement('iframe')
    document.body.appendChild(iframe)
    iframeWindow = iframe.contentWindow as Window
    iframeWindow.document.body.innerHTML = generateFormHtml(baseData)

    // The form belongs to the iframe's own window
    const IframeFormElement = (
      iframeWindow as Window & { HTMLFormElement: typeof HTMLFormElement }
    ).HTMLFormElement
    submitSpy = jest
      .spyOn(IframeFormElement.prototype, 'submit')
      .mockImplementation(() => undefined)
  })

  afterEach(() => {
    iframe.remove()
    jest.useRealTimers()
    jest.restoreAllMocks()
  })

  it('submits the form when nothing has navigated the iframe in time', () => {
    watchGatewayFormSubmit(iframeWindow)

    jest.advanceTimersByTime(GATEWAY_FORM_SUBMIT_TIMEOUT_MS - 1)
    expect(submitSpy).not.toHaveBeenCalled()

    jest.advanceTimersByTime(1)
    expect(submitSpy).toHaveBeenCalledTimes(1)
    expect(submitSpy.mock.instances[0]).toBe(
      iframeWindow.document.getElementById('webform0'),
    )
  })

  it('does not submit again when the gateway script already navigated the iframe', () => {
    watchGatewayFormSubmit(iframeWindow)

    iframeWindow.dispatchEvent(new Event('beforeunload'))
    jest.advanceTimersByTime(GATEWAY_FORM_SUBMIT_TIMEOUT_MS)

    expect(submitSpy).not.toHaveBeenCalled()
  })

  it('does not submit after the watch is cancelled', () => {
    const cancel = watchGatewayFormSubmit(iframeWindow)

    cancel()
    jest.advanceTimersByTime(GATEWAY_FORM_SUBMIT_TIMEOUT_MS)

    expect(submitSpy).not.toHaveBeenCalled()
  })

  it('does nothing when the iframe has no 3DS form', () => {
    iframeWindow.document.body.innerHTML = ''
    watchGatewayFormSubmit(iframeWindow)

    jest.advanceTimersByTime(GATEWAY_FORM_SUBMIT_TIMEOUT_MS)

    expect(submitSpy).not.toHaveBeenCalled()
  })
})
