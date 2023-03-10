
import fs from 'fs';
import _, { values } from 'lodash';
import { DSLData, Source } from "../types";
import { isEmpty, named } from "../utils";
import { jsonToDSL } from "../core";
import { locales } from '../locales';

const doubleQuotation = (value: string) => {
  return `"${value}"`
}

function jsonToCSV(sources: Source[], targetFile: string) {
  try {
    const content = jsonToDSL(sources);

    function sortByCompleteness(content: DSLData) {
      const list = Object.values(content);
      return _.orderBy(list, [(item: string[]) => item.filter(v => !isEmpty(v)).length], 'desc');
    }

    const sorted = sortByCompleteness(content);

    const header = sources.map(({ name }) => doubleQuotation(named(name))).join(' , ') + `\n`;
    const rows = sorted.map((row: string[]) => row.map(word => doubleQuotation(word)).join(' , ')).join('\n');
    const csv = header + rows;

    fs.writeFileSync(targetFile, csv);
    console.log('导出完毕!')
  } catch (error) {
    throw '导出失败:' + error
  }
}



export default jsonToCSV;