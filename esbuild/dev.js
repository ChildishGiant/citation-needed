// const esbuild = require('esbuild')
import esbuild from 'esbuild'
import FiveServer from 'five-server'

const server = FiveServer.default

import update from './reader.js'; // Update bookmarks
update()

esbuild.build({
  entryPoints: ['src/main.js'],
  bundle: true,
  minify: true,
  sourcemap: true,
  color: true,
  outdir: 'out',
  watch: {
    onRebuild (error, result) {
      update() // Update bookmarks
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
