const puppeteer = require('puppeteer');

(async () => {

  //初期設定
  //Puppeteerの起動、新規ページ作成、画面サイズの固定
  const browser = await puppeteer.launch({args: ['--no-sandbox']});
  const page = await browser.newPage();
  await page.setViewport({width: 1200, height: 800});
  
  
  //目的のWebサイトへ遷移
  //GitHubのサイトへ移動、検索ボックスにjavascriptを入力してエンターキーを押す
  //画面遷移したあとにDOM要素が完全に読み込まれるまで待つ
  await page.goto('https://github.com');
  await page.type('input[aria-label="Search GitHub"]', 'javascript');
  await page.keyboard.press('Enter');
  await page.waitForNavigation({waitUntil: "domcontentloaded"});


  //リポジトリ一覧の取得
  //タイトルとURLを配列に格納する
  //コンソールログに結果を出力する
  const result = await page.evaluate(() => {
    const elements = document.querySelectorAll("h3 > a.v-align-middle");
    const array = [];

    elements.forEach(function(item) {
      array.push({title:item.innerText,url:'https://github.com/'+item.innerText});
    })
    return array;
  });

  console.log(result);
  await browser.close();
  
})();
