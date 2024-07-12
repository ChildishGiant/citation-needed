// const esbuild = require('esbuild')
import esbuild from 'esbuild'
import {sassPlugin} from "esbuild-sass-plugin";
import FiveServer from 'five-server'
import checkSitesFromFile from './up_test.js'

const server = FiveServer.default

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
  watch: {
    onRebuild (error, result) {
      update() // Update bookmarks
      checkSitesFromFile('src/data.json');
      if (error) console.error('watch build failed:', error)
      else console.error('watch build succeeded:', result)

    }
  }
}).then(result => {
  // Call "stop" on the result when you're done
  new server().start({
    root: './',
    open: true,
    port: 1234
  })
  // result.stop()
})
