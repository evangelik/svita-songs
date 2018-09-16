const args = ['run', 'start-client'];
const opts = {stdio: 'inherit', cwd: 'editor/client', shell: true};
require('child_process').spawn('npm', args, opts);