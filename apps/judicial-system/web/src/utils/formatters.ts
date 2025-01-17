export const replaceTabs = (str: string) =>
  str?.replace(/(?: \t+|\t+ |\t+)/g, ' ')
