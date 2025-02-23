// @ts-check

import { DefaultArtifactClient } from '@actions/artifact'
import fs from 'fs';
import path from 'path';

const artifact = new DefaultArtifactClient()
const artifactName = process.env['ARTIFACT_NAME'];

if (!artifactName) {
    throw new Error('ARTIFACT_NAME not set');
}

const data = process.env.JSON_DATA ? JSON.parse(process.env.JSON_DATA) : null;

if (typeof data !== 'object' || data == null) {
    throw new Error('Invalid data type')
}

const keys = Object.keys(data.value);

const result = keys.map((key) => {
    const values = Object.keys(data).reduce((a, b) => {
        return {
            ...a,
            [b]: data[b][key]
        }
    }, {});

    return {
        id: key,
        ...values
    }
});

// Delete artifact if it exists. 
try {
    await artifact.deleteArtifact(
        artifactName,
    )
} catch (error) {
    // Ignore error, because it likely does not exist
}
const folder = fs.mkdtempSync('data-');


const tmpFilePath = path.join(folder, 'data.json');
fs.writeFileSync(tmpFilePath, JSON.stringify(result, null, 2));

await artifact.uploadArtifact(
    artifactName,
    [tmpFilePath],
    '/',
    {
        // MAX ALLOWED
        retentionDays: 90
    }
)
