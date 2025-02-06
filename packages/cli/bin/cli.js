#!/usr/bin/env node

import { Command } from 'commander';
import inquirer from 'inquirer';
import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const pkg = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../package.json'), 'utf-8'));
const program = new Command();

// 添加版本号
program.version(pkg.version, '-v, --version');

// 添加命令
program
  .command('init [name]')
  .description('创建一个新项目')
  .action(async (name) => {
    try {
      // 原来的初始化逻辑移到这里
      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'projectName',
          message: '请输入项目名称：',
          default: name || 'my-app'
        },
        {
          type: 'list',
          name: 'template',
          message: '请选择项目模板：',
          choices: ['application', 'service'], //产品还是服务
        }
      ]);

      const { projectName, template } = answers;
      const packageManager = 'npm';
      // 模板目录路径
      const templateDir = path.join(__dirname, '../templates', template);
      // 目标目录路径
      const targetDir = path.join(process.cwd(), projectName);

      // 复制模板文件
      await fs.copy(templateDir, targetDir);
      
      // 修改 package.json
      const pkgPath = path.join(targetDir, 'package.json');
      const targetPkg = await fs.readJson(pkgPath);
      targetPkg.name = projectName;
      await fs.writeJson(pkgPath, targetPkg, { spaces: 2 });

      console.log(chalk.green('✨ 项目创建成功！'));
      console.log('\n请执行以下命令：');
      console.log(chalk.cyan(`\ncd ${projectName}`));
      console.log(chalk.cyan(`${packageManager} install`));
      console.log(chalk.cyan(`${packageManager} run dev`));
    } catch (err) {
      console.error(chalk.red('错误：'), err);
      process.exit(1);
    }
  });

// 解析命令行参数
program.parse(process.argv);

// 如果没有任何命令，显示帮助信息
if (!process.argv.slice(2).length) {
  program.outputHelp();
}