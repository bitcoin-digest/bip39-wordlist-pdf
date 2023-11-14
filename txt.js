const fs = require("fs");
const bip39 = require("bip39");

// 获取英文助记词列表
const englishWords = bip39.wordlists.english;

// 获取中文助记词列表
const chineseWords = bip39.wordlists.chinese_simplified;

// 创建一个可写流，用于将助记词写入文件
const writableStream = fs.createWriteStream("wordlist.txt");

englishWords.forEach((word, index) => {
  writableStream.write(`${index + 1} ${word} ${chineseWords[index]}\n`);
});

// 关闭可写流
writableStream.end();
