
import parse = require("csv-parse/lib/sync");

import fs from 'fs';
import _ from 'lodash';
import { DSLData, Source } from "../types";
import { isEmpty, named } from "../utils";
import { jsonToDSL } from "../core";

import xlsx from 'xlsx';


const doubleQuotation = (value: string) => {
  return `"${value}"`
}

function jsonToExcel(sources: Source[], targetFile: string) {
  try {
    console.log("source", sources)
    const content = jsonToDSL(sources);

    function sortByCompleteness(content: DSLData) {
      const list = Object.values(content);
      return _.orderBy(list, [(item: string[]) => item.filter(v => !isEmpty(v)).length], 'desc');
    }

    const sorted = sortByCompleteness(content);

    const header = sources.map(({ name }) => doubleQuotation(named(name))).join(' , ') + `\n`;
    const rows = sorted
      .map((row: string[]) =>
        row.map(word => doubleQuotation(word)).join(' , ')
      )
      .join('\n');
    const csvString = header + rows;

    // csv parser options
    const csvOptions = {
      columns: true,
      delimiter: ',',
      ltrim: true,
      rtrim: true,
    };

    // get records
    const records = parse(csvString, csvOptions);

    // prepare the xlsx workbook
    const wb = xlsx.utils.book_new();

    // insert the records as a sheet
    const ws = xlsx.utils.json_to_sheet(records);
    xlsx.utils.book_append_sheet(wb, ws);


    // write the xlsx workbook to destination
    xlsx.writeFile(wb, targetFile);

    console.log('导出完毕!')
  } catch (error) {
    throw '导出失败:' + error
  }
}

export default jsonToExcel;