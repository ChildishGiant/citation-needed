import esbuild from "esbuild";
import {sassPlugin} from "esbuild-sass-plugin";
import update from './reader.js'; // Update bookmarks
update()

esbuild.build({
  entryPoints: ['src/main.js'],
  plugins: [sassPlugin()],
  loader: {
    ".ttf": "file",
  },
  bundle: true,
  minify: true,
  sourcemap: true,
  color: true,
  outdir: 'out',
}).catch(() => process.exit(1))
