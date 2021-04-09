export class Translation {
  formPages: FormPage[]
  listPages: ListPage[]
  header: HeaderTranslation
  navigation: Record<string, NavigationItem>
  clientSteps: Record<string, NavigationItem>
  apiResourceSteps: Record<string, NavigationItem>
  apiScopeSteps: Record<string, NavigationItem>
  identityResourceSteps: Record<string, NavigationItem>
  resourcesTabs: Record<string, NavigationItem>
  paginator: Paginator
  version: string
}

export class FormPage {
  id: string
  fields: Record<string, FormItem>
  title: string
  sectionTitle1?: string
  editTitle?: string
  help: string
  conditionalHelp?: string
  saveButton: string
  cancelButton: string
  addButton?: string
  removeButton?: string
  removeConfirmation?: string
  noActiveConnections?: NoActiveConnectionsTranslation
  infoModal?: InfoModalTranslation
}

export class Paginator {
  nextButton: string,
  backButton: string
}

export class ListPage {
  id: string
  title: string
  createNewItem?: string
  search?: FormItem
  searchButton?: string
  removeConfirmation?: string
  removeButton?: string
  editButton?: string
  viewButton?: string
  exportButton?: string
  columns?: Record<string, ColumnHeader>
  active?: string
  deactivated?: string
  activateButton?: string
  deactivateButton?: string
  notFound?: string
  sectionTitle1?: string
}

export class HeaderTranslation {
  title: string
  loginButton: string
  logoutButton: string
}

export class NavigationItem {
  text: string
}

export class ColumnHeader {
  headerText: string
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
