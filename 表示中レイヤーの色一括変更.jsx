/* --------------------------------------------------------
JavaScript for Illustrator

「表示中レイヤーの色一括変更」

表示中のレイヤー（目アイコンがついている）の表示カラーを一括で変更します。
スクリプトを起動すると、カラーコードの質問ダイアログが出るので、
カラーコードを入力しOKを押すか、止める場合はキャンセルしてください。

┏━レイヤーパネル━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ 目 | 鍵|  | このレイヤーは色変更される　| ○ ┃
┃ 　 | 鍵|  | このレイヤーは色変更されない| ○ ┃
┃ 目 | 　|  | このレイヤーは色変更される　| ○ ┃
┃ 　 | 　|  | このレイヤーは色変更されない| ○ ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

作成者：こばやしちひろ              2024_09_16

-------------------------------------------------------- */

/**
 * スクリプト本体
 * 途中の異常系で処理中断したいので、無名関数の即時実行の形にした
 * エラーのポップアップは中の処理に任せる
 */
(function () {
  // 開いているドキュメントの取得
  var doc = app.activeDocument;

  // 色を質問する
  try {
    var code = colorQuestion();
  } catch (e) {
    alert(e.message);
    throw e;
  }

  // カラーの作成・戻り値はRGBオブジェクト
  try {
    var colorFromCode = createRGBColor(code);
  } catch (e) {
    alert('色の作成に失敗しました' + e.message);
    throw e;
  }

  // 全レイヤーの取得〜表示レイヤーのみ色変更（shiftでハイライトしてるレイヤーだけの取得ができなかった）
  // ドキュメントを直接操作する部分は関数化せずに書いた方が見通し良いと思ったのでここに処理を書いた
  try {
    var layers = doc.layers;
    for (var i = 0; i < layers.length; i++) {
      if (layers[i].visible) {
        layers[i].color = colorFromCode;
      }
    }
  } catch (e) {
    alert('レイヤーの色設定に失敗しました', + e.messgae);
    throw e;
  }
})()


// -----色変更までの準備処理-----------------------------------------------------------

/**
 * 色の質問ダイアログ。
 * 機能説明・カラーコードのバリデーションチェック。役割多くてごめん。
 * 呼び出し側で異常系キャッチすること。
 */
function colorQuestion() {
  var descriptions = [
    '【表示中レイヤーの色一括変更スクリプト】',
    'レイヤーに一括設定する色のカラーコードを入力してください。',
    '例: cd2501',
    '・大文字小文字どちらでも可。',
    '・入力したらOKを押してください。',
    '・キャンセルすれば何も変更されません。',
    '★変更されるのは表示中のレイヤーだけなので注意！',
  ];
  var descriptionStr = descriptions.join('\n');
  var answer = Window.prompt(descriptionStr, '');
  // 入力値のバリデーション
  var regex = new RegExp(/[a-fA-F0-9]{6}/);
  if (regex.test(answer)) {
    return answer;
  } else {
    throw new Error('16進数のカラーコードで設定してください')
  }
}

/**
 * 16進カラーコード文字列を２文字ごと切り10進変換。色設定したRGBオブジェクトを返却。
 * @param 16進カラーコード 
 * @returns RGBカラーオブジェクト
 */
function createRGBColor(code) {
  var redNum = parseInt(code.substring(0, 2), 16);
  var greenNum = parseInt(code.substring(2, 4), 16);
  var blueNum = parseInt(code.substring(4, 6), 16);
  // RGBオブジェクト。new時に色まで指定できなかったので仕方なく以下記述。
  var rgb = new RGBColor();
  rgb.red = redNum;
  rgb.green = greenNum;
  rgb.blue = blueNum;
  return rgb;
}