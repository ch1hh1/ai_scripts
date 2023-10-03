/* --------------------------------------------------------
JavaScript for Illustrator
「改行テキストから新規レイヤー作成」

選択されたテキストフレーム内のテキストをレイヤー名とする、
新規レイヤーを作成します。
テキストフレーム内の改行ごとにレイヤーを作成します。

Adobe Illustrator 2023(27.064)での動作を確認しました
作成者：ch1hh1
作成：2023_10_02
ライセンス：MITライセンス
-------------------------------------------------------- */

// 選択されているオブジェクトを取得
try {
  var selectedObj = app.activeDocument.selection;

  // 選択対象に関するチェック
  if (selectedObj.length === 0) {
    // 未選択エラー
    throw new Error("no selected");
  } else if (selectedObj.length === 1) {
    if (selectedObj[0].typename === "TextFrame") {
      // 選択したテキストボックスを変数に入れる（可読性が少し上がるだけで意味はない）
      var selectedTextFlame = selectedObj[0];
    } else {
      // 選択がテキストフレーム以外のエラー
      throw new Error("no text");
    }
  } else {
    // 選択多すぎるエラー
    throw new Error("too many");
  };

  for (var i = 0; i < selectedTextFlame.paragraphs.length; i++) {
    var target = selectedTextFlame.paragraphs[i].contents
    // 改行のみの場合はスキップ
    if (target === "") {
      continue
    };
    // 新規レイヤーを作成し、テキストを名前に割り当てる
    var newLayer = app.activeDocument.layers.add();
    newLayer.name = target;
  };

} catch (e) {
  if (e.message === "no selected") {
    alert("テキストフレームを1つ選択してね");
  } else if (e.message === "too many") {
    alert("選択するテキストフレームは1つのみでお願いします");
  } else if (e.message === "no text") {
    alert("選択するのはテキストフレームでお願いします");
  } else {
    alert("予想外のエラーです...よければ開発者に教えてあげてください");
  };
};
