import { FormBuilder } from '@island.is/application/core'
import { convertFormToScreens } from '@island.is/application/screen-compiler'
import type { MultiFieldScreen } from '@island.is/application/screen-compiler'
import { Application, FormItemTypes } from '@island.is/application/types'

import { FormTextResolver } from '../i18n-resolver.service'
import { mapScreenToComponents } from '../screen-mapper'

const stubResolver = {
  resolve: (v: unknown) =>
    typeof v === 'string' ? v : v != null ? String(v) : '',
} as unknown as FormTextResolver

describe('mapScreenToComponents — file upload field parity props', () => {
  it('maps the legacy FileUploadField props onto the component DTO', () => {
    const form = new FormBuilder('f', 'Form')
      .addSection('sec', 'Section', (section) => {
        section.addPage('page1', 'Page', (page) => {
          page.addFileUploadField('rentalCondition.files', 'Skjöl', {
            uploadHeader: 'Hlaða inn skjölum',
            uploadDescription: 'Dragðu skjöl hingað',
            uploadButtonLabel: 'Velja skjöl',
            introduction: 'Inngangur',
            uploadAccept: '.pdf, .doc, .docx, .rtf, .jpg, .jpeg, .png, .heic',
            uploadMultiple: true,
            maxSize: 5_000_000,
            totalMaxSize: 100_000_000,
            maxFileCount: 10,
            maxSizeErrorText: 'Of stór skrá',
            forImageUpload: false,
          })
        })
      })
      .build()

    const screens = convertFormToScreens(form, {}, {}, null)
    const multi = screens.find(
      (s): s is MultiFieldScreen =>
        'type' in s &&
        (s as { type: string }).type === FormItemTypes.MULTI_FIELD &&
        (s as MultiFieldScreen).id === 'page1',
    )

    expect(multi).toBeDefined()

    const components = mapScreenToComponents(
      multi!,
      stubResolver,
      {} as Application,
    )
    const dto = components.find((c) => c.id === 'rentalCondition.files')

    expect(dto).toBeDefined()
    expect(dto?.label).toBe('Skjöl')
    expect(dto?.uploadHeader).toBe('Hlaða inn skjölum')
    expect(dto?.uploadDescription).toBe('Dragðu skjöl hingað')
    expect(dto?.uploadButtonLabel).toBe('Velja skjöl')
    expect(dto?.introduction).toBe('Inngangur')
    expect(dto?.accept).toBe(
      '.pdf, .doc, .docx, .rtf, .jpg, .jpeg, .png, .heic',
    )
    expect(dto?.uploadMultiple).toBe(true)
    expect(dto?.maxSize).toBe(5_000_000)
    expect(dto?.totalMaxSize).toBe(100_000_000)
    expect(dto?.maxFileCount).toBe(10)
    expect(dto?.maxSizeErrorText).toBe('Of stór skrá')
    expect(dto?.forImageUpload).toBe(false)
  })

  it('does not leak BaseField.description into placeholder for FILEUPLOAD', () => {
    const form = new FormBuilder('f', 'Form')
      .addSection('sec', 'Section', (section) => {
        section.addPage('page1', 'Page', (page) => {
          page.addFileUploadField('files.with.description', 'Skjöl', {
            description: 'This is a base description',
            uploadAccept: '.pdf',
          })
        })
      })
      .build()

    const screens = convertFormToScreens(form, {}, {}, null)
    const multi = screens.find(
      (s): s is MultiFieldScreen =>
        'type' in s &&
        (s as { type: string }).type === FormItemTypes.MULTI_FIELD &&
        (s as MultiFieldScreen).id === 'page1',
    )

    const components = mapScreenToComponents(
      multi!,
      stubResolver,
      {} as Application,
    )
    const dto = components.find((c) => c.id === 'files.with.description')

    expect(dto).toBeDefined()
    expect(dto?.placeholder).toBeUndefined()
  })
})
