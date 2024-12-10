// const path = require('path')
// console.log(module.exports.a=1)
// console.log(exports)

// process.chdir('./a')
// console.log(process.cwd())
// console.log(__dirname)
// console.log(path.resolve(process.cwd()))

//cross-env 可以跨平台设置环境变量
// console.log(process.env)

// console.log(process.argv)
// const result = process.argv.slice(2).reduce((memo, current, index, array) => {
//     if (current.startsWith('--')) {
//         memo[current.slice(2)] = array[index + 1]
//             ? array[index + 1].startsWith('--')
//                 ? true
//                 : array[index + 1]
//             : true
//     }
//     return memo
// }, {})
// console.log(result)

const { program } = require('commander');
const pkg = require('./package.json')
program.version(pkg.version)
program.name(pkg.name)
program.usage('<command> [options]')
program.command('create')
    .description('创建项目')
    .option("-d, --directory <d>", "指定创建的目录名", process.cwd())
    .action((name, {args}) => {
        console.log(name, args);

    })
program.on("--help", () => {
    console.log("Run vue --help for detailed usage of each command"  )
})
program.parse()

// prcoess.nextTick
// global.setImmediate
// 我们在编写js代码的时候 v8引擎 进行处理11
// 如果你调用了nodeapi 会交给libuv这个库来进行处理11libuv 这个库实现了异步i/o 多线程来实现的M
//事件驱动， 底层多线程处理后，会将结果放到队列中，有一个事件线程会去扫描，依次执行
//浏览器中我们自己写的宏任务 都会放到一个宏任务队列中来处理//node中不同的异步任务会放到不同的宏任务队列中

//timers 放置定时器相关的逻辑(回调)
//peding callbacks 上一轮没执行完的 会在这一轮执行
// idle prepare 内置的执行逻辑
// poll 轮训 会在这里执行异步i/o文件读写(如果执行完毕会阻塞)如果都执行完后就关闭进程
// check setImmediate 回调的
//close callbacks 关闭的回调
//老版本 node10 以下 是每个阶段走完后 清空微任务,10以上的版本和浏览器一致(每执行一个宏任务就清空微任务)