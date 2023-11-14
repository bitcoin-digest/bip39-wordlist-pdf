const fs = require("fs");
const { PDFDocument, rgb } = require("pdf-lib");
const fontkit = require("fontkit");
const bip39 = require("bip39");

// 获取英文助记词列表
const englishWords = bip39.wordlists.english;

// 获取中文助记词列表
const chineseWords = bip39.wordlists.chinese_simplified;

(async () => {
  // 创建一个新的PDF文档
  const pdfDoc = await PDFDocument.create();

  // 注册fontkit实例
  pdfDoc.registerFontkit(fontkit);

  // 设置A4纸大小
  const pageWidth = 595.28;
  const pageHeight = 841.89;

  // 设置字体和颜色
  const fontSize = 8;
  const textColor = rgb(0, 0, 0);

  // 设置每行的位置和间距
  const lineHeight = fontSize + 2;
  const startX = 20;
  const startY = pageHeight - 40;
  const linesPerPage = Math.floor((pageHeight - 80) / lineHeight);

  // 加载自定义字体
  const fontBytes = fs.readFileSync(
    "/Users/hofer/Library/Fonts/LXGWWenKai-Regular.ttf"
  );
  const customFont = await pdfDoc.embedFont(fontBytes);

  // 设置词组之间的间距
  const wordSpacing = pageWidth / 9;

  for (let i = 0; i < englishWords.length; i++) {
    const pageIndex = Math.floor(i / linesPerPage) % 8;
    const totalPageIndex = Math.floor(i / (linesPerPage * 8));
    let page;
    if (pdfDoc.getPageCount() <= totalPageIndex) {
      // 添加新页面
      page = pdfDoc.addPage([pageWidth, pageHeight]);
    } else {
      page = pdfDoc.getPages()[totalPageIndex];
    }

    const col = pageIndex;
    const row = i % linesPerPage;

    const x = startX + col * wordSpacing;
    const y = startY - row * lineHeight;

    // 将序号格式化为4位数
    const formattedIndex = String(i + 1).padStart(3, "0");

    page.drawText(`${formattedIndex} ${chineseWords[i]} ${englishWords[i]}`, {
      x,
      y,
      size: fontSize,
      font: customFont,
      color: textColor,
    });
  }

  // 将PDF文档序列化为字节
  const pdfBytes = await pdfDoc.save();

  // 将字节写入文件
  fs.writeFileSync("wordlist.pdf", pdfBytes);
})();
