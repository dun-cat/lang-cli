import { jsonToDSL } from './core';
import jsonToCSV from './factory/jsonToCSV';
import jsonToExcel from './factory/jsonToExcel';
import jsonToMarkdown from './factory/jsonToMarkdown';
import xlsxToJson from './factory/xlsxToJson';
import { ExportOptions, ImportOptions } from './types';
import { getSources } from './utils';

const jsonDirToMarkdown = (options: ExportOptions) => {
  const { sourceDir, targetFile } = options;
  const sources = getSources(sourceDir)
  jsonToMarkdown(sources, targetFile);
}

const jsonDirToCSV = (options: ExportOptions) => {
  const { sourceDir, targetFile } = options;
  const sources = getSources(sourceDir)
  jsonToCSV(sources, targetFile);
}
const jsonDirToExcel = (options: ExportOptions) => {
  const { sourceDir, targetFile } = options;
  const sources = getSources(sourceDir);
  jsonToExcel(sources, targetFile);
}

const excelToJson = (options: ImportOptions) => {
  const { sourceDir, targetDir, overwrite, importFile } = options;
  const sources = getSources(sourceDir);
  const content = jsonToDSL(sources);

  // 获取语言在 DSL 值里的 index。
  const languageKeyIndexMap = sources.reduce((map, source, index) => {
    map[source.name] = index;
    return map;
  }, {});

  const outputDir = overwrite ? sourceDir : targetDir;
  console.log('导入文件：', importFile, '\n');
  console.log('locales 目录：', sourceDir, '\n');
  console.log('导出目录：', outputDir, '\n');
  xlsxToJson(importFile, content, languageKeyIndexMap, outputDir);

}

export { jsonDirToMarkdown, jsonDirToCSV, jsonDirToExcel, excelToJson }