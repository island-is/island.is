import { Workspace, StructurizrClient } from 'structurizr-typescript'

const {
  STRUCTURIZR_WORKSPACE_ID: workspaceId,
  STRUCTURIZR_API_KEY: apiKey,
  STRUCTURIZR_API_SECRET: apiSecret,
} = process.env

export const pushWorkspace = async (workspace: Workspace) => {
  if (!workspaceId) {
    return console.error(
      'Please define STRUCTURIZR_WORKSPACE_ID environment variable in order to push your workspace',
    )
  }

  if (!apiKey || !apiSecret) {
    return console.error(
      'Please define STRUCTURIZR_API_KEY and STRUCTURIZR_API_SECRET environment variables in order to push your workspace',
    )
  }

  const workspaceIdNumber = parseInt(workspaceId)

  const client = new StructurizrClient(apiKey, apiSecret)

  return client.putWorkspace(workspaceIdNumber, workspace)
}
