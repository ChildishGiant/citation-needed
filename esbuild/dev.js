const esbuild = require('esbuild')
const FiveServer = require('five-server').default

esbuild.build({
  entryPoints: ['src/main.js'],
  bundle: true,
  minify: true,
  sourcemap: true,
  color: true,
  outdir: 'out',
  watch: {
    onRebuild (error, result) {
      if (error) console.error('watch build failed:', error)
      else console.error('watch build succeeded:', result)

    }
  }
}).then(result => {
  // Call "stop" on the result when you're done
  new FiveServer().start({
    root: './',
    open: true,
    port: 1234
  })
  // result.stop()
})
