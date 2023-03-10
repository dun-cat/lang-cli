export const locales = {
  "zh-CN": "中文",
  "en-US": "英文",
  "id-ID": "印尼",
  "id": "印尼",
  "in-ID": "印尼",
}

export const reverseLocales = Object.keys(locales)
  .reduce((result, key) => {
    result[locales[key]] = key;
    return result;
  }, {})