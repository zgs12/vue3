// 安装esbuild
// npm install --save-dev esbuild

const esbuild = require('esbuild');

esbuild.build({
    entryPoints: ['src/index.js'],
    bundle: true,
    outfile: 'dist/bundle.js',
    format: 'iife',
    globalName: 'app',
    minify: true,
    sourcemap: true,
    plugins: [
        // 你可以在这里添加自定义插件（如果有）
    ],
    loader: { '.js': 'jsx' }, // 如果你使用 JSX，可以添加这个 loader
    resolve: {
        extensions: ['.js', '.jsx'] // 如果你使用 JSX，可以添加这个解析扩展
    },
    tsconfig: 'tsconfig.json' // 如果你使用 TypeScript，可以添加这个配置
}).catch(() => process.exit(1));

//通过node 执行Esbuild.js文件
// node Esbuild.js