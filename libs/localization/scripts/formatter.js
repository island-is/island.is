const get = require('lodash').get

exports.format = function (msgs) {
  return Object.entries(msgs).reduce((arr, [id, msg]) => {
    const namespace = id.substring(0, id.lastIndexOf(':'))

    if (!namespace) {
      throw new Error(
        `Namespace missing in id: ${id}, make sure the id is of the format namespace:messageId`,
      )
    }

    const widthMarkdownWidget = get(id.split('#'), '[1]') === 'markdown'

    return {
      ...arr,
      [namespace]: {
        ...arr[namespace],
        [id]: {
          ...msg,
          ...(widthMarkdownWidget ? { markdown: true } : undefined),
        },
      },
    }
  }, {})
}
