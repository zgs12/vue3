const esbuild = require('esbuild');
const target = "reactivity"
const {resolve} = require('path')
esbuild.build({
    entryPoints: [resolve(__dirname,`../packages/${target}/src/index.ts`)],
    bundle: true,
    outfile: resolve(__dirname,`../packages/${target}/dist/${target}.js`),
    format: 'esm',
    // globalName: 'app',
    // minify: true,
    sourcemap: true,
    platform: 'browser'
    // watch: {
    //     onRebuild(error, result) {
    //         if (error) console.error('watch build failed:', error)
    //         else console.log('watch build succeeded:', result)
    //     }
    // }
   
    
}).then(() => {
    console.log('build success~~~~~')
})