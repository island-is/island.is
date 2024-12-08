export const environment = {
  // TODO: Add custom test variables here
} as const

process.env = {
  ...process.env,
  ...environment,
}
