import esbuild from "esbuild";
import update from './reader.js'; // Update bookmarks
update()

esbuild.build({
  entryPoints: ['src/main.js'],
  bundle: true,
  minify: true,
  sourcemap: true,
  color: true,
  outdir: 'out',
}).catch(() => process.exit(1))
