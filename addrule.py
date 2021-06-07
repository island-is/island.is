import glob
import json

t = [
    './apps/icelandic-names-registry/backend/.eslintrc*',
    './apps/judicial-system/api/.eslintrc*',
    './apps/judicial-system/xrd-api/.eslintrc*',
    './apps/judicial-system/backend/.eslintrc*',
    './apps/skilavottord/ws/.eslintrc*',
    './apps/reference-backend/.eslintrc*',
    './apps/download-service/.eslintrc*',
    './apps/application-system/api/.eslintrc*',
    './apps/api/.eslintrc*',
    './apps/air-discount-scheme/api/.eslintrc*',
    './apps/air-discount-scheme/backend/.eslintrc*',
    './apps/services/search-indexer/.eslintrc*',
    './apps/services/documents/.eslintrc*',
    './apps/services/user-profile/.eslintrc*',
    './apps/services/auth-api/.eslintrc*',
    './apps/services/endorsements/api/.eslintrc*',
    './apps/services/xroad-collector/.eslintrc*',
    './apps/services/auth-admin-api/.eslintrc*',
    './apps/gjafakort/application/.eslintrc*',
    './apps/gjafakort/api/.eslintrc*',
    './apps/gjafakort/queue-listener/.eslintrc*',
]


def main():
    for candidate in t:
        for fn in glob.glob(candidate):
            with open(fn, 'r') as f:
                data = json.loads(f.read())
            data['rules']['@typescript-eslint/consistent-type-imports'] = 'error'
            with open(fn, 'w') as f:
                f.write(json.dumps(data, indent=2, sort_keys=True))


if __name__ == '__main__':
    main()
