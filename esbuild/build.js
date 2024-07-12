import esbuild from "esbuild";
import {sassPlugin} from "esbuild-sass-plugin";
import checkSitesFromFile from './up_test.js' // Script to check sites are online
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
}).then(() => {
  checkSitesFromFile('src/data.json');
})
