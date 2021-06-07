import os
import glob


def get_files():
    return glob.glob('**/environment.prod.ts', recursive=True)


def main():
    for fn in get_files():
        counterpart = os.path.join(os.path.dirname(fn), 'environment.ts')
        if not os.path.isfile(counterpart):
            raise ValueError(f'No counterpart {counterpart}')
        with open(fn, 'r') as f:
            proddata = f.readlines()
        with open(counterpart, 'r') as f:
            counterpartdata = f.readlines()

        with open(counterpart, 'w') as f:
            pre_lines = []
            while True:
                if proddata[0].startswith('export'):
                    break
                if proddata[0] not in pre_lines:
                    f.write(proddata[0])
                    pre_lines.append(proddata[0])
                proddata = proddata[1:]
            while True:
                if counterpartdata[0].startswith('export'):
                    break
                if counterpartdata[0] not in pre_lines:
                    f.write(counterpartdata[0])
                    pre_lines.append(counterpartdata[0])
                counterpartdata = counterpartdata[1:]

            f.write('const devConfig = {\n')
            for line in counterpartdata[1:]:
                f.write(line)
            f.write('\n')
            f.write('const prodConfig = {\n')
            for line in proddata[1:]:
                f.write(line)
            f.write('\n')
            f.write(
                "export default process.env.NODE_ENV === 'production' ? prodConfig : devConfig"
            )
            f.write('\n')
        os.remove(fn)


if __name__ == '__main__':
    main()
