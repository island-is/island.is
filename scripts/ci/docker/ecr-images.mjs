// @ts-check

export async function getImageManifest(ecr, repositoryName, imageTag) {
  const response = await ecr
    .batchGetImage({
      repositoryName,
      imageIds: [{ imageTag }],
    })
    .promise()

  return response.images?.[0]?.imageManifest
}

export async function findLatestImageTag(ecr, repositoryName, tagPrefix) {
  let nextToken
  let latest

  do {
    let response
    try {
      response = await ecr
        .describeImages({
          repositoryName,
          filter: { tagStatus: 'TAGGED' },
          nextToken,
        })
        .promise()
    } catch (error) {
      if (error?.code === 'RepositoryNotFoundException') {
        return undefined
      }
      throw error
    }

    for (const image of response.imageDetails ?? []) {
      const pushedAt = new Date(image.imagePushedAt ?? 0).getTime()
      for (const tag of image.imageTags ?? []) {
        if (!tag.startsWith(tagPrefix)) {
          continue
        }
        if (!latest || pushedAt > latest.pushedAt) {
          latest = { tag, pushedAt }
        }
      }
    }

    nextToken = response.nextToken
  } while (nextToken)

  return latest?.tag
}

export async function hasImageTagWithPrefix(ecr, repositoryName, tagPrefix) {
  return Boolean(await findLatestImageTag(ecr, repositoryName, tagPrefix))
}

export async function retagImage(ecr, repositoryName, sourceTag, targetTag) {
  const targetManifest = await getImageManifest(ecr, repositoryName, targetTag)
  if (targetManifest) {
    return { reused: true, targetExisted: true }
  }

  const sourceManifest = await getImageManifest(ecr, repositoryName, sourceTag)
  if (!sourceManifest) {
    return { reused: false, sourceMissing: true }
  }

  try {
    await ecr
      .putImage({
        repositoryName,
        imageManifest: sourceManifest,
        imageTag: targetTag,
      })
      .promise()
  } catch (error) {
    if (error?.code !== 'ImageAlreadyExistsException') {
      throw error
    }
  }

  return { reused: true, targetExisted: false }
}
