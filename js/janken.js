// 関数の外の初期値
// 残機の表示
const heartHtml = '<li><img src="img/heart_blur.png" width="24"></li>';
const maxLives = 3;
// ボタンを押した
$("#userHand button").on("click", function () {

    // ユーザーが押した手を取得
    const myHand = $(this).find('img').attr('alt');
    console.log("ユーザーが押した手" + myHand);

    // コンピューターの手 randamで出す
    let num = Math.floor(Math.random() * 3);

    // 0=グー,1=チョキ,2=パー
    let pcHand = "";
    let pcHandImg = {};
    if (num === 0) {
        pcHand = "グー";
        pcHandImg = { src: '../img/janken_gu.png', alt: 'PCの手_グー' };
    } else if (num === 1) {
        pcHand = "チョキ";
        pcHandImg = { src: '../img/janken_choki.png', alt: 'PCの手_チョキ' };
    } else {
        pcHand = "パー";
        pcHandImg = { src: '../img/janken_pa.png', alt: 'PCの手_パー' };
    }
    console.log("pcHand" + pcHand);

    // コンピューターの表情
    let pcFaceData = {};
    // 人の表情
    let userFaceData = {};
    // ユーザーとコンピューターの手を比較して判定
    let judge = "";

    if (myHand === pcHand) {
        judge = "あいこ";
        pcFaceData = { src: '../img/pc-draw.png', alt: 'PCの表情_引き分け' };
        userFaceData = { src: '../img/user-draw.png', alt: '人の表情_引き分け' };
    } else if (
        (myHand === "グー" && pcHand === "チョキ") ||
        (myHand === "チョキ" && pcHand === "パー") ||
        (myHand === "パー" && pcHand === "グー")
    ) {
        judge = "勝ち";
        pcFaceData = { src: '../img/pc-lose.png', alt: 'PCの表情_負け' };
        userFaceData = { src: '../img/user-win.png', alt: '人の表情_勝ち' };
    } else {
        judge = "負け";
        pcFaceData = { src: '../img/pc-win.png', alt: 'PCの表情_勝ち' };
        userFaceData = { src: '../img/user-lose.png', alt: '人の表情_負け' };
        // 残機を減らす
        $("#myLives li:last-child").remove();
        // 残機が0になったかチェック
        if ($("#myLives li").length === 0) {
            // 残機が0のときゲームオーバー表示
            $("#finImg").html('<img src="img/text_gameover_j.png" alt="ゲームオーバー">');
            console.log("ゲームオーバー");
            // #userHand 内のすべての button を非活性にする
            $("#userHand button").prop("disabled", true);
        }
    }

    // 結果をHTML側に返す
    $('#pcFace').attr(pcFaceData);
    $('#userFace').attr(userFaceData);
    $("#pcHand").attr(pcHandImg);
    console.log("#result"+ judge);
});

// リセットボタンでジャンケン結果を初期化
$('#resetBtn').on('click', function () {
    // data-default に保存していた初期値を取得
    let defaultPCFace = $('#pcFace').data('default');
    let defaultUserFace = $('#userFace').data('default');
    let defaultPCHand = $('#pcHand').data('default');
    let defaultResult = $('#result').data('default');
    // src に設定する
    $('#pcFace').attr('src', defaultPCFace);
    $('#userFace').attr('src', defaultUserFace);
    $('#pcHand').attr('src', defaultPCHand);
    $('#result').text(defaultResult);
    // 残機を3に戻す
    // 中身を空にする
    $("#myLives").empty();

    // 指定した数だけ変数化したHTMLを追加
    for (let i = 0; i < maxLives; i++) {
        $("#myLives").append(heartHtml);
    }

    // じゃんけんボタンを再び押せる状態に戻す
    $("#userHand button").prop("disabled", false);
    // ゲームオーバー画像を消去
    $("#finImg").empty();
});
