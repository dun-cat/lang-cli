
import fse from "fs-extra";
import glob from 'glob';
import path from "path";
import { locales } from "./locales";
import { Source } from "./types";

export enum FileType {
  'markdown' = 'markdown',
  'excel' = 'excel',
  'csv' = 'csv'
}

export function isEmpty(value: any) {
  return value === '' || typeof value === null || typeof value === 'undefined'
}

export const getSources = (sourceDir: string) => {
  const sourcePath = sourceDir;
  if (!fse.pathExistsSync(sourcePath)) {
    throw `${sourcePath} 目录不存在`
  }
  let pathList = glob.sync(`${sourcePath}/*`, {});
  const sources: Source[] = pathList.map(path => {
    const pathArr = path.split('/');
    return {
      name: pathArr[pathArr.length - 1],
      path: `${path}/translation.json`
    }
  })
  const zhIndex = sources.findIndex((s) => s.name === 'zh-CN')
  if (zhIndex !== -1) {
    const source = sources.splice(zhIndex, 1);
    sources.unshift(source[0]);
  }
  return sources
}

export const getTargetFile = (filePath: string, name: string, targetFileType: FileType) => {
  const Files = {
    [FileType.markdown]: '.md',
    [FileType.excel]: '.xlsx',
    [FileType.csv]: '.csv'
  }
  return path.join(filePath, name + Files[targetFileType])
}

export const getAbsoluteFilePath = (myPath: string) => {
  let p = '';
  if (/^\/.*$/.test(myPath)) {
    p = myPath;
  } else {
    p = path.join(process.cwd(), myPath);
  }
  if (!fse.pathExistsSync(p)) {
    fse.ensureFileSync(p);
  }


  return p;
};

export const getAbsoluteDirPath = (myPath: string) => {
  let p = '';
  if (/^\/.*$/.test(myPath)) {
    p = myPath;
  } else {
    p = path.join(process.cwd(), myPath);
  }
  if (!fse.pathExistsSync(p)) {
    fse.mkdirpSync(p);
    // fse.ensureDirSync(p);
  }

  return p;
};


export const named = (value: string) => {
  console.log('named', value, locales[value])
  return typeof locales[value] !== 'undefined' ? locales[value] : value;
}
