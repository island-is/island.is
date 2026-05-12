import {
  BankAccountField,
  DataProviderBuilderItem,
  DataProviderItem,
  DataProviderPermissionItem,
  ExternalDataProvider,
  FieldComponents,
  FieldTypes,
  FormItemTypes,
  FormLeaf,
  Section,
  SectionChildren,
  SubSection,
  FormText,
  FormTextWithLocale,
  StaticText,
  SubmitField,
} from '@island.is/application/types'
import { PageBuilder } from './PageBuilder'
import { buildBankAccountField } from '../lib/fieldBuilders'

type SectionBuilderOptions = Omit<Section, 'children' | 'id' | 'title' | 'type'>
type SubSectionBuilderOptions = Omit<
  SubSection,
  'children' | 'id' | 'title' | 'type'
>

type ExternalDataProviderOptions = {
  checkboxLabel?: StaticText
  dataProviders: DataProviderBuilderItem[]
  description?: StaticText
  enableMockPayment?: boolean
  otherPermissions?: DataProviderPermissionItem[]
  subDescription?: StaticText
  subTitle?: StaticText
  submitField?: SubmitFieldOptions
}

type SubmitFieldOptions = {
  actions: SubmitField['actions']
  id: string
  placement?: SubmitField['placement']
  refetchApplicationAfterSubmit?: SubmitField['refetchApplicationAfterSubmit']
  title?: FormText
}
type BankAccountFieldOptions = Omit<
  BankAccountField,
  'children' | 'component' | 'id' | 'title' | 'type'
>

const toDataProviderItem = (
  data: DataProviderBuilderItem,
): DataProviderItem => ({
  id: data.provider?.externalDataId ?? data.provider?.action ?? '',
  action: data.provider?.actionId,
  order: data.provider?.order,
  title: data.title ?? '',
  subTitle: data.subTitle,
  pageTitle: data.pageTitle,
  source: data.source,
})

const toSubmitField = (data: SubmitFieldOptions): SubmitField => ({
  id: data.id,
  title: data.title ?? '',
  actions: data.actions,
  placement: data.placement ?? 'footer',
  refetchApplicationAfterSubmit: data.refetchApplicationAfterSubmit ?? false,
  renderLongErrors: false,
  doesNotRequireAnswer: true,
  children: undefined,
  type: FieldTypes.SUBMIT,
  component: FieldComponents.SUBMIT,
})

export class SubSectionBuilder<TSchema = unknown> {
  private children: FormLeaf[] = []
  private _id: string
  private _title: FormTextWithLocale
  private opts?: SubSectionBuilderOptions

  constructor(
    id: string,
    title: FormTextWithLocale,
    opts?: SubSectionBuilderOptions,
  ) {
    this._id = id
    this._title = title
    this.opts = opts
  }

  addPage(
    id: string,
    title: FormTextWithLocale,
    builderFn: (p: PageBuilder<TSchema>) => void,
  ): this {
    const pageBuilder = new PageBuilder<TSchema>(id, title)
    builderFn(pageBuilder)
    this.children.push(pageBuilder.build())
    return this
  }

  addBankAccountField(
    id: string,
    title: FormText,
    opts?: BankAccountFieldOptions,
  ): this {
    this.children.push(buildBankAccountField({ id, title, ...opts }))
    return this
  }

  build(): SubSection {
    return {
      id: this._id,
      title: this._title,
      type: FormItemTypes.SUB_SECTION,
      children: this.children,
      ...this.opts,
    }
  }
}

export class SectionBuilder<TSchema = unknown> {
  private children: SectionChildren[] = []
  private _id: string
  private _title: FormTextWithLocale
  private opts?: SectionBuilderOptions

  constructor(id: string, title: FormTextWithLocale, opts?: SectionBuilderOptions) {
    this._id = id
    this._title = title
    this.opts = opts
  }

  addPage(
    id: string,
    title: FormTextWithLocale,
    builderFn: (p: PageBuilder<TSchema>) => void,
  ): this {
    const pageBuilder = new PageBuilder<TSchema>(id, title)
    builderFn(pageBuilder)
    this.children.push(pageBuilder.build())
    return this
  }

  addSubSection(
    id: string,
    title: FormTextWithLocale,
    builderFn: (s: SubSectionBuilder<TSchema>) => void,
    opts?: SubSectionBuilderOptions,
  ): this {
    const subSectionBuilder = new SubSectionBuilder<TSchema>(id, title, opts)
    builderFn(subSectionBuilder)
    this.children.push(subSectionBuilder.build())
    return this
  }

  addExternalDataProvider(
    id: string,
    title: StaticText,
    opts: ExternalDataProviderOptions,
  ): this {
    const externalDataProvider: ExternalDataProvider = {
      id,
      title,
      type: FormItemTypes.EXTERNAL_DATA_PROVIDER,
      children: undefined,
      isPartOfRepeater: false,
      dataProviders: opts.dataProviders.map(toDataProviderItem),
      ...(opts.checkboxLabel !== undefined && {
        checkboxLabel: opts.checkboxLabel,
      }),
      ...(opts.description !== undefined && { description: opts.description }),
      ...(opts.enableMockPayment !== undefined && {
        enableMockPayment: opts.enableMockPayment,
      }),
      ...(opts.otherPermissions !== undefined && {
        otherPermissions: opts.otherPermissions,
      }),
      ...(opts.subDescription !== undefined && {
        subDescription: opts.subDescription,
      }),
      ...(opts.subTitle !== undefined && { subTitle: opts.subTitle }),
      ...(opts.submitField !== undefined && {
        submitField: toSubmitField(opts.submitField),
      }),
    }

    this.children.push(externalDataProvider)
    return this
  }

  build(): Section {
    return {
      id: this._id,
      title: this._title,
      type: FormItemTypes.SECTION,
      children: this.children,
      ...this.opts,
    }
  }
}
