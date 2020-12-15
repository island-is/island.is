/*  This is the type declaration for all events sent to plausible.
    When creating a new event in plausible the schema for that event should be defined here
    with an eventName: The name of the event
    featureName: the name of the feature the event is being tracked, if the event is in the root of the product
    or a generic event in the product the product name should be defined as the featureName
    params: additional meta data that is optionally sent with the event
    The name of the event in plausible should then be the featureName appended with the eventName
    This is to make sure events dont clash between products and features for better analization of
    events.
 */
export default interface baseEvent {
  eventName: string
  featureName: string
  params: {
    [key: string]: string | undefined
  }
}
