import {
  Location,
  Workspace,
  CreateImpliedRelationshipsUnlessSameRelationshipExistsStrategy,
} from 'structurizr-typescript'

export const workspace = new Workspace(
  'Island.is',
  'System Architecture for Island.is',
)
workspace.model.impliedRelationshipsStrategy = new CreateImpliedRelationshipsUnlessSameRelationshipExistsStrategy()

const user = workspace.model.addPerson('User', '', Location.External)!

const identityServer = workspace.model.addSoftwareSystem(
  'Identity Server',
  'Open ID Connect and OAuth2 compatible authentication system. Supports electronic ID and delegations.',
  Location.Internal,
)!

const idsWeb = identityServer.addContainer(
  'IDS Web',
  'Implements Open ID Connect and OAuth2 authentication protocols and login flows.',
  'C# and DotNet Core',
)!
idsWeb.tags.add('Web App')

const authApi = identityServer.addContainer(
  'Auth API',
  'Backend API to query clients, resources, scopes, delegations and users.',
  'NestJS',
)!
const authAdmin = identityServer.addContainer(
  'Auth Admin',
  'Admin interface to manage clients, resources, scopes and users.',
  'NextJS',
)!
authAdmin.tags.add('Web App')

idsWeb.uses(authApi, 'Makes API calls to', 'JSON/HTTPS')

user.uses(idsWeb, 'Logs in with')

const systemContextView = workspace.views.createSystemContextView(
  identityServer,
  'systemContext',
  'Overview of Island.is systems',
)
systemContextView.addAllElements()
systemContextView.setAutomaticLayout(true)

console.log(JSON.stringify(workspace.toDto()))
