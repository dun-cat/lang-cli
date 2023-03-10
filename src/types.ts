export type Source = {
  name: string;
  path: string;
}

export type Sources = Source[];

export type DSLData = { [key: string]: string[] };

export type ExportOptions = {
  sourceDir: string;
  targetFile: string;
}

export type ImportOptions = {
  importFile: string; // excel 表格文件路径
  sourceDir: string; // translation.json 的父目录。
  targetDir?: string; // 输出目录，merge 为 true 的时候不生效，默认为：true
  overwrite?: boolean; // 是否将翻译后的结果复用到 sourceDir 目录的 translation.json 里去。
}
