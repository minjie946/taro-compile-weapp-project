"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @description 可以使用不同的项目配置文件
 * @author minjie
 * @Date 2021-08-17 16:48
 * @LastEditTime 2021-08-17 17:19
 * @LastEditors minjie
 * @copyright Copyright © 2021 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
const path = require("path");
exports.default = (ctx, { srcConfigName, distConfigName = 'project.config.json' }) => {
    // 接下来使用 ctx 的时候就能获得智能提示了
    ctx.onBuildFinish(() => {
        console.log('编译结束！', srcConfigName, distConfigName);
        //  ctx.generateProjectConfig(pluginOpts.projectName, 'dddd.json')
        // 混合模式不需要生成项目配置
        const { blended } = ctx.runOpts;
        if (blended)
            return;
        const { appPath, sourcePath, outputPath } = ctx.paths;
        const { fs } = ctx.helper;
        // 生成 project.config.json
        const projectConfigFileName = srcConfigName;
        let projectConfigPath = path.join(appPath, projectConfigFileName);
        if (!fs.existsSync(projectConfigPath)) {
            // 若项目根目录不存在对应平台的 projectConfig 文件，则尝试从源代码目录查找
            projectConfigPath = path.join(sourcePath, projectConfigFileName);
            if (!fs.existsSync(projectConfigPath))
                return;
        }
        const origProjectConfig = fs.readJSONSync(projectConfigPath);
        // compileType 是 plugin 时不修改 miniprogramRoot 字段
        let distProjectConfig = origProjectConfig;
        if (origProjectConfig.compileType !== 'plugin') {
            distProjectConfig = Object.assign({}, origProjectConfig, { miniprogramRoot: './' });
        }
        ctx.writeFileToDist({
            filePath: distConfigName,
            content: JSON.stringify(distProjectConfig, null, 2)
        });
        console.log('项目文件替换成功', `${outputPath}/${distConfigName}`);
    });
};
//# sourceMappingURL=index.js.map