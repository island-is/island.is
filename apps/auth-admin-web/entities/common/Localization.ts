export class Localization {
  formControls: FormControl[]
  listControls: ListControl[]
  title: string
  header: HeaderTranslation
  navigations: Record<string, Navigation>
  paginator: Paginator
  version: string
  pages: Record<string, Page>
  environment: Record<string, Environment>
}

export class FormControl {
  id: string
  fields: Record<string, FormItem>
  title: string
  editTitle?: string
  help: string
  conditionalHelp?: string
  errorMessage?: string
  removeConfirmation?: string
  noActiveConnections?: NoActiveConnectionsTranslation
  infoModal?: InfoModalTranslation
  infoEdit?: string
  infoCreate?: string
  buttons: Record<string, Button>
  sections: Record<string, Section>
}

export class Button {
  text: string
  helpText?: string
}

export class Section {
  title: string
  properties?: Record<string, Property>
}

export class Environment {
  title: string
  description: string
  helpText: string
}

export class Page {
  title?: string
  endStep?: EndStep
}

export class EndStep {
  buttonText: string
  title: string
  infoTitle: string
  infoDescription: string
}

export class Navigation {
  items: Record<string, NavigationItem>
}

export class Paginator {
  nextButton: string
  backButton: string
  count: string
}

export class ListControl {
  id: string
  title: string
  search?: FormItem
  buttons: Record<string, Button>
  removeConfirmation?: string
  columns?: Record<string, ColumnHeader>
  sections: Record<string, Section>
}

export class HeaderTranslation {
  title: string
  loginButton: string
  logoutButton: string
}

export class NavigationItem {
  text: string
  title?: string
}

export class ColumnHeader {
  headerText: string
}

export class Property {
  name: string
}

export class FormItem {
  label: string
  placeholder: string
  helpText: string
  errorMessage: string
  available?: string
  unAvailable?: string
  selectItems: Record<string, SelectField>
  popUpTitle?: string
  popUpDescription?: string
  selectAnItem?: string
  hintOkMessage?: string
  hintErrorMessage?: string
  pattern?: string
  /** Help text or title before pattern */
  patternText?: string
}

export class SelectField {
  helpText: string
  selectItemText: string
  flow?: string
}

export class NoActiveConnectionsTranslation {
  title: string
  helpText: string
}

export class InfoModalTranslation {
  headerText: string
  buttonText: string
}
