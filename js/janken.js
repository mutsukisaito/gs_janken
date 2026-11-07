// ============================================================
// じゃんけんゲーム
//
// このファイルは上から順に、次の3つのまとまりでできています。
//   1. 設定データ   : 手や結果ごとの画像などを1か所にまとめたもの
//   2. 関数         : 「手を選ぶ」「勝敗を決める」などの処理
//   3. イベント登録 : ボタンが押されたときに関数を動かす指定
//
// ゲームの流れ
//   ページを開く → resetGame() で初期表示
//   手のボタンを押す → PCの手を選ぶ → 勝敗を判定 → 画面を更新
//   どちらかの残機が0になる → 結果の画像を出してボタンを止める
// ============================================================


// ------------------------------------------------------------
// 1. 設定データ
//    if文の中に画像名などを直接書かず、ここに集めています。
//    画像の変更や調整は、この部分だけ直せば済みます。
// ------------------------------------------------------------

// 残機の数。ここを変えるだけでハートの数が変わります
const MAX_LIVES = 3;

// 残機1つ分のHTML
const HEART_HTML = '<li><img src="img/heart_blur.png" alt="残機"></li>';

// じゃんけんの手。キー（gu など）は index.html の data-hand と同じ名前です
// beats には「その手が勝てる相手の手」を書きます
const HANDS = {
    gu: { name: "グー", src: "img/janken_gu.png", beats: "choki" },
    choki: { name: "チョキ", src: "img/janken_choki.png", beats: "pa" },
    pa: { name: "パー", src: "img/janken_pa.png", beats: "gu" },
};

// 勝敗ごとの表示。win / lose / draw は「ユーザーから見た結果」です
//   loserLives : 残機を減らす側のリストのセレクタ
//   finImg     : 残機が0になったときに出す画像
// あいこは残機が減らないので、loserLives と finImg がありません
const RESULTS = {
    win: {
        pcFace: { src: "img/pc-lose.png", alt: "PCの表情_負け" },
        userFace: { src: "img/user-win.png", alt: "人の表情_勝ち" },
        loserLives: "#pcLives",
        finImg: { src: "img/text_gameclear_j.png", alt: "ゲームクリア" },
    },
    lose: {
        pcFace: { src: "img/pc-win.png", alt: "PCの表情_勝ち" },
        userFace: { src: "img/user-lose.png", alt: "人の表情_負け" },
        loserLives: "#myLives",
        finImg: { src: "img/text_gameover_j.png", alt: "ゲームオーバー" },
    },
    draw: {
        pcFace: { src: "img/pc-draw.png", alt: "PCの表情_引き分け" },
        userFace: { src: "img/user-draw.png", alt: "人の表情_引き分け" },
    },
};

// ゲーム開始時の画像。リセットのときもこの内容に戻します
const INITIAL_IMAGES = {
    "#pcHand": { src: "img/fukidashi02.png", alt: "PCの手" },
    "#pcFace": { src: "img/pc-smile.png", alt: "ジャンケンロボット" },
    "#userFace": { src: "img/user-smile.png", alt: "あなたの表情" },
};


// ------------------------------------------------------------
// 2. 関数
// ------------------------------------------------------------

// PCの手をランダムに選び、"gu" などのキーを返す
function pickPcHand() {
    // Object.keys は、オブジェクトのキーを配列にしてくれます
    // → ["gu", "choki", "pa"]
    // 配列にすると、番号を使ってランダムに1つ取り出せます
    const handKeys = Object.keys(HANDS);
    const index = Math.floor(Math.random() * handKeys.length);
    return handKeys[index];
}

// 2つの手を比べて、"win" / "lose" / "draw" のどれかを返す
function judge(userHand, pcHand) {
    if (userHand === pcHand) {
        return "draw";
    }
    // 自分の手が勝てる相手（beats）がPCの手と同じなら勝ち
    // 同じ手でも勝ちでもなければ、残りは負けしかありません
    return HANDS[userHand].beats === pcHand ? "win" : "lose";
}

// 負けた側の残機を1つ減らし、0になったらゲームを終わらせる
function reduceLife(result) {
    const $lives = $(result.loserLives);
    $lives.children().last().remove();

    if ($lives.children().length === 0) {
        // 結果の画像を作って表示します
        const $finImage = $("<img>").attr(result.finImg);
        $("#finImg").empty().append($finImage).show();
        // ゲームが終わったので、手のボタンを押せなくします
        $("#userHand button").prop("disabled", true);
    }
}

// 画面をゲーム開始時の状態に戻す
// ページを開いたときとリセットのときで、同じこの関数を使います
function resetGame() {
    // 顔と吹き出しの画像を、src と alt のセットで元に戻します
    // $.each は、INITIAL_IMAGES の中身を1つずつ順番に取り出してくれます
    $.each(INITIAL_IMAGES, function (selector, image) {
        $(selector).attr(image);
    });

    // 同じHTMLを MAX_LIVES 個並べた文字列を作り、残機のリストを丸ごと入れ替えます
    // $("#myLives, #pcLives") のようにカンマで区切ると、両方に同時に効きます
    $("#myLives, #pcLives").html(HEART_HTML.repeat(MAX_LIVES));

    // 手のボタンを押せる状態に戻し、結果の画像を消します
    $("#userHand button").prop("disabled", false);
    $("#finImg").empty().hide();
}


// ------------------------------------------------------------
// 3. イベント登録
// ------------------------------------------------------------

// 手のボタンが押されたとき
$("#userHand button").on("click", function () {
    // 押されたボタンの data-hand の値（"gu" など）を受け取ります
    const userHand = $(this).data("hand");
    const pcHand = pickPcHand();
    const result = RESULTS[judge(userHand, pcHand)];

    // PCの手と両者の表情を更新します
    $("#pcHand").attr({ src: HANDS[pcHand].src, alt: "PCの手_" + HANDS[pcHand].name });
    $("#pcFace").attr(result.pcFace);
    $("#userFace").attr(result.userFace);

    // 勝ち負けがついたときだけ残機を減らします（あいこには loserLives がありません）
    if (result.loserLives) {
        reduceLife(result);
    }
});

// リセットボタンが押されたとき
$("#resetBtn").on("click", resetGame);

// 結果の画像が押されたとき
// 画像はあとから作られるので、親の #finImg に登録して 'img' で絞り込んでいます
$("#finImg").on("click", "img", resetGame);

// ページを開いたときの初期表示
resetGame();
