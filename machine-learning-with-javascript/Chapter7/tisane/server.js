//***********************************************
//初期状態でGlitchのserver.jsに記述されているコード
const express = require('express');
const app = express();

app.use(express.static('public'));
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});
app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + this.address().port);
});

//***********************************************
//***********************************************


//ここからTisane APIを利用した処理

const request = require('request');

//Tisaneから取得した結果をフロントエンドのJavaScriptへ渡す
app.get('/data', function(request, response) {
  getJSON(request.query.keyword)
  .then((data) => response.send(data))
})


//Tisane APIを利用して結果を得る
function getJSON(text) {

  //Tisaneで設定できるパラメータ
  //出力ログのオプションは【settings】に追記していく
  const param = {
    'language': 'ja',
    'content': text,
    'settings': {
      'parses':true,
      'format':'shortpost',
      'disable_spellcheck':true,
      'subscope':false,
      'document_sentiment':false,
      'words':true,
      'snippets':true
    }
  };

  //request()のオプションを設定する
  //ご自身のAPIキーを設定してください
  const options = {
    url: 'https://api.tisane.ai/parse',
    method: 'POST',
    headers: {
      'Content-Type':'application/json',
      'Ocp-Apim-Subscription-Key':'*******************'
    },
    json: true,
    body: param
  }

  //結果をPromiseで返す
  return new Promise((resolve, reject) => {
    request(options, function (error, response, body) {
      resolve(body);
    })
  })
  
}
