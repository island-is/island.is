// @ts-check

// Without these ECR may convert manifest lists / OCI indexes to a single
// platform manifest, and the retagged image would no longer match its source.
const ACCEPTED_MEDIA_TYPES = [
  'application/vnd.docker.distribution.manifest.v2+json',
  'application/vnd.docker.distribution.manifest.list.v2+json',
  'application/vnd.oci.image.manifest.v1+json',
  'application/vnd.oci.image.index.v1+json',
]

/**
 * Returns the first image found for `imageTags`, in the order given.
 */
export async function findImage(ecr, repositoryName, imageTags) {
  if (imageTags.length === 0) {
    return undefined
  }

  let response
  try {
    response = await ecr
      .batchGetImage({
        repositoryName,
        imageIds: imageTags.map((imageTag) => ({ imageTag })),
        acceptedMediaTypes: ACCEPTED_MEDIA_TYPES,
      })
      .promise()
  } catch (error) {
    if (error?.code === 'RepositoryNotFoundException') {
      return undefined
    }
    throw error
  }

  for (const tag of imageTags) {
    const image = response.images?.find(
      (candidate) => candidate.imageId?.imageTag === tag,
    )
    if (image?.imageManifest) {
      return {
        tag,
        manifest: image.imageManifest,
        mediaType: image.imageManifestMediaType,
      }
    }
  }

  return undefined
}

/**
 * Adds `targetTag` to the `source` image. Tags are immutable in our
 * repositories, so this never overwrites: it either creates the tag or throws.
 */
export async function retagImage(ecr, repositoryName, source, targetTag) {
  try {
    await ecr
      .putImage({
        repositoryName,
        imageManifest: source.manifest,
        ...(source.mediaType && { imageManifestMediaType: source.mediaType }),
        imageTag: targetTag,
      })
      .promise()
  } catch (error) {
    if (error?.code === 'ImageAlreadyExistsException') {
      return
    }
    // The request may have gone through even though we got an error back. If
    // the tag is there and points at our image we are done, otherwise the
    // caller must not assume anything about the target tag.
    const target = await findImage(ecr, repositoryName, [targetTag]).catch(
      () => undefined,
    )
    if (target?.manifest === source.manifest) {
      return
    }
    throw error
  }
}
