// img檔案路徑
path = 'public/game1/輪盤/'

// question.csv放在github上
// question.csv -> [quesId,title,quesDescrip,A,B,C,D,ans,ansDescrip]
// file = 'https://gist.githubusercontent.com/DysonMa/89f6d8f53ad84df07a963f8333857f39/raw/8067a74d4cedfe62e57cfea7a4b6a0b52890a43d/question.csv'
file = './public/question.csv'


 // 用D3載入問題敘述的csv
 ques_list = []
 d3.csv(file, function(data){
   ques_list.push(data);  //用table的方式在console呈現json
  //  console.log(data)
   return ques_list;
 });


// 避免跳頁過程出意外
// function escape_error(){
// 	if($('.question').text()==""){
// 		reset();
//   }
// }


// 禁止進行任何動作
$(document).ready(function() {  

  // 禁止按右鍵
  $(document).get(0).oncontextmenu = function() {
      return false;
  };
  // 禁止按ctrl/alt/shift/F5重新整理
  $(document).get(0).onkeydown = function(){
    if ( event.ctrlKey ){
        return false;
    }
    if ( event.altKey ){
        return false;
    }
    if ( event.shiftKey ){
        return false;
    }
    // F5重新整理
    if (event.keyCode==116){ 
        return false;
    }
  }
  // 禁止在網頁選取
  $(document).get(0).onselectstart = function(){
    return false;
  }
}); 

// 初始化參數
var iEnd = -1;      // 假設iEnd是請求獲得的獎品結果
stop_time = false;  // 
sec = 60;           // 設定倒數時間60秒
var setint;         // 設定倒數計時器

// 轉盤按鈕
$(".turntable_btn").on("click", function(){
  var $this = $(this);
  $(".card").attr('value',-1);  //初始化，把A,B,C,D四張卡片的value改為-1，才不會玩到最後通通都不是-1

  // 隨機選一題    
  iEnd = Math.floor(Math.random() * 8); // 0~7
  $(".turntable_btn").addClass("go");   // 轉盤增加go這個class，因為go是會觸發旋轉動畫 

  // 網路上的插件 jquery-keyframes
  // var supportedFlag = $.keyframe.isSupported(); // 判斷是否支援
  // 定義go動畫
  $.keyframe.define([{
    name: 'go',
    '0%': {'transform': 'translate(-50%,-50%) rotate(0deg)'},
    '100%': {'transform': 'translate(-50%,-50%) rotate('+(1080+iEnd*45)+'deg)'}  // 都先轉10圈，最後一圈才決定要轉幾度(depend on 第幾題) 
  }]);

  // go動畫
  $('.turntable_btn.go').playKeyframe(
    {
    name: 'go',
    duration: "3.5s",           // 動畫執行時間
    timingFunction: 'ease-out', // 快到慢
    iterationCount: '1',        // 只執行一次動畫
  });

  //禁用，避免轉盤在轉的過程中還可以按
  $this.attr("disabled", "disabled");

  // 設定倒數時間
  setTimeout(function(){
    $this.removeAttr("disabled"); // 恢復按鈕可以按
    
    $('#page_ques .wrongAns').hide(); // 答錯頁面是屬於第二頁，只是是一張圖，初期先讓它隱藏
    Q_dict = ques_list[iEnd]          // 從question.csv中撈出隨機選中的那一題

    // 把問題敘述渲染到page_ques的頁面上，ex: Q5: 題目敘述...
    $('.question').text(Q_dict['quesDescrip']);
    
    // 設定選項的value
    option = ['A','B','C','D'];
    for(var i=0 ; i < option.length ; i++){
      if(option[i] == Q_dict['ans']){
        $(`#${option[i]}`).attr('value',Q_dict['quesId']); // 該選項是答案的value設定為quesId(第幾題)
      }
      $(`#${option[i]} > div`).html('DAWHO<br>'+ Q_dict[`${option[i]}`]);
    }
  
    // 跳轉頁面
    sec = 60;           // 設定倒數時間60秒
    stop_time = false;  // 不要停止計時
    $('.title .timeImg').html(`<div class='sec'>${sec}</div>`);  // 顯示秒數
    $.mobile.changePage(`#page_ques`,{allowSamePageTransition:true,transition:"slidedown"}) // 跳頁跳到問題頁
    // escape_error()
    clearInterval(setint); // 清空倒數計時器，否則會一直倒數
    // 設定倒數計時器
    setint = setInterval( function(){
      // 預設stop_time=true -> 直接return
      if(stop_time){
        return
      }
      // 當倒數結束
      if(sec==0){
        $('.title .timeImg').css('background-image',"url('./public/game2/img/timesup.png')")
        $('.sec').hide(); // 秒數隱藏
        stop_time = true; // 停止倒數
        reset(); //回轉盤那頁

        return
      }
        $(".sec").text(`${pad(--sec%60)}`);  // 顯示秒數每秒被扣一
      }, 1000);
  }, 4000);
});

// 十進位函式
function pad ( val ) { return val > 9 ? val : "0" + val; }

// 點擊卡片
$(".card").on("click",function(){

  // 如果被標記成不能點就直接return
  if($(this).attr("clickable")=="no"){
    return
  }

  ans = $(this).attr('value'); // 答對哪一題，或是-1(代表答錯)

  // 答對 Correct
  if(ans!='-1'){
    ans = $('.card[value!="-1"]').attr('value'); // 不是-1就是答對的題號
    $('#page_ans').css('background-image',`url(./public/game1/解答/A${ans}.jpg)`);
    $('#page_ans').css('background-size','contain');
    $.mobile.changePage('#page_ans',{allowSamePageTransition:true,transition:"slidedown"});  // 跳頁
    stop_time = true; // 答對就停止倒數計時
  }
  // 答錯 Wrong
  else{
    $('#page_ques .wrongAns').fadeIn();
    $('#page_ques .container').hide();

    $(this).find('.wrong_ans').show(); // 顯示(蓋上)答錯的圖片
    $(this).css('cursor','default');  // 不能有手指的cursor
    $(this).attr("clickable","no");    // 讓他不能再點

    // 設定兩秒後，答錯頁面fadeout，題目敘述跟卡片fadein回來
    setTimeout(function(){
      $('#page_ques .wrongAns').fadeOut();
      $('#page_ques .container').fadeIn();
    }, 2000);
  }
})

//重新設定遊戲
function reset(){
  $.mobile.changePage('#page1',{allowSamePageTransition:true,transition:"slidedown"}); // 跳回轉盤那頁
  $('.turntable_btn').css('transform','translate(-50%,-50%) rotate(0deg)');            // 指針回到原點
  $(".turntable_btn").resetKeyframe();   // 重設轉盤動畫
  $('.title .timeImg').css('background-image',"url('./public/game2/img/time.png')")    // 倒數計時圖片

  $(".card").find('.wrong_ans').hide(); // .card 隱藏(揭開)答錯的圖片
  $(".card").css('cursor','pointer');  // .card有手指的cursor
  $(".card").attr("clickable","yes");    // 讓.card可以再點
}

// 再挑戰一次按鈕
$('#playagain img').on('click',function(){
  $('.ui-page').css('background-image',`url(./public/game1/答題頁/bg.jpg)`);
  reset(); // 重設遊戲
})

// 按鈕音效
function playSoundEffect(){
  var playSoundCorrect = new Audio("./public/game1/click.mp3");
  playSoundCorrect.play();
}
$(function(){
  // 按下輪盤開始按鈕
  $(".turntable_btn").on("click",function(){
      playSoundEffect();
  })
  // 按下卡牌
  $(".card[clickable = 'yes']").on("click",function(){
    playSoundEffect();
  })
  // 按下再玩一次的按鈕
  $("#playagain").on("click",function(){
    playSoundEffect();
  })
});