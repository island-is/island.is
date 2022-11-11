/**
 * This is the type declaration for all events sent to plausible.
 * When creating a new event in plausible the schema for that event should be defined here
 * @param eventName The name of the event
 * @param featureName the name of the feature the event is being tracked. If the event is in the root of the product or a generic event in the product the product name should be defined as the featureName
 * @param params additional meta data that is optionally sent with the event
 * @param callback a function that is called once the event is logged successfully.
 * @param url URL of the page where the event was triggered. Use custom for masking id's.
 * The name of the event that is sent to plausible is the featureName appended with the eventName
 * This is to make sure events dont clash between products and features for better granularity of events.
 */
export default interface BaseEvent {
  eventName: string
  featureName: string
  params: {
    [key: string]: string | undefined
  }
  url?: string
  callback?: () => void
}
