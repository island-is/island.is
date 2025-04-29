// To parse this data:
//
//   import { Convert, Translation } from "./file";
//
//   const translation = Convert.toTranslation(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface Translation {
  home: TranslationHome
  header: Header
  footer: Footer
  gdpr: Gdpr
  myCars: MyCars
  recycle: Confirm
  confirm: Confirm
  handover: Handover
  completed: Completed
  processes: Processes
  deregisterOverview: DeregisterOverview
  companyInfo: CompanyInfo
  companyInfoForm: CompanyInfoForm
  deregisterSidenav: DeregisterSidenav
  deregisterVehicle: TranslationDeregisterVehicle
  recyclingFundOverview: RecyclingFundOverview
  recyclingFundSidenav: RecyclingFundSidenav
  recyclingCompanies: RecyclingCompanies
  accessControl: AccessControl
  errorBoundary: ErrorBoundary
  routes: Routes
  municipalities: Municipalities
  alerts: Alerts
}

export interface AccessControl {
  title: string
  info: string
  empty: string
  tableHeaders: AccessControlTableHeaders
  status: AccessControlStatus
  buttons: SubtitlesClass
  modal: Modal
}

export interface SubtitlesClass {
  add: string
  edit: string
  delete: string
  actions?: string
}

export interface Modal {
  titles: SubtitlesClass
  subtitles: SubtitlesClass
  inputs: ModalInputs
  buttons: FormButtons
}

export interface FormButtons {
  cancel: string
  continue: string
  confirm: string
  goBack?: string
}

export interface ModalInputs {
  nationalId: Email
  name: Name
  email: Email
  phone: Name
  recyclingLocation: RecyclingLocation
  role: Name
  partner: Name
  municipality: Name
  recyclingCompanyOther: string
}

export interface Email {
  label: string
  placeholder: string
  rules: EmailRules
}

export interface EmailRules {
  required: string
  validate: string
}

export interface Name {
  label: string
  placeholder: string
  rules: NameRules
}

export interface NameRules {
  required: string
}

export interface RecyclingLocation {
  label: string
  placeholder: string
  rules: RecyclingLocationRules
}

export interface RecyclingLocationRules {
  validate: string
}

export interface AccessControlStatus {
  active: string
  inactive: string
}

export interface AccessControlTableHeaders {
  nationalId: string
  name: string
  role: string
  partner: string
  email: string
  phone: string
  recyclingLocation: string
}

export interface CompanyInfo {
  title: string
  info: string
  empty: string
  subtitles: CompanyInfoSubtitles
  buttons: SubtitlesClass
}

export interface CompanyInfoSubtitles {
  location: string
}

export interface CompanyInfoForm {
  addTitle: string
  editTitle: string
  form: CompanyInfoFormForm
  buttons: CompanyInfoFormButtons
  success: string
}

export interface CompanyInfoFormButtons {
  add: string
  save: string
  cancel: string
}

export interface CompanyInfoFormForm {
  title: string
  company: FormCompany
  visitingAddress: Search
  postNumber: Search
  city: Search
  website: Search
  phoneNumber: Search
}

export interface Search {
  label: string
  placeholder: string
}

export interface FormCompany {
  label: string
}

export interface Completed {
  title: string
  subTitles: CompletedSubTitles
  info: CompletedInfo
  confirmedBy: ConfirmedBy
  error: CompletedError
  buttons: CompletedButtons
}

export interface CompletedButtons {
  close: string
}

export interface ConfirmedBy {
  user: string
  company: string
  authority: string
  fund: string
}

export interface CompletedError {
  title: string
  message: string
  primaryButton: string
  secondaryButton?: string
}

export interface CompletedInfo {
  oldDeregistration: string
  payment: string
  paymentLinkText: string
}

export interface CompletedSubTitles {
  summary: string
  payment: string
}

export interface Confirm {
  title: string
  subTitles?: ConfirmSubTitles
  info: string
  buttons: ConfirmButtons
  input?: Input
  checkbox?: Checkbox
}

export interface ConfirmButtons {
  cancel: string
  continue: string
}

export interface Checkbox {
  label: string
  linkLabel: string
}

export interface Input {
  label: string
  placeholder: string
  errors: Errors
}

export interface Errors {
  empty: string
  length: string
  invalidRegNumber: string
}

export interface ConfirmSubTitles {
  confirm: string
}

export interface DeregisterOverview {
  title: string
  info: string
  subtitles: DeregisterOverviewSubtitles
  buttons: DeregisterOverviewButtons
  search: Search
  table: string[]
}

export interface DeregisterOverviewButtons {
  deregister: string
}

export interface DeregisterOverviewSubtitles {
  history: string
}

export interface DeregisterSidenav {
  title: string
  deregister: string
  companyInfo: string
  accessControl: string
}

export interface TranslationDeregisterVehicle {
  select: Confirm
  deregister: Deregister
}

export interface Deregister {
  titles: InfoClass
  info: InfoClass
  buttons: DeregisterButtons
  success: string
  error: CompletedError
  currentMileage: Milage
  numberplate: NumberPlate
}

export interface Milage {
  label: string
  rules: MilageRules
  info: string
}

export interface MilageRules {
  validate: string
}

export interface NumberPlate {
  sectionTitle: string
  alert: DeregisteredMessages
  count: string
  lost: string
  missingInfo: string
}

export interface DeregisteredMessages {
  info: Message
  warning: Message
}
export interface Message {
  title: string
  message: string
}

export interface DeregisterButtons {
  back: string
  confirm: string
}

export interface InfoClass {
  success: string
  error: string
  notfound?: string
  loading?: string
}

export interface ErrorBoundary {
  title: string
  contents: string[]
}

export interface Footer {
  topLinksInfo: BottomLink[]
  topLinksContact: BottomLink[]
  bottomLinksTitle: string
  bottomLinks: BottomLink[]
}

export interface BottomLink {
  title: string
  href: string
}

export interface Gdpr {
  title: string
  subTitles: GdprSubTitles
  info: string
  checkbox: string
  buttons: GdprButtons
  error: GdprError
}

export interface GdprButtons {
  continue: string
}

export interface GdprError {
  message: string
  primaryButton: string
}

export interface GdprSubTitles {
  info: string
}

export interface Handover {
  titles: InfoClass
  info: string
  subTitles: HandoverSubTitles
  subInfo: string
  buttons: HandoverButtons
  error: CompletedError
  cancelModal: CancelModal
}

export interface HandoverButtons {
  cancel: string
  close: string
}

export interface CancelModal {
  titles: CancelModalTitles
  info: string
  buttons: ConfirmButtons
  error: CompletedError
}

export interface CancelModalTitles {
  info: string
  error: string
}

export interface HandoverSubTitles {
  nextStep: string
  companies: string
}

export interface Header {
  logoutText: string
}

export interface TranslationHome {
  title: string
}

export interface MyCars {
  title: string
  subTitles: MyCarsSubTitles
  info: MyCarsInfo
  actions: Actions
  status: MyCarsStatus
  buttons: MyCarsButtons
  tooltip: Tooltip
  error: GdprError
}

export interface Actions {
  valid: string
  invalid: string
}

export interface MyCarsButtons {
  openProcess: string
  seeDetails: string
}

export interface MyCarsInfo {
  noCarsAvailable: string
}

export interface MyCarsStatus {
  coOwned: string
  recycle: string
  done: string
}

export interface MyCarsSubTitles {
  pending: string
  active: string
  done: string
}

export interface Tooltip {
  text: string
  link: string
}

export interface NotFound {
  title: string
  message: string
  button: string
}

export interface Processes {
  step: string
  outOf: string
  citizen: Citizen
  company: ProcessesCompany
}

export interface Citizen {
  title: string
  sections: string[]
  completed: string
}

export interface ProcessesCompany {
  title: string
  sections: string[]
}

export interface RecyclingCompanies {
  title: string
  info: string
  empty: string
  subtitles: RecyclingCompaniesSubtitles
  tableHeaders: RecyclingCompaniesTableHeaders
  status: AccessControlStatus
  buttons: RecyclingCompaniesButtons
  recyclingCompany: RecyclingCompany
}

export interface RecyclingCompaniesButtons {
  add: string
  view: string
  addMunicipality: string
}

export interface RecyclingCompany {
  view: View
  add: Add
  form: RecyclingCompanyForm
}

export interface Municipalities {
  title: string
  info: string
  empty: string
  subtitles: RecyclingCompaniesSubtitles
  tableHeaders: RecyclingCompaniesTableHeaders
  status: AccessControlStatus
  buttons: RecyclingCompaniesButtons
  municipality: Municipality
}

export interface Municipality {
  view: View
  add: Add
  form: RecyclingCompanyForm
}

export interface Add {
  title: string
  breadcrumb: string
  info: string
  added: string
}

export interface RecyclingCompanyForm {
  inputs: FormInputs
  buttons: FormButtons
}

export interface FormInputs {
  companyId: Name
  companyName: Name
  nationalId: Email
  email: Email
  address: Name
  postnumber: Name
  city: Name
  website: Name
  phone: Name
  active: Name
  municipality: Name
}

export interface View {
  title: string
  breadcrumb: string
  info: string
  updated: string
  deleted: string
}

export interface RecyclingCompaniesSubtitles {
  companies: string
}

export interface RecyclingCompaniesTableHeaders {
  id: string
  name: string
  address: string
  postnumber: string
  email: string
  status: string
}

export interface RecyclingFundOverview {
  title: string
  subtitles: RecyclingFundOverviewSubtitles
  info: string
  buttons: RecyclingFundOverviewButtons
  search: Search
  table: string[]
}

export interface RecyclingFundOverviewButtons {
  export: string
}

export interface RecyclingFundOverviewSubtitles {
  deregistered: string
}

export interface RecyclingFundSidenav {
  title: string
  municipalityTitle: string
  recycled: string
  companies: string
  accessControl: string
  municipalities: string
}

export interface Routes {
  home: RoutesHome
  myCars: string
  recycleVehicle: RecycleVehicle
  deregisterVehicle: RoutesDeregisterVehicle
  recycledVehicles: string
  accessControl: string
  accessControlCompany: string
  recyclingCompanies: RecyclingCompaniesClass
  companyInfo: RecyclingCompaniesClass
  municipalities: RecyclingCompaniesClass
}

export interface RecyclingCompaniesClass {
  baseRoute: string
  add: string
  edit: string
}

export interface RoutesDeregisterVehicle {
  baseRoute: string
  select: string
  deregister: string
}

export interface RoutesHome {
  citizen: string
  recyclingCompanyAdmin?: string
  recyclingCompany: string
  recyclingFund: string
}

export interface RecycleVehicle {
  baseRoute: string
  recycle: string
  confirm: string
  handover: string
  completed: string
}

export interface Alerts {
  accessDenied: Message
  notFound: NotFound
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
  public static toTranslation(json: string): Translation {
    return cast(JSON.parse(json), r('Translation'))
  }

  public static translationToJson(value: Translation): string {
    return JSON.stringify(uncast(value, r('Translation')), null, 2)
  }
}

function invalidValue(typ: any, val: any, key: any = ''): never {
  if (key) {
    throw Error(
      `Invalid value for key "${key}". Expected type ${JSON.stringify(
        typ,
      )} but got ${JSON.stringify(val)}`,
    )
  }
  throw Error(
    `Invalid value ${JSON.stringify(val)} for type ${JSON.stringify(typ)}`,
  )
}

function jsonToJSProps(typ: any): any {
  if (typ.jsonToJS === undefined) {
    const map: any = {}
    typ.props.forEach((p: any) => (map[p.json] = { key: p.js, typ: p.typ }))
    typ.jsonToJS = map
  }
  return typ.jsonToJS
}

function jsToJSONProps(typ: any): any {
  if (typ.jsToJSON === undefined) {
    const map: any = {}
    typ.props.forEach((p: any) => (map[p.js] = { key: p.json, typ: p.typ }))
    typ.jsToJSON = map
  }
  return typ.jsToJSON
}

function transform(val: any, typ: any, getProps: any, key: any = ''): any {
  function transformPrimitive(typ: string, val: any): any {
    if (typeof typ === typeof val) return val
    return invalidValue(typ, val, key)
  }

  function transformUnion(typs: any[], val: any): any {
    // val must validate against one typ in typs
    const l = typs.length
    for (let i = 0; i < l; i++) {
      const typ = typs[i]
      try {
        return transform(val, typ, getProps)
      } catch (_) {}
    }
    return invalidValue(typs, val)
  }

  function transformEnum(cases: string[], val: any): any {
    if (cases.indexOf(val) !== -1) return val
    return invalidValue(cases, val)
  }

  function transformArray(typ: any, val: any): any {
    // val must be an array with no invalid elements
    if (!Array.isArray(val)) return invalidValue('array', val)
    return val.map((el) => transform(el, typ, getProps))
  }

  function transformDate(val: any): any {
    if (val === null) {
      return null
    }
    const d = new Date(val)
    if (isNaN(d.valueOf())) {
      return invalidValue('Date', val)
    }
    return d
  }

  function transformObject(
    props: { [k: string]: any },
    additional: any,
    val: any,
  ): any {
    if (val === null || typeof val !== 'object' || Array.isArray(val)) {
      return invalidValue('object', val)
    }
    const result: any = {}
    Object.getOwnPropertyNames(props).forEach((key) => {
      const prop = props[key]
      const v = Object.prototype.hasOwnProperty.call(val, key)
        ? val[key]
        : undefined
      result[prop.key] = transform(v, prop.typ, getProps, prop.key)
    })
    Object.getOwnPropertyNames(val).forEach((key) => {
      if (!Object.prototype.hasOwnProperty.call(props, key)) {
        result[key] = transform(val[key], additional, getProps, key)
      }
    })
    return result
  }

  if (typ === 'any') return val
  if (typ === null) {
    if (val === null) return val
    return invalidValue(typ, val)
  }
  if (typ === false) return invalidValue(typ, val)
  while (typeof typ === 'object' && typ.ref !== undefined) {
    typ = typeMap[typ.ref]
  }
  if (Array.isArray(typ)) return transformEnum(typ, val)
  if (typeof typ === 'object') {
    return typ.hasOwnProperty('unionMembers')
      ? transformUnion(typ.unionMembers, val)
      : typ.hasOwnProperty('arrayItems')
      ? transformArray(typ.arrayItems, val)
      : typ.hasOwnProperty('props')
      ? transformObject(getProps(typ), typ.additional, val)
      : invalidValue(typ, val)
  }
  // Numbers can be parsed by Date but shouldn't be.
  if (typ === Date && typeof val !== 'number') return transformDate(val)
  return transformPrimitive(typ, val)
}

function cast<T>(val: any, typ: any): T {
  return transform(val, typ, jsonToJSProps)
}

function uncast<T>(val: T, typ: any): any {
  return transform(val, typ, jsToJSONProps)
}

function a(typ: any) {
  return { arrayItems: typ }
}

function u(...typs: any[]) {
  return { unionMembers: typs }
}

function o(props: any[], additional: any) {
  return { props, additional }
}

function m(additional: any) {
  return { props: [], additional }
}

function r(name: string) {
  return { ref: name }
}

const typeMap: any = {
  Translation: o(
    [
      { json: 'home', js: 'home', typ: r('TranslationHome') },
      { json: 'header', js: 'header', typ: r('Header') },
      { json: 'footer', js: 'footer', typ: r('Footer') },
      { json: 'gdpr', js: 'gdpr', typ: r('Gdpr') },
      { json: 'myCars', js: 'myCars', typ: r('MyCars') },
      { json: 'recycle', js: 'recycle', typ: r('Confirm') },
      { json: 'confirm', js: 'confirm', typ: r('Confirm') },
      { json: 'handover', js: 'handover', typ: r('Handover') },
      { json: 'completed', js: 'completed', typ: r('Completed') },
      { json: 'processes', js: 'processes', typ: r('Processes') },
      {
        json: 'deregisterOverview',
        js: 'deregisterOverview',
        typ: r('DeregisterOverview'),
      },
      { json: 'companyInfo', js: 'companyInfo', typ: r('CompanyInfo') },
      {
        json: 'companyInfoForm',
        js: 'companyInfoForm',
        typ: r('CompanyInfoForm'),
      },
      {
        json: 'deregisterSidenav',
        js: 'deregisterSidenav',
        typ: r('DeregisterSidenav'),
      },
      {
        json: 'deregisterVehicle',
        js: 'deregisterVehicle',
        typ: r('TranslationDeregisterVehicle'),
      },
      {
        json: 'recyclingFundOverview',
        js: 'recyclingFundOverview',
        typ: r('RecyclingFundOverview'),
      },
      {
        json: 'recyclingFundSidenav',
        js: 'recyclingFundSidenav',
        typ: r('RecyclingFundSidenav'),
      },
      {
        json: 'recyclingCompanies',
        js: 'recyclingCompanies',
        typ: r('RecyclingCompanies'),
      },
      { json: 'accessControl', js: 'accessControl', typ: r('AccessControl') },
      { json: 'notFound', js: 'notFound', typ: r('NotFound') },
      { json: 'errorBoundary', js: 'errorBoundary', typ: r('ErrorBoundary') },
      { json: 'routes', js: 'routes', typ: r('Routes') },
    ],
    false,
  ),
  AccessControl: o(
    [
      { json: 'title', js: 'title', typ: '' },
      { json: 'info', js: 'info', typ: '' },
      { json: 'empty', js: 'empty', typ: '' },
      {
        json: 'tableHeaders',
        js: 'tableHeaders',
        typ: r('AccessControlTableHeaders'),
      },
      { json: 'status', js: 'status', typ: r('AccessControlStatus') },
      { json: 'buttons', js: 'buttons', typ: r('SubtitlesClass') },
      { json: 'modal', js: 'modal', typ: r('Modal') },
    ],
    false,
  ),
  SubtitlesClass: o(
    [
      { json: 'add', js: 'add', typ: '' },
      { json: 'edit', js: 'edit', typ: '' },
      { json: 'delete', js: 'delete', typ: '' },
      { json: 'actions', js: 'actions', typ: u(undefined, '') },
    ],
    false,
  ),
  Modal: o(
    [
      { json: 'titles', js: 'titles', typ: r('SubtitlesClass') },
      { json: 'subtitles', js: 'subtitles', typ: r('SubtitlesClass') },
      { json: 'inputs', js: 'inputs', typ: r('ModalInputs') },
      { json: 'buttons', js: 'buttons', typ: r('FormButtons') },
    ],
    false,
  ),
  FormButtons: o(
    [
      { json: 'cancel', js: 'cancel', typ: '' },
      { json: 'continue', js: 'continue', typ: '' },
      { json: 'confirm', js: 'confirm', typ: '' },
      { json: 'goBack', js: 'goBack', typ: u(undefined, '') },
    ],
    false,
  ),
  ModalInputs: o(
    [
      { json: 'nationalId', js: 'nationalId', typ: r('Email') },
      { json: 'name', js: 'name', typ: r('Name') },
      { json: 'email', js: 'email', typ: r('Email') },
      { json: 'phone', js: 'phone', typ: r('Name') },
      {
        json: 'recyclingLocation',
        js: 'recyclingLocation',
        typ: r('RecyclingLocation'),
      },
      { json: 'role', js: 'role', typ: r('Name') },
      { json: 'partner', js: 'partner', typ: r('Name') },
    ],
    false,
  ),
  Email: o(
    [
      { json: 'label', js: 'label', typ: '' },
      { json: 'placeholder', js: 'placeholder', typ: '' },
      { json: 'rules', js: 'rules', typ: r('EmailRules') },
    ],
    false,
  ),
  EmailRules: o(
    [
      { json: 'required', js: 'required', typ: '' },
      { json: 'validate', js: 'validate', typ: '' },
    ],
    false,
  ),
  Name: o(
    [
      { json: 'label', js: 'label', typ: '' },
      { json: 'placeholder', js: 'placeholder', typ: '' },
      { json: 'rules', js: 'rules', typ: r('NameRules') },
    ],
    false,
  ),
  NameRules: o([{ json: 'required', js: 'required', typ: '' }], false),
  RecyclingLocation: o(
    [
      { json: 'label', js: 'label', typ: '' },
      { json: 'placeholder', js: 'placeholder', typ: '' },
      { json: 'rules', js: 'rules', typ: r('RecyclingLocationRules') },
    ],
    false,
  ),
  RecyclingLocationRules: o(
    [{ json: 'validate', js: 'validate', typ: '' }],
    false,
  ),
  AccessControlStatus: o(
    [
      { json: 'active', js: 'active', typ: '' },
      { json: 'inactive', js: 'inactive', typ: '' },
    ],
    false,
  ),
  AccessControlTableHeaders: o(
    [
      { json: 'nationalId', js: 'nationalId', typ: '' },
      { json: 'name', js: 'name', typ: '' },
      { json: 'role', js: 'role', typ: '' },
      { json: 'partner', js: 'partner', typ: '' },
      { json: 'email', js: 'email', typ: '' },
      { json: 'phone', js: 'phone', typ: '' },
      { json: 'recyclingLocation', js: 'recyclingLocation', typ: '' },
    ],
    false,
  ),
  CompanyInfo: o(
    [
      { json: 'title', js: 'title', typ: '' },
      { json: 'info', js: 'info', typ: '' },
      { json: 'empty', js: 'empty', typ: '' },
      { json: 'subtitles', js: 'subtitles', typ: r('CompanyInfoSubtitles') },
      { json: 'buttons', js: 'buttons', typ: r('SubtitlesClass') },
    ],
    false,
  ),
  CompanyInfoSubtitles: o(
    [{ json: 'location', js: 'location', typ: '' }],
    false,
  ),
  CompanyInfoForm: o(
    [
      { json: 'addTitle', js: 'addTitle', typ: '' },
      { json: 'editTitle', js: 'editTitle', typ: '' },
      { json: 'form', js: 'form', typ: r('CompanyInfoFormForm') },
      { json: 'buttons', js: 'buttons', typ: r('CompanyInfoFormButtons') },
      { json: 'success', js: 'success', typ: '' },
    ],
    false,
  ),
  CompanyInfoFormButtons: o(
    [
      { json: 'add', js: 'add', typ: '' },
      { json: 'save', js: 'save', typ: '' },
      { json: 'cancel', js: 'cancel', typ: '' },
    ],
    false,
  ),
  CompanyInfoFormForm: o(
    [
      { json: 'title', js: 'title', typ: '' },
      { json: 'company', js: 'company', typ: r('FormCompany') },
      { json: 'visitingAddress', js: 'visitingAddress', typ: r('Search') },
      { json: 'postNumber', js: 'postNumber', typ: r('Search') },
      { json: 'city', js: 'city', typ: r('Search') },
      { json: 'website', js: 'website', typ: r('Search') },
      { json: 'phoneNumber', js: 'phoneNumber', typ: r('Search') },
    ],
    false,
  ),
  Search: o(
    [
      { json: 'label', js: 'label', typ: '' },
      { json: 'placeholder', js: 'placeholder', typ: '' },
    ],
    false,
  ),
  FormCompany: o([{ json: 'label', js: 'label', typ: '' }], false),
  Completed: o(
    [
      { json: 'title', js: 'title', typ: '' },
      { json: 'subTitles', js: 'subTitles', typ: r('CompletedSubTitles') },
      { json: 'info', js: 'info', typ: r('CompletedInfo') },
      { json: 'confirmedBy', js: 'confirmedBy', typ: r('ConfirmedBy') },
      { json: 'error', js: 'error', typ: r('CompletedError') },
      { json: 'buttons', js: 'buttons', typ: r('CompletedButtons') },
    ],
    false,
  ),
  CompletedButtons: o([{ json: 'close', js: 'close', typ: '' }], false),
  ConfirmedBy: o(
    [
      { json: 'user', js: 'user', typ: '' },
      { json: 'company', js: 'company', typ: '' },
      { json: 'authority', js: 'authority', typ: '' },
      { json: 'fund', js: 'fund', typ: '' },
    ],
    false,
  ),
  CompletedError: o(
    [
      { json: 'title', js: 'title', typ: '' },
      { json: 'message', js: 'message', typ: '' },
      { json: 'primaryButton', js: 'primaryButton', typ: '' },
      { json: 'secondaryButton', js: 'secondaryButton', typ: u(undefined, '') },
    ],
    false,
  ),
  CompletedInfo: o(
    [
      { json: 'oldDeregistration', js: 'oldDeregistration', typ: '' },
      { json: 'payment', js: 'payment', typ: '' },
      { json: 'paymentLinkText', js: 'paymentLinkText', typ: '' },
    ],
    false,
  ),
  CompletedSubTitles: o(
    [
      { json: 'summary', js: 'summary', typ: '' },
      { json: 'payment', js: 'payment', typ: '' },
    ],
    false,
  ),
  Confirm: o(
    [
      { json: 'title', js: 'title', typ: '' },
      {
        json: 'subTitles',
        js: 'subTitles',
        typ: u(undefined, r('ConfirmSubTitles')),
      },
      { json: 'info', js: 'info', typ: '' },
      { json: 'buttons', js: 'buttons', typ: r('ConfirmButtons') },
      { json: 'input', js: 'input', typ: u(undefined, r('Input')) },
      { json: 'checkbox', js: 'checkbox', typ: u(undefined, r('Checkbox')) },
    ],
    false,
  ),
  ConfirmButtons: o(
    [
      { json: 'cancel', js: 'cancel', typ: '' },
      { json: 'continue', js: 'continue', typ: '' },
    ],
    false,
  ),
  Checkbox: o(
    [
      { json: 'label', js: 'label', typ: '' },
      { json: 'linkLabel', js: 'linkLabel', typ: '' },
    ],
    false,
  ),
  Input: o(
    [
      { json: 'label', js: 'label', typ: '' },
      { json: 'placeholder', js: 'placeholder', typ: '' },
      { json: 'errors', js: 'errors', typ: r('Errors') },
    ],
    false,
  ),
  Errors: o(
    [
      { json: 'empty', js: 'empty', typ: '' },
      { json: 'length', js: 'length', typ: '' },
      { json: 'invalidRegNumber', js: 'invalidRegNumber', typ: '' },
    ],
    false,
  ),
  ConfirmSubTitles: o([{ json: 'confirm', js: 'confirm', typ: '' }], false),
  DeregisterOverview: o(
    [
      { json: 'title', js: 'title', typ: '' },
      { json: 'info', js: 'info', typ: '' },
      {
        json: 'subtitles',
        js: 'subtitles',
        typ: r('DeregisterOverviewSubtitles'),
      },
      { json: 'buttons', js: 'buttons', typ: r('DeregisterOverviewButtons') },
      { json: 'search', js: 'search', typ: r('Search') },
      { json: 'table', js: 'table', typ: a('') },
    ],
    false,
  ),
  DeregisterOverviewButtons: o(
    [{ json: 'deregister', js: 'deregister', typ: '' }],
    false,
  ),
  DeregisterOverviewSubtitles: o(
    [{ json: 'history', js: 'history', typ: '' }],
    false,
  ),
  DeregisterSidenav: o(
    [
      { json: 'title', js: 'title', typ: '' },
      { json: 'deregister', js: 'deregister', typ: '' },
      { json: 'companyInfo', js: 'companyInfo', typ: '' },
      { json: 'accessControl', js: 'accessControl', typ: '' },
    ],
    false,
  ),
  TranslationDeregisterVehicle: o(
    [
      { json: 'select', js: 'select', typ: r('Confirm') },
      { json: 'deregister', js: 'deregister', typ: r('Deregister') },
    ],
    false,
  ),
  Deregister: o(
    [
      { json: 'titles', js: 'titles', typ: r('InfoClass') },
      { json: 'info', js: 'info', typ: r('InfoClass') },
      { json: 'buttons', js: 'buttons', typ: r('DeregisterButtons') },
      { json: 'success', js: 'success', typ: '' },
      { json: 'error', js: 'error', typ: r('CompletedError') },
    ],
    false,
  ),
  DeregisterButtons: o(
    [
      { json: 'back', js: 'back', typ: '' },
      { json: 'confirm', js: 'confirm', typ: '' },
    ],
    false,
  ),
  InfoClass: o(
    [
      { json: 'success', js: 'success', typ: '' },
      { json: 'error', js: 'error', typ: '' },
      { json: 'notfound', js: 'notfound', typ: u(undefined, '') },
      { json: 'loading', js: 'loading', typ: u(undefined, '') },
    ],
    false,
  ),
  ErrorBoundary: o(
    [
      { json: 'title', js: 'title', typ: '' },
      { json: 'contents', js: 'contents', typ: a('') },
    ],
    false,
  ),
  Footer: o(
    [
      { json: 'topLinksInfo', js: 'topLinksInfo', typ: a(r('BottomLink')) },
      {
        json: 'topLinksContact',
        js: 'topLinksContact',
        typ: a(r('BottomLink')),
      },
      { json: 'bottomLinksTitle', js: 'bottomLinksTitle', typ: '' },
      { json: 'bottomLinks', js: 'bottomLinks', typ: a(r('BottomLink')) },
    ],
    false,
  ),
  BottomLink: o(
    [
      { json: 'title', js: 'title', typ: '' },
      { json: 'href', js: 'href', typ: '' },
    ],
    false,
  ),
  Gdpr: o(
    [
      { json: 'title', js: 'title', typ: '' },
      { json: 'subTitles', js: 'subTitles', typ: r('GdprSubTitles') },
      { json: 'info', js: 'info', typ: '' },
      { json: 'checkbox', js: 'checkbox', typ: '' },
      { json: 'buttons', js: 'buttons', typ: r('GdprButtons') },
      { json: 'error', js: 'error', typ: r('GdprError') },
    ],
    false,
  ),
  GdprButtons: o([{ json: 'continue', js: 'continue', typ: '' }], false),
  GdprError: o(
    [
      { json: 'message', js: 'message', typ: '' },
      { json: 'primaryButton', js: 'primaryButton', typ: '' },
    ],
    false,
  ),
  GdprSubTitles: o([{ json: 'info', js: 'info', typ: '' }], false),
  Handover: o(
    [
      { json: 'titles', js: 'titles', typ: r('InfoClass') },
      { json: 'info', js: 'info', typ: '' },
      { json: 'subTitles', js: 'subTitles', typ: r('HandoverSubTitles') },
      { json: 'subInfo', js: 'subInfo', typ: '' },
      { json: 'buttons', js: 'buttons', typ: r('HandoverButtons') },
      { json: 'error', js: 'error', typ: r('CompletedError') },
      { json: 'cancelModal', js: 'cancelModal', typ: r('CancelModal') },
    ],
    false,
  ),
  HandoverButtons: o(
    [
      { json: 'cancel', js: 'cancel', typ: '' },
      { json: 'close', js: 'close', typ: '' },
    ],
    false,
  ),
  CancelModal: o(
    [
      { json: 'titles', js: 'titles', typ: r('CancelModalTitles') },
      { json: 'info', js: 'info', typ: '' },
      { json: 'buttons', js: 'buttons', typ: r('ConfirmButtons') },
      { json: 'error', js: 'error', typ: r('CompletedError') },
    ],
    false,
  ),
  CancelModalTitles: o(
    [
      { json: 'info', js: 'info', typ: '' },
      { json: 'error', js: 'error', typ: '' },
    ],
    false,
  ),
  HandoverSubTitles: o(
    [
      { json: 'nextStep', js: 'nextStep', typ: '' },
      { json: 'companies', js: 'companies', typ: '' },
    ],
    false,
  ),
  Header: o([{ json: 'logoutText', js: 'logoutText', typ: '' }], false),
  TranslationHome: o([{ json: 'title', js: 'title', typ: '' }], false),
  MyCars: o(
    [
      { json: 'title', js: 'title', typ: '' },
      { json: 'subTitles', js: 'subTitles', typ: r('MyCarsSubTitles') },
      { json: 'info', js: 'info', typ: r('MyCarsInfo') },
      { json: 'actions', js: 'actions', typ: r('Actions') },
      { json: 'status', js: 'status', typ: r('MyCarsStatus') },
      { json: 'buttons', js: 'buttons', typ: r('MyCarsButtons') },
      { json: 'tooltip', js: 'tooltip', typ: r('Tooltip') },
      { json: 'error', js: 'error', typ: r('GdprError') },
    ],
    false,
  ),
  Actions: o(
    [
      { json: 'valid', js: 'valid', typ: '' },
      { json: 'invalid', js: 'invalid', typ: '' },
    ],
    false,
  ),
  MyCarsButtons: o(
    [
      { json: 'openProcess', js: 'openProcess', typ: '' },
      { json: 'seeDetails', js: 'seeDetails', typ: '' },
    ],
    false,
  ),
  MyCarsInfo: o(
    [{ json: 'noCarsAvailable', js: 'noCarsAvailable', typ: '' }],
    false,
  ),
  MyCarsStatus: o(
    [
      { json: 'coOwned', js: 'coOwned', typ: '' },
      { json: 'recycle', js: 'recycle', typ: '' },
      { json: 'done', js: 'done', typ: '' },
    ],
    false,
  ),
  MyCarsSubTitles: o(
    [
      { json: 'pending', js: 'pending', typ: '' },
      { json: 'active', js: 'active', typ: '' },
      { json: 'done', js: 'done', typ: '' },
    ],
    false,
  ),
  Tooltip: o(
    [
      { json: 'text', js: 'text', typ: '' },
      { json: 'link', js: 'link', typ: '' },
    ],
    false,
  ),
  NotFound: o(
    [
      { json: 'title', js: 'title', typ: '' },
      { json: 'content', js: 'content', typ: '' },
      { json: 'button', js: 'button', typ: '' },
    ],
    false,
  ),
  Processes: o(
    [
      { json: 'step', js: 'step', typ: '' },
      { json: 'outOf', js: 'outOf', typ: '' },
      { json: 'citizen', js: 'citizen', typ: r('Citizen') },
      { json: 'company', js: 'company', typ: r('ProcessesCompany') },
    ],
    false,
  ),
  Citizen: o(
    [
      { json: 'title', js: 'title', typ: '' },
      { json: 'sections', js: 'sections', typ: a('') },
      { json: 'completed', js: 'completed', typ: '' },
    ],
    false,
  ),
  ProcessesCompany: o(
    [
      { json: 'title', js: 'title', typ: '' },
      { json: 'sections', js: 'sections', typ: a('') },
    ],
    false,
  ),
  RecyclingCompanies: o(
    [
      { json: 'title', js: 'title', typ: '' },
      { json: 'info', js: 'info', typ: '' },
      { json: 'empty', js: 'empty', typ: '' },
      {
        json: 'subtitles',
        js: 'subtitles',
        typ: r('RecyclingCompaniesSubtitles'),
      },
      {
        json: 'tableHeaders',
        js: 'tableHeaders',
        typ: r('RecyclingCompaniesTableHeaders'),
      },
      { json: 'status', js: 'status', typ: r('AccessControlStatus') },
      { json: 'buttons', js: 'buttons', typ: r('RecyclingCompaniesButtons') },
      {
        json: 'recyclingCompany',
        js: 'recyclingCompany',
        typ: r('RecyclingCompany'),
      },
    ],
    false,
  ),
  RecyclingCompaniesButtons: o(
    [
      { json: 'add', js: 'add', typ: '' },
      { json: 'view', js: 'view', typ: '' },
    ],
    false,
  ),
  RecyclingCompany: o(
    [
      { json: 'view', js: 'view', typ: r('View') },
      { json: 'add', js: 'add', typ: r('Add') },
      { json: 'form', js: 'form', typ: r('RecyclingCompanyForm') },
    ],
    false,
  ),
  Add: o(
    [
      { json: 'title', js: 'title', typ: '' },
      { json: 'breadcrumb', js: 'breadcrumb', typ: '' },
      { json: 'info', js: 'info', typ: '' },
      { json: 'added', js: 'added', typ: '' },
    ],
    false,
  ),
  RecyclingCompanyForm: o(
    [
      { json: 'inputs', js: 'inputs', typ: r('FormInputs') },
      { json: 'buttons', js: 'buttons', typ: r('FormButtons') },
    ],
    false,
  ),
  FormInputs: o(
    [
      { json: 'companyId', js: 'companyId', typ: r('Name') },
      { json: 'companyName', js: 'companyName', typ: r('Name') },
      { json: 'nationalId', js: 'nationalId', typ: r('Email') },
      { json: 'email', js: 'email', typ: r('Email') },
      { json: 'address', js: 'address', typ: r('Name') },
      { json: 'postnumber', js: 'postnumber', typ: r('Name') },
      { json: 'city', js: 'city', typ: r('Name') },
      { json: 'website', js: 'website', typ: r('Name') },
      { json: 'phone', js: 'phone', typ: r('Name') },
      { json: 'active', js: 'active', typ: r('Name') },
    ],
    false,
  ),
  View: o(
    [
      { json: 'title', js: 'title', typ: '' },
      { json: 'breadcrumb', js: 'breadcrumb', typ: '' },
      { json: 'info', js: 'info', typ: '' },
      { json: 'updated', js: 'updated', typ: '' },
      { json: 'deleted', js: 'deleted', typ: '' },
    ],
    false,
  ),
  RecyclingCompaniesSubtitles: o(
    [{ json: 'companies', js: 'companies', typ: '' }],
    false,
  ),
  RecyclingCompaniesTableHeaders: o(
    [
      { json: 'id', js: 'id', typ: '' },
      { json: 'name', js: 'name', typ: '' },
      { json: 'address', js: 'address', typ: '' },
      { json: 'postnumber', js: 'postnumber', typ: '' },
      { json: 'email', js: 'email', typ: '' },
      { json: 'status', js: 'status', typ: '' },
    ],
    false,
  ),
  RecyclingFundOverview: o(
    [
      { json: 'title', js: 'title', typ: '' },
      {
        json: 'subtitles',
        js: 'subtitles',
        typ: r('RecyclingFundOverviewSubtitles'),
      },
      { json: 'info', js: 'info', typ: '' },
      {
        json: 'buttons',
        js: 'buttons',
        typ: r('RecyclingFundOverviewButtons'),
      },
      { json: 'search', js: 'search', typ: r('Search') },
      { json: 'table', js: 'table', typ: a('') },
    ],
    false,
  ),
  RecyclingFundOverviewButtons: o(
    [{ json: 'export', js: 'export', typ: '' }],
    false,
  ),
  RecyclingFundOverviewSubtitles: o(
    [{ json: 'deregistered', js: 'deregistered', typ: '' }],
    false,
  ),
  RecyclingFundSidenav: o(
    [
      { json: 'title', js: 'title', typ: '' },
      { json: 'recycled', js: 'recycled', typ: '' },
      { json: 'companies', js: 'companies', typ: '' },
      { json: 'accessControl', js: 'accessControl', typ: '' },
    ],
    false,
  ),
  Routes: o(
    [
      { json: 'home', js: 'home', typ: r('RoutesHome') },
      { json: 'myCars', js: 'myCars', typ: '' },
      {
        json: 'recycleVehicle',
        js: 'recycleVehicle',
        typ: r('RecycleVehicle'),
      },
      {
        json: 'deregisterVehicle',
        js: 'deregisterVehicle',
        typ: r('RoutesDeregisterVehicle'),
      },
      { json: 'recycledVehicles', js: 'recycledVehicles', typ: '' },
      { json: 'accessControl', js: 'accessControl', typ: '' },
      { json: 'accessControlCompany', js: 'accessControlCompany', typ: '' },
      {
        json: 'recyclingCompanies',
        js: 'recyclingCompanies',
        typ: r('RecyclingCompaniesClass'),
      },
      {
        json: 'companyInfo',
        js: 'companyInfo',
        typ: r('RecyclingCompaniesClass'),
      },
    ],
    false,
  ),
  RecyclingCompaniesClass: o(
    [
      { json: 'baseRoute', js: 'baseRoute', typ: '' },
      { json: 'add', js: 'add', typ: '' },
      { json: 'edit', js: 'edit', typ: '' },
    ],
    false,
  ),
  RoutesDeregisterVehicle: o(
    [
      { json: 'baseRoute', js: 'baseRoute', typ: '' },
      { json: 'select', js: 'select', typ: '' },
      { json: 'deregister', js: 'deregister', typ: '' },
    ],
    false,
  ),
  RoutesHome: o(
    [
      { json: 'citizen', js: 'citizen', typ: '' },
      { json: 'recyclingCompany', js: 'recyclingCompany', typ: '' },
      { json: 'recyclingFund', js: 'recyclingFund', typ: '' },
    ],
    false,
  ),
  RecycleVehicle: o(
    [
      { json: 'baseRoute', js: 'baseRoute', typ: '' },
      { json: 'recycle', js: 'recycle', typ: '' },
      { json: 'confirm', js: 'confirm', typ: '' },
      { json: 'handover', js: 'handover', typ: '' },
      { json: 'completed', js: 'completed', typ: '' },
    ],
    false,
  ),
}
