import { VideoIframe } from './VideoIframe'

export default {
  title: 'Components/VideoIframe',
  component: VideoIframe,
}

export const Default = {
  render: () => (
    <VideoIframe
      src="https://www.youtube.com/embed/JqV0zeeyu9s"
      title="default"
    />
  ),
  name: 'Default',
}
