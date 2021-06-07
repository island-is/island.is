import os
import json
import glob


def main():
    with open('workspace.json', 'r') as f:
        data = json.loads(f.read())
    # trgt = 'build'
    trgt = 'build-next'
    for project_key in data['projects']:
        if not trgt in data['projects'][project_key]['architect']:
            continue
        if 'configurations' in data['projects'][project_key]['architect'][trgt]:
            if (
                'production'
                in data['projects'][project_key]['architect'][trgt]['configurations']
            ):
                if (
                    'fileReplacements'
                    in data['projects'][project_key]['architect'][trgt][
                        'configurations'
                    ]['production']
                ):
                    print('deleting in ', project_key)
                    del data['projects'][project_key]['architect'][trgt][
                        'configurations'
                    ]['production']['fileReplacements']
    with open('workspace.json', 'w') as f:
        f.write(json.dumps(data))


if __name__ == '__main__':
    main()
