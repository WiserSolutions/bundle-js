import { execSync } from 'child_process'

export const getGitCommit = () =>
  execSync(
    'git rev-parse --short HEAD 2> /dev/null || if [ -z ${GIT_COMMIT+x} ]; then echo "unknown"; else echo $GIT_COMMIT; fi'
  )
    .toString()
    .replace(/^\s+|\s+$/g, '')
