//***********************************************
//初期状態でGlitchのserver.jsに記述されているコード
const express = require('express');
const app = express();

app.use(express.static('public'));
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/everypixel/sample1.html');
});
app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + this.address().port);
});

//***********************************************
//***********************************************


//※ここから本書で作成したソースコードです

const request = require('request');

//フロントエンドのJavaScriptから/dataにアクセスした時の処理
//アクセストークンを取得してからEverypixel APIを使う
//本書で作成した関数
//everyPixel()
//getJSON()
app.get('/data', function(request, response) {  
  everyPixel()
  .then((token) => getJSON(token.access_token, request.query.imgurl))
  .then((data) => response.send(data))
});



//アクセストークンの取得処理
//ご自身のAPIキーを設定してください
function everyPixel() {
  const client = '************';
  const secret = '************';

  const options = {
    url: 'https://api.everypixel.com/oauth/token',
    method: 'GET',
    qs: {
      client_id: client,
      client_secret: secret,
      grant_type: 'client_credentials'
    }
  }

  //結果を取得してからPromiseで返す
  return new Promise((resolve, reject) => {
    request(options, function (error, response, body) {
      resolve(JSON.parse(body));
    })
  })
}


//実際にEverypixel APIを利用する処理
//（画像認識によるキーワードリストの取得）
function getJSON(token, imgurl) {
  const options = {
    url: 'https://api.everypixel.com/v1/keywords',
    method: 'GET',
    qs: {
      url: imgurl,
      num_keywords: 10 //取得するキーワード数
    },
    headers: {'Authorization': 'Bearer ' + token}
  }
  
  //結果を取得してからPromiseで返す
  return new Promise((resolve, reject) => {
    request(options, function(error, response, body) {
      resolve(body);
    })
  })
}




/*
//その他、3種類のEverypixel API
const qualityUGC = 'https://api.everypixel.com/v1/quality_ugc';
const qualityURL = 'https://api.everypixel.com/v1/quality';
const faceURL = 'https://api.everypixel.com/v1/faces';

//サンプル例
function getJSON(token, imgurl) {
  const options = {
    url: faceURL,
    method: 'GET',
    qs: {url: imgurl},
    headers: {'Authorization': 'Bearer ' + token}
  }
  
  //結果を取得してからPromiseで返す
  return new Promise((resolve, reject) => {
    request(options, function(error, response, body) {
      resolve(body);
    })
  })
}
*/
