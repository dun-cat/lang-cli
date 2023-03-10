# translation-cli

该工具的功能：

1. 未翻译的 locales 文件的合并导出。
2. 已翻译的 excel 文件的导入。

### 开发分支

dev/0.0.1

### 如何本地开发？

``` bash
yarn lib # 编译

yarn test:out # 测试导出

yarn test:int # 测试导入
```

### 如何使用？

#### 安装 cli 包

``` bash
 npm install -D @xy/translation-cli
```

#### 集成到 package.json 内

``` json
{
  "scripts": {
    "t:out": "tran export -s ./public/locales -t . -f output -ot excel",
    "t:in": "tran import -s ./public/locales -i ./translated.xlsx --overwrite",
  }
}
```

#### tran export

Json 合并导出为 其它格式文件，目前支持导出格式：csv、markdown、excel。

`t:out`： 匹配`./public/locales`目录下 translation.json 文件，导出 excel 文件，导出目录为`当前目录`，导出文件名为`output`。

NOTE：目前对目录及文件结构严格要求以下结构：

``` text
.
├── en-US
│   └── translation.json
├── in-ID
│   └── translation.json
└── zh-CN
    └── translation.json
```

#### tran import

把已翻译的 excel 表格导入为对应语言的多个 translation.json 文件。

"t:in": "tran import -s ./public/locales -i ./translated.xlsx --overwrite",

`t:in`：指定并入源为`./public/locales `目录，指定已翻译文件为`./translated.xlsx`，覆写`./public/locales `目录的 translation.json 文件.

#### 命令帮助

``` bash
tran export --help
```

``` bash
tran import --help
```