// 隨機抽牌組函式
function shuffle(){
	path = 'public/game2/';
	card_kind_list = ['card_01','card_02'] // 兩組牌
	index = Math.round(Math.random()+1)-1; // 隨機選一組牌組
	card_kind = card_kind_list[index];     
	imgFilePath = path+card_kind;

	img = [
			[imgFilePath+'/A01.png',imgFilePath+'/A02.png'],
			[imgFilePath+'/B01.png',imgFilePath+'/B02.png'],
			[imgFilePath+'/C01.png',imgFilePath+'/C02.png'],
			[imgFilePath+'/D01.png',imgFilePath+'/D02.png']
		  ]

	return img;
}

// 十進位函式
function pad ( val ) { return val > 9 ? val : "0" + val; }

// 網頁讀取的時候禁止動作
$(document).ready(function(){
	// 禁止按右鍵
	$(document).get(0).oncontextmenu = function() {
		return false;
	};
	// 禁止按ctrl/alt/shift
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
	}
	// 禁止在網頁選取
	$(document).get(0).onselectstart = function(){
	  return false;
	}
});

// 隨機得到某一組牌
img = shuffle();

//初始化參數
var	total = 0,         // 總翻對的數量
	count = 1,         // 每回合翻開的數量(最多兩張)
	first_card = null, // 每回合翻開的第一張牌
	secn_card = null,  // 每回合翻開的第二張牌
	sec = 30;          // 倒數時間
	
var stop_fa = false , // 可否auto翻牌，一開始設定false，自動隨機翻牌
	stop_fc = true,   // 可否手動翻牌，一開始設定true，還沒按start之前都不能手動翻牌
	stop_time = true; // 時間到沒，一開始設定true才不會馬上開始倒數

// 建立牌組九宮格(3*3 card group)
var card_id = 0       // card_id從0~9，遇到4就增加"開始卡"
for(i=0; i<3; i++){
	for(j=0; j<3; j++){
		if(card_id==4){
			// add a start card
			$('.room').append(
				`<div class="start">\
					<button class="face">\
					</button>\
				</div>`)
			card_id++;
			continue
		}
		$('.room').append(
			'<div class="card" data-id="'+card_id+'">\
				<div class="front face"></div>\
				<div data-bid="0" class="back face" ></div>\
			</div>')
		card_id++;
	}
	$('.room').append('<br>')
}

// 變數替代jquery選定的物件
var $card = $('.card'),
	$board = $('.board'),
	$start = $('.start .face'),
	$again = $('.again') ;

// 點選"開始卡"，開始遊戲
$start.click(function(){
	$(this).attr('disabled','disabled'); // 關掉中間"開始卡"的button
	$(this).css('opacity',100);          // "開始卡"的button的opacity要調回來不然會是陰影

	//按下就洗牌
	img = shuffle();

	total = 0;
	stop_fa = true;    // 設為true，停止自動翻牌
	stop_fc = false;   // 設為false，可以手動翻牌
	stop_time = false; // 設為false，開始計時
	
	$('.card').removeClass('cflip');  // card去掉翻開的class
	$(this).css("background-image","url('./public/game2/img/time.png')"); // "開始卡"放上背景圖片
	$(this).html(`<div class='sec'>${pad(sec)}</div>`); // "開始卡"中間顯示倒數秒數
	randomIMG(); // 洗牌
})

//重新開始遊戲
$again.click(function(){
	$start.attr('disabled','disabled'); // 關掉中間"開始卡"的button
	$start.css('opacity',100);          // "開始卡"的button的opacity要調回來不然會是陰影
	stop_fa = false;
	stop_fc = true;
	reset();
})


randomIMG();
flip_auto(1000);
flip_click();

// 洗牌
function randomIMG(){
	var c_array = [1,1,2,2,3,3,4,4];  // 共四對卡牌，同一組的同樣id
	var c_length = c_array.length;
	var $card = $('.card');           // 選取所有card
	var cardId_cnt = [2,2,2,2];       // 計算每一對卡片id的coda -> 每一對牌組都有兩個coda, (index+1)代表第幾副牌

	// 所有card進行隨機洗牌
	$card.each(function(){
		var r_id = Math.floor(Math.random() * (c_length - 1));	// Get Random Number -> 1~7
		
		//隨機選一個位置然後與最後一個互換(Swaping)，是一種演算法
		var temp = c_array[r_id]; // 選到哪一組id
		c_array[r_id]= c_array[c_length - 1]; 
		c_array[c_length - 1] = temp;

		c_length--;	 // decrement c_length by 1
		
		// 排過的卡片id就扣1個coda
		cardId_cnt[temp-1] -= 1;
		card_index = cardId_cnt[temp-1]; // coda=1 or coda=2 -> 用來放每一組牌的圖片(ex:A_01 or A_02)

		// Set css
		$(this).find('.back').css({								
			'background-image' : 'url('+img[temp-1][card_index]+')', 
			'background-repeat' : 'no-repeat',
			'background-size': 'contain',
		})

		// Set data attribute
		$(this).find('.back').attr('data-bid',temp)  // 把卡牌id設至data-bid屬性中(同一組牌會有同樣的data-bid，用來判斷兩者是否翻對)
	})

	return 0;
}

// 點擊卡牌
function flip_click(){
	// 歸零
	total = 0;  // 總翻對的數量
	count = 1;  //每回合翻的數量(最多兩次)
	first_card = null;
	secn_card = null ;

	var $card = $('.card');
	
	$card.find('.front').click(function(){
		// 不能手動翻牌
		if(stop_fc == true){
			return 0;
		}
		// 可以手動翻牌
		$(this).parent('.card').toggleClass('cflip'); // 點擊的那張牌翻開or蓋上

		// 每回合翻開的第一張牌
		if(count == 1){
			first_card = $(this).parent('.card').find('.back').attr('data-bid');
		}
		// 每回合翻開的第二張牌
		else if(count == 2){
			secn_card = $(this).parent('.card').find('.back').attr('data-bid');
		}
		// 兩張牌翻對
		if(first_card == secn_card){
			$('[data-bid="'+first_card+'"]').parent('.card').addClass('cfliped'); // 兩張同樣data-bid(答對)的牌加上已翻開的class
			
			total++; // 總翻對的牌組數量+1
			
			// 全部翻對
			if (total == 4) {
				stop_time = true;  // 停止倒數
				toAnsPage(800);    // 過800微秒後跳頁至解答頁
			}
		}

		count++; // 每回合翻的數量+1

		// 當user無腦狂點的時候->初始化
		if(count>2){
			first_card = null;
			secn_card = null;
			count = 1;
			setTimeout(function(){
				$card.removeClass('cflip');
			},400)
		}		
	});

	// 設定每一秒倒數
	setInterval( function(){
		// 預設stop_time=true,直到按下start才開始倒數
		if(stop_time){
			return
		}
		// 倒數時間到
		if(sec==0){
			$('.start .face').css('background-image',"url('./public/game2/img/timesup.png')")
			$('.sec').hide();  // 隱藏秒數
			$('.card').addClass('cflip'); // 全部卡牌翻開
			stop_time = true;  // 停止倒數
			toAnsPage(2000);   // 2秒後跳頁至解答頁
			return
		}
		$(".sec").text(`${pad(--sec%60)}`);  // 顯示秒數每秒被扣
	}, 1000);
}

// 跳頁至解答頁
function toAnsPage(time){
	// 設定倒數time秒
	setTimeout(function(){
		//放哪一組牌對應的答案
		$('#ans').attr('src',`./public/game2/img/answer-${card_kind}.png`);
		$.mobile.changePage('#page_ans',{allowSamePageTransition:true,transition:"slidedown"}) // 跳頁
	}, time);
}

// 隨機產生數字 
function randomNum( min, max ) {
	return Math.floor(Math.random() * ((max - min)+1) + min);
}

// 自動翻牌函式
function flip_auto(time){
	// 設定倒數time秒
	setTimeout(function(){
		// 停止自動翻牌
		if(stop_fa){
			return ;
		}
		// 隨機抽取兩個random的數字(1~9)
		var r_ran_1 = randomNum(1,9);
		var r_ran_2 = randomNum(1,9);
		// 若兩個random數字不相同才翻牌，目的是避免連續翻兩次(會閃)
		if(r_ran_1 != r_ran_2){
			$('[data-id="'+r_ran_1+'"]').toggleClass('cflip')
			$('[data-id="'+r_ran_2+'"]').toggleClass('cflip')
		}
		// 隨機random一個時間做下一次的翻牌
		var newTime = randomNum(1000,2000);	
		flip_auto(newTime)

	}, time)
}

//初始化(重設遊戲)
function reset(){
	sec = 30;                      //初始化倒數時間
	$('.sec').text(`${pad(sec)}`); // 重新渲染秒數
	$('.sec').hide();              // 秒數隱藏
	$('.card').removeClass('cfliped'); // 全部牌蓋回去
	$('.start .face').css("background-image","url('./public/game2/img/btn-start.png')") //重新置入start的圖片
	$('.start .face').removeAttr('disabled'); //開啟中間的遊戲開始按鈕

	//重新抽牌組,洗牌，並自動翻牌
	img = shuffle();
	randomIMG();
	flip_auto();

	// 初始化自動翻牌/手動翻牌的bool
	stop_fc = true;
	stop_fa = false;

	return true;
}

// 再挑戰一次的按鈕
$('#playagain img').on('click',function(){
	reset(); // 重設遊戲
	$.mobile.changePage('#page1',{allowSamePageTransition:true,transition:"slidedown"}); // 跳頁
})
