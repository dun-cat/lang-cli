import xlsx from 'xlsx';
import fse from "fs-extra";
import sh from 'shorthash';
var log4js = require("log4js");
var logger = log4js.getLogger();
import { DSLData, Source } from './types';
import { isEmpty } from './utils';
import { locales, reverseLocales } from './locales';
import ora from 'ora';

function walkJson(preKeyPath: string, json: Object, result: DSLData, visitor: (result: DSLData, currentKeyPath: string, value: string) => void) {
  const keys = Object.keys(json);

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const value = json[key];
    const currentKeyPath = isEmpty(preKeyPath) ? key : `${preKeyPath}.${key}`;

    if (typeof value === 'string') {
      // 递归至叶子
      visitor(result, currentKeyPath, value)
    } else if (typeof value === 'object' && value !== null) {
      walkJson(currentKeyPath, value, result, visitor)
    } else {
      // 不做任何操作
    }
  }
}

/**
 * 
 * @param jsonPaths translation.json 文件路径
 * @returns 
 */
const jsonToDSL = (jsonPaths: Source[]) => {
  const spinner = ora('读取 translation.json 文件中...').start();

  const result: DSLData = {};
  const visitor = ([result, currentKeyPath, value], index: number) => {
    if (typeof result[currentKeyPath] === 'undefined') {
      result[currentKeyPath] = new Array(jsonPaths.length).fill("")
    }
    result[currentKeyPath][index] = value;
  }
  jsonPaths.forEach(async ({ path }, index: number) => {
    let parsedJson = null;
    try {
      spinner.text = `读取文件失败：${path}`
      parsedJson = await fse.readJSON(path);
    } catch (error) {
      logger.error("Cheese is too ripe!");
      throw `读取文件失败：${path}`;
    }
    walkJson('', parsedJson, result, (...args) => visitor(args, index));
  });
  return result;
}

const xlsxToDSL = (sourceFile: string, sourceDSL: DSLData, languageIndexMap: { [key: string]: number }) => {

  // /Users/lumin/workspace/projects/translation-cli/example/output/myfile.xlsx

  //  {'modal.title.deleteProduct': [ '删除商品', '', '' ]}
  // languageIndexMap
  // { 'zh-CN': 0, 'en-US': 1, 'id-ID': 2 }


  const baseLanguage = 'zh-CN';

  const workbook = xlsx.readFile(sourceFile);
  const ws = workbook.Sheets[workbook.SheetNames[0]];
  const xlsxJsonArray = xlsx.utils.sheet_to_json(ws);
  // [{ '中文': '导入', '英文': 'Import', '印尼': 'Menginput' }],

  const lanMapping = {};

  xlsxJsonArray.forEach(item => {
    const baseWord = item[locales[baseLanguage]];

    const lankeys = Object.keys(languageIndexMap);

    lanMapping[baseWord] = {};
    lankeys.forEach(lan => {
      const word = item[locales[lan]];
      lanMapping[baseWord][lan] = word;
    })
  })

  // 需要根据中文作为key 匹配翻译
  Object.values(sourceDSL).forEach(row => {
    // 以此为基础，去翻译。
    const baseWord = row[languageIndexMap[baseLanguage]];

    const translatedMap = lanMapping[baseWord];

    if (typeof translatedMap === 'undefined') {
      return;
    }

    delete lanMapping[baseWord];
    Object.keys(translatedMap).forEach(lan => {
      const index = languageIndexMap[lan];
      row[index] = translatedMap[lan];
    })
  });

  // 如果发现还有多余的未能匹配到 json 文件里去的。
  // 则，动态生成未定义字段。
  if (Object.keys(lanMapping).length > 0) {
    const unmatchedDSL = {};
    Object.values(lanMapping).forEach((lanMap) => {
      const langs = Object.keys(lanMap);
      const row = new Array(langs.length);
      langs.forEach(lan => {
        const lanIndex = languageIndexMap[lan]
        row[lanIndex] = lanMap[lan] || "";
      })
      const key = sh.unique(row[languageIndexMap[baseLanguage]]);
      unmatchedDSL[key] = row;
      sourceDSL[key] = row;
    });
    console.log(`\n ******* 提示：以下表格行未匹配到以 ${baseLanguage} 为匹配语言的字段。 ********`)
    console.log(Object.values(lanMapping))
    console.log(`\n ******* 自动生成未匹配到的字段 ********`)
    console.log(unmatchedDSL)
  }
  return sourceDSL;
}

export { jsonToDSL, xlsxToDSL };