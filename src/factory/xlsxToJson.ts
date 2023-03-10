
import fse from 'fs-extra';
import _, { values } from 'lodash';
import path from 'path';
import { DSLData } from 'src/types';

import { xlsxToDSL } from "../core";

import prettier from 'prettier';

function xlsxToJson(sourceFile: string, dsl: DSLData, languageIndexMap: { [key: string]: number }, targetDir: string) {

  try {
    const translatedDSL = xlsxToDSL(sourceFile, dsl, languageIndexMap);

    const generateJson = (lan: string) => {
      const result = {};

      Object.keys(translatedDSL).map(path => {
        const word = translatedDSL[path][languageIndexMap[lan]];
        syncPath(result, path, languageIndexMap[lan], word)
      });
      const format = prettier.format(JSON.stringify(result), { parser: "json" });

      const targetFile = path.join(targetDir, `./${lan}/translation.json`);
      fse.ensureFileSync(targetFile);
      fse.writeFileSync(targetFile, format);
    }

    Object.keys(languageIndexMap).forEach(generateJson);

    console.log('导入完毕!');
  } catch (error) {
    throw '导入失败:' + error
  }
}

const syncPath = (origin: object, routePath: string, lanIndex: number, word: string) => {
  const pArray = routePath.split('.');

  pArray.reduce((result: object, p: string, index: number) => {
    result[p] = typeof result[p] === 'undefined' ? {} : result[p];
    if (index === pArray.length - 1) {
      result[p] = word;
    }
    return result[p];
  }, origin)
}

export default xlsxToJson;