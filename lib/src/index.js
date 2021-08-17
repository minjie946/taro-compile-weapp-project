"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
exports.default = (ctx, { srcConfigName, distConfigName = 'project.config.json' }) => {
    ctx.onBuildFinish(() => {
        console.log('编译结束！', srcConfigName, distConfigName);
        const { blended } = ctx.runOpts;
        if (blended)
            return;
        const { appPath, sourcePath, outputPath } = ctx.paths;
        const { fs } = ctx.helper;
        const projectConfigFileName = srcConfigName;
        let projectConfigPath = path.join(appPath, projectConfigFileName);
        if (!fs.existsSync(projectConfigPath)) {
            projectConfigPath = path.join(sourcePath, projectConfigFileName);
            if (!fs.existsSync(projectConfigPath))
                return;
        }
        const origProjectConfig = fs.readJSONSync(projectConfigPath);
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