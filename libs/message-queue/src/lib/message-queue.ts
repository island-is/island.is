import Channel from './channel'

export default {
  connect: (production = true) => new Channel(production),
}
