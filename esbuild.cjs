const { build } = require('esbuild');

build({
    bundle: true,
    minify: true,
    sourcemap: true,
    platform: 'node',
    entryPoints: ['./server.js'],
    outfile: 'dist/server.js',
    target: 'node16',
}).catch(() => process.exit(1));