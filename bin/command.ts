#!/usr/bin/env node

import { program } from 'commander';
import { FileType, getAbsoluteDirPath, getAbsoluteFilePath, getTargetFile } from '../src/utils';

import { jsonDirToMarkdown, jsonDirToCSV, jsonDirToExcel, excelToJson } from '../src/index';

function setup() {
  program.version('0.0.1');

  program
    .command('export')
    .description('导出需要翻译的文件')
    .alias('ex')
    .option('-s, --sourceDir <path>', '指定 locales 目录。例如：/Users/lumin/XY/projects/gsp-operate-fe/public/locales')
    .option('-t, --targetDir <path>', '指定输出的目录')
    .option('-ot, --output-type <Markdown|Excel|CSV>', '指定导出文件的类型.')
    .option('-f, --file <name>', '输出的文件名称，不包含后缀')
    .action((options) => {
      const outFileName = options.file ? options.file : 'output_' + new Date().getTime();

      const params = {
        sourceDir: getAbsoluteDirPath(options.sourceDir),
        targetFile: getTargetFile(getAbsoluteDirPath(options.targetDir), outFileName, options.outputType)
      };
      switch (options.outputType) {
        case FileType.csv:
          jsonDirToCSV(params)
          break;
        case FileType.excel:
          jsonDirToExcel(params);
          break;
        case FileType.markdown:
          jsonDirToMarkdown(params);
          break;
        default:
          throw `${options.outputType} 导出文件类型不支持`
      }
    });

  program
    .command('import')
    .description('导入需要转 json 的已翻译的 excel 表格。')
    .alias('im')
    .option('-i, --importFile <path>', '是否基于源 json 文件修改')
    .option('-s, --sourceDir <path>', '指定 locales 目录。例如：/Users/lumin/XY/projects/gsp-operate-fe/public/locales')
    .option('-t, --targetDir <path>', '指定输出的目录。tips: 指定了 --merge true，此选项不生效')
    .option('-o, --overwrite', '是否覆盖操作')
    .action((options) => {
      excelToJson({
        sourceDir: getAbsoluteDirPath(options.sourceDir),
        importFile: getAbsoluteFilePath(options.importFile),
        overwrite: options.overwrite,
        targetDir: options.overwrite ? '' : getAbsoluteDirPath(options.targetDir)
      });
    });

  program.parse(process.argv);
}

setup();