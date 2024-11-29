/*
 * @Author: web.王晓冬
 * @Date: 2020-03-18 12:36:57
 * @LastEditors: Huang Zhaoqi
 * @LastEditTime: 2024-11-29 09:30:19
 * @Description: file content
 */
// shell字体颜色 默认=0，黑色=30，红色=31，绿色=32，黄色=33，蓝色=34，紫色=35，天蓝色=36，白色=3

const shell = require('shelljs');
const readlineSync = require('readline-sync');
const path = require('path');
let packageJSON = require(path.resolve('package.json'));

const defaultLog = (log) => console.log(`--------------${log}---------`)
const errorLog = (log) => console.log('\x1B[31m%s\x1B[0m', `--------------${log}-----------`)
const successLog = (log) => console.log('\x1B[32m%s\x1B[0m', `---------------${log}--------`)

// 当前版本
const currentVersion = packageJSON.version
// 版本标识
const [commitInfo] = process.argv.slice(2) || 'auto commit'
// 获取git当前分支
// let currentBranch = shell.exec('git symbolic-ref --short -q HEAD', {
//     async: false,
//     silent: true
// }).stdout.trim();
// if (currentBranch != 'dev') {
//     errorLog(`当前是${currentBranch}分支 请切换到dev分支`)
//     return
// }

// 新版本
var confirm = readlineSync.question(`Current is "v${currentVersion}".\n\
//    -- p:patch m:minor s:major n:Exit default:patch
//    -- are you sure? (p/s/m/n)`)
// 直接升级小号
if (confirm.trim() == '' || confirm.trim().toLowerCase() == 'p') {
    shell.exec('npm version patch')
}
// 则升级一位中号，大号不动，小号置为空
else if (confirm.trim().toLowerCase() == 'm') {
    shell.exec('npm version minor')
}
// 升级一位大号，其他位都置为0
else if (confirm.trim().toLowerCase() == 's') {
    shell.exec('npm version major')
} else {
    errorLog(`输入错误 已自动退出`)
    // shell.echo("\033[1;31m Error: 输入错误 已自动退出\033[0m")
    shell.exit()
}

// 清理之前的构建文件
shell.rm('-rf', 'dist');

// 执行构建
if (shell.exec('pnpm build').code !== 0) {
    errorLog('构建失败！');
    shell.exit(1);
    return;
}

// 检查 dist 文件夹是否存在
if (!shell.test('-d', 'dist')) {
    errorLog('dist 文件夹不存在，构建可能失败！');
    shell.exit(1);
    return;
}

// 发布到 npm
if (shell.exec('npm publish').code !== 0) {
    errorLog('npm publish 失败! 已退出');
    shell.exit(1);
    return;
}

successLog('发布成功!')
shell.exit(0)