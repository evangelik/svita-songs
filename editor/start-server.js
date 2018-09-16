const args = ['run', 'start-server'];
const opts = {stdio: 'inherit', cwd: 'editor/server', shell: true};
require('child_process').spawn('npm', args, opts);