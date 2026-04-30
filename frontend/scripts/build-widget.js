const esbuild = require('esbuild');
const path = require('path');
const fs = require('fs');

const outfile = path.join(__dirname, '../public/chat-widget.js');

esbuild.build({
  entryPoints: [path.join(__dirname, '../src/components/standalone/index.tsx')],
  bundle: true,
  minify: true,
  sourcemap: true,
  format: 'iife',
  globalName: 'ChatWidget',
  outfile: outfile,
  loader: {
    '.tsx': 'tsx',
    '.ts': 'ts',
  },
  define: {
    'process.env.NODE_ENV': '"production"',
    'React': 'React',
    'ReactDOM': 'ReactDOM',
  },
  external: [],
  jsx: 'automatic',
}).then(() => {
  const content = fs.readFileSync(outfile, 'utf-8');
  const cleaned = content.replace(/\/\*! Bundled license[\s\S]*?\*\/\n?/, '');
  fs.writeFileSync(outfile, cleaned);

  const mapPath = outfile + '.map';
  if (fs.existsSync(mapPath)) {
    const map = JSON.parse(fs.readFileSync(mapPath, 'utf-8'));
    map.sourcesContent = null;
    fs.writeFileSync(mapPath, JSON.stringify(map));
  }

  console.log('✅ Built: public/chat-widget.js');
  console.log('');
  console.log('Usage:');
  console.log('  <script src="/chat-widget.js" data-bot-name="My Bot"></script>');
}).catch((err) => {
  console.error('❌ Build failed:', err.message);
  process.exit(1);
});
