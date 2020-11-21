// 定義品牌陣列
const brands = [
  // {
  //   iconName:'amazon.png',
  //   brandName: 'amazon',
  // },
  // {
  //   iconName:'apple.png',
  //   brandName: 'apple',
  // },
  // {
  //   iconName:'costco.png',
  //   brandName: 'costco',
  // },
  {
    iconName:'disney.png',
    brandName: 'disney',
  },
  {
    iconName:'facebook.png',
    brandName: 'facebook',
  },
  {
    iconName:'google.png',
    brandName: 'google',
  },
  {
    iconName:'microsoft.png',
    brandName: 'microsoft',
  },
  {
    iconName:'netflix.png',
    brandName: 'netflix',
  },
  {
    iconName:'starbucks.png',
    brandName: 'starbucks',
  }]

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


// 定義參數
let correct = 0; // 答對的數量
let total = 0;   // 總共嘗試的數量
var setint;      //初始化計時器，否則一開始clearInterval(setInt)會出現setInt沒有定義
const totalDraggableItems = 9; // 公司品牌數量
const totalMatchingPairs = 6; // 公司logo數量，Should be <= totalDraggableItems

// 十進位函式
function pad ( val ) { return val > 9 ? val : "0" + val; }

// 初始化遊戲
function initiateGame() {
  //設定倒數時間
  sec = 60;
  $('#count').html(`<button class="fab fa-time.png ui-btn ui-shadow ui-corner-all" id="cntdown"><div class='sec'>${sec}</div></button>`);
  
  // 數量歸零
  correct = 0;
  total = 0;  

  // 一開始設為true,才不會一進到initiate函式就開始計時
  stop_time = true

  // 平板
  var board;


  // Drag and Drop Functions
  // Events fired on the drag target
  // 被拖曳的物件(公司品牌)觸發
  function dragStart(event) {
    event.dataTransfer.setData("text", event.target.id); // or "text/plain" 設定event傳送id給text
  }

  // Events fired on the drop target
  // 滑鼠拖曳狀態下，滑鼠進入drop物件，由drop物件觸發
  function dragEnter(event) {
    if(event.target.classList && event.target.classList.contains("droppable") && !event.target.classList.contains("dropped")) {
      event.target.classList.add("droppable-hover");
    }
  }
  // 滑鼠拖曳狀態下，滑鼠在drop物件上，由drop物件觸發
  function dragOver(event) {
    if(event.target.classList && event.target.classList.contains("droppable") && !event.target.classList.contains("dropped")) {
      event.preventDefault();
    }
  }
  // 滑鼠拖曳狀態下，滑鼠離開drop物件，由drop物件觸發
  function dragLeave(event) {
    if(event.target.classList && event.target.classList.contains("droppable") && !event.target.classList.contains("dropped")) {
      event.target.classList.remove("droppable-hover");
    }
  }

  // 定義物件
  const draggableItems1 = document.querySelector("#drag-1st"); // 公司品牌第一列
  const draggableItems2 = document.querySelector("#drag-2nd"); // 公司品牌第二列
  const matchingPairs = document.querySelector(".matching-pairs"); // 公司logo
  
  // 每次初始化都先清空內部的html,避免後續程式碼讓他堆疊
  draggableItems1.innerHTML = ''
  draggableItems2.innerHTML = ''
  matchingPairs.innerHTML = ''

  // 隨機sample公司品牌/公司logo至陣列
  const randomDraggableBrands = generateRandomItemsArray(totalDraggableItems, brands);
  const randomDroppableBrands = totalMatchingPairs<totalDraggableItems ? generateRandomItemsArray(totalMatchingPairs, randomDraggableBrands) : randomDraggableBrands;
  // const alphabeticallySortedRandomDroppableBrands = [...randomDroppableBrands].sort((a,b) => a.brandName.toLowerCase().localeCompare(b.brandName.toLowerCase()));

  // 把公司品牌排上去html
  // Create "draggable-items" and append to DOM 
  for(let i=0; i<3; i++){
    // 計時器 -> 移到html那邊加入
    // if(i==2){
    //   draggableItems1.insertAdjacentHTML("beforeend",
    //   `<button class="fab fa-time.png ui-btn ui-shadow ui-corner-all" id="cntdown"><div class='sec'>${sec}</div></button>`);
    // }
    // 排第一列公司品牌
    draggableItems1.insertAdjacentHTML("beforeend", `
      <i class="fab fa-${randomDraggableBrands[i].iconName} draggable" draggable="true">
        <img class="icon" src='./public/game3/公司名稱/${randomDraggableBrands[i].iconName}' id="${randomDraggableBrands[i].iconName}" ontouchstart="pickup(event)" ontouchmove="move(event)" ontouchend="drop(event)"></img>
      </i>`);
  }

  // ontouchstart="pickup(event)" ontouchmove="move(event)" ontouchend="dropp(event)"

  // 排第二列公司品牌
  for(let i=3; i<6; i++){
    draggableItems2.insertAdjacentHTML("beforeend", `
      <i class="fab fa-${randomDraggableBrands[i].iconName} draggable" draggable="true" id="${randomDraggableBrands[i].iconName}" >
        <img class="icon" src='./public/game3/公司名稱/${randomDraggableBrands[i].iconName}' id="${randomDraggableBrands[i].iconName}" ontouchstart="pickup(event)" ontouchmove="move(event)" ontouchend="drop(event)"></img>
      </i>`);
  }

  // 把公司logo排上去html
  // Create "matching-pairs" and append to DOM
  for(i=0; i<2; i++){
    for(j=0; j<3; j++){
      matchingPairs.insertAdjacentHTML("beforeend", `
      <div class="matching-pair">
        <span class="droppable" data-brand="${randomDroppableBrands[i*3+j].iconName}" style="background-image:url('./public/game3/公司logo/${randomDroppableBrands[i*3+j].iconName}')" ontouchend="drop(event)">
        </span>
      </div>`);
    }
    matchingPairs.insertAdjacentHTML("beforeend",'<br>');
  }

  



  //此時才能用document去query，因為剛剛才建立好這些物件
  const draggableElements = document.querySelectorAll(".draggable"); // 可以拖拉的物件(所有的公司品牌)
  // 所有拖拉物件(公司品牌)加上dragstart事件
  draggableElements.forEach(elem => {
    elem.addEventListener("dragstart", dragStart);
    // elem.addEventListener("touchstart", touchHandler, true)
    // elem.addEventListener("drag", drag);
    // elem.addEventListener("dragend", dragEnd);
  });

  // 計時器按鈕 (因為#cntdown在initiate函式中才建立，所以onclick函式要放在initiate裡面)
  // $("#cntdown").on('click',function(){
  // 跳頁之後直接開始計時
  stop_time = false;

  // 讓可以置放的matching boxes(公司logo)在按下倒數計時之後才增加event(否則就是disabled)
  droppableElements = document.querySelectorAll(".droppable"); //可以置放的(公司logo)
  // 公司logo增加事件
  droppableElements.forEach(elem => {
    elem.addEventListener("dragenter", dragEnter);
    elem.addEventListener("dragover", dragOver);
    elem.addEventListener("dragleave", dragLeave);
    elem.addEventListener("drop", drop);
  });
  
  // 清空倒數計時器!! -> 若沒做，每次進函式都會一直跑之前的計時
  clearInterval(setint);
  // 設定倒數計時器
  setint = setInterval( function(){
    // 預設stop_time=true -> 直接return
    if(stop_time){
      return
    }
    // 時間到
    if(sec==0){
      stop_time = true; // 當倒數結束，stop_time=true
      $('#cntdown').css('background-image',"url('./public/game3/素材/timesup.png')") //渲染時間到的圖片
      $('.sec').hide(); // 隱藏秒數
      $('.draggable').attr('disabled','disabled') // disabled拖拉的元素
      
      // 倒數時間到/答對/答錯時modal跳出
      $('#window').css('background-image','url("./public/game3/素材/popup-fail.png")') // <p.s.>content:url('...') -> 用css去放img

      $('#window').css('width','700px') // 客製化答對時的寬度
      $(".modal-footer").css('height','250px') // 客製化時間到時的playaagain的高度

      // $('#window').css('width','') // 客製化時間到時的寬度
      // $(".modal-footer").css('height','350px') // 客製化時間到時的playaagain的高度
      $("#myModal").modal({backdrop:'static',keyboard:false}); // 避免點擊外部空白而消失modal(重要!!)
      $('#myModal').modal('show');
      
      return
    }
    $('#cntdown').css('cursor','default'); // 倒數計時過程中，按鈕不能再點
    $(".sec").text(`${pad(--sec%60)}`);    // 顯示秒數每秒被扣
    }, 1000);
  // })
}

// 每個公司品牌drop到每個公司logo所執行的函式
function drop(event) {
  event.preventDefault();

  // 電腦
  if(event.type=="drop"){
    event.target.classList.remove("droppable-hover");
    var draggableElementBrand = event.dataTransfer.getData("text");  // 用text接收drag夾帶的id
    var droppableElementBrand = event.target.getAttribute("data-brand"); 
  }
  // 觸控板
  else if(event.type=="touchend"){
    $(".droppable-hover").removeClass("droppable-hover")  // 每次移動都把有包含hover這個動畫的元素的class去除
    event.target.style.zIndex = '-10';  // 先藏下去，因為elementFromPoint是找最上層
    var draggableElementBrand = event.target.id;  // pickup選取的icon
    var drop_element = document.elementFromPoint(event.changedTouches[0].clientX, event.changedTouches[0].clientY) // elementFromPoint從位置抓元素(drop位置最上方的元素)
    if(drop_element!=undefined){
      var droppableElementBrand = drop_element.getAttribute("data-brand"); 
    }
    
    event.target.style.zIndex = '1'; // 再放上層，不然會看不見
  }

  const isCorrectMatching = draggableElementBrand===droppableElementBrand; // 判斷drop/drag是否是同樣的公司

  total++; // 總嘗試數量+1

  // drop對
  if(isCorrectMatching) {
    const draggableElement = document.getElementById(draggableElementBrand);
    event.target.classList.add("dropped");
    draggableElement.classList.add("dragged");
    draggableElement.setAttribute("draggable", "false");
    event.target.innerHTML = `<i class="fab fa-${draggableElementBrand}" style="color: ${draggableElement.style.color};"></i>`;
    // 改變matching pairs(公司logo)的背景圖片為股價
    $(`span[data-brand = "${droppableElementBrand}"]`).css('background-image',`url('./public/game3/公司股價/${droppableElementBrand}')`);

    // 答對的icon去掉touch的觸發
    if(event.type=='touchend'){
      draggableElement.removeAttribute("ontouchstart")
      draggableElement.removeAttribute("ontouchmove")
      draggableElement.removeAttribute("ontouchend")
    }

    playSoundEffect(); // 答對播放音效
    correct++;  // 答對數+1
  }
  // drop錯
  else{
    // 增加一個class='animated'去做shake動畫的css
    $(`span[data-brand = "${droppableElementBrand}"]`).addClass('animated');
    // 並設定1秒後移除該animated class,否則就無法再觸發,因為已經加上animated的class
    setTimeout(() =>{
      $(`span[data-brand = "${droppableElementBrand}"]`).removeClass('animated');
    },1000)
  }
  // 全部答對
  if(correct===Math.min(totalMatchingPairs, totalDraggableItems)) { // Game Over!!
    $('#window').css('background-image','url("./public/game3/素材/popup-true.png")') // 放上恭喜挑戰成功的圖片
    $('#window').css('width','700px') // 客製化答對時的寬度
    $(".modal-footer").css('height','250px') // 客製化時間到時的playaagain的高度
    stop_time = true; // 設定時間到當作遊戲結束(避免倒數計時器一直走)

    // 跳出modal
    $("#myModal").modal({backdrop:'static',keyboard:false}); // 避免點擊外部空白而消失modal(重要!!)
    $('#myModal').modal('show')
  }

  // 重設回原訂位置
  if (moving) {
      // reset our element
      moving.style.left = '';
      moving.style.top = '';
      moving.style.height = '';
      moving.style.width = '';
      moving.style.position = '';

      // moving = null;
      event.preventDefault()
  }

}

// 隨機sample出n個數量的陣列
// Auxiliary functions
function generateRandomItemsArray(n, originalArray) {
  let res = [];
  let clonedArray = [...originalArray]; // ... operator -> 把迭代物件展開
  if(n>clonedArray.length) n=clonedArray.length;
  for(let i=1; i<=n; i++) {
    const randomIndex = Math.floor(Math.random()*clonedArray.length); // 1~n
    res.push(clonedArray[randomIndex]);
    clonedArray.splice(randomIndex, 1); //把cloneArray隨機抽到的index丟進res，接著刪除cloneArray隨機抽到的那個元素
  }
  return res;
}

// 開始頁(page1)按下開始後會跳轉到page2
$('#startImg').on('click',function(){
  $.mobile.changePage('#page2',{allowSamePageTransition:true,transition:"slide"}); // 跳轉頁面
  initiateGame(); // 初始化遊戲
})

// 再挑戰一次的按鈕
$("#playagain").on('click',function () {
  $('#myModal').modal('hide')
  $('#page1').addClass('ui-page-active');
  $.mobile.changePage('#page1',{allowSamePageTransition:true,transition:"slide"}); // 跳轉頁面
  // $('.modal-backdrop').removeClass('modal-backdrop') //移除backdrop的遮罩
});

let moving = null;

// 觸碰板觸碰
function pickup(event) {
  moving = event.target;

  moving.style.height = moving.clientHeight;
  moving.style.width = moving.clientWidth;
  moving.style.position = 'absolute';
}

// 觸碰板移動
function move(event) {
  event.preventDefault()
  if (moving) {
    // touchmove - assuming a single touchpoint
    moving.style.left = event.changedTouches[0].clientX - moving.clientWidth/2 + "px"; // 找出位置
    moving.style.top = event.changedTouches[0].clientY + moving.clientWidth/2 + "px";  // 找出位置
    // drop的物件加上droppable-hover這個class才能觸發hover的動畫
    event.target.style.zIndex = '-10'; // 先藏下去
    var drag_element = document.elementFromPoint(event.changedTouches[0].clientX, event.changedTouches[0].clientY) // elementFromPoint從位置抓元素(每次移動位置最上方的元素)
    event.target.style.zIndex = '1';   // 再浮上來
    $(".droppable-hover").removeClass("droppable-hover")  // 每次移動都把有包含hover這個動畫的元素的class去除
    if(drag_element!=undefined && drag_element.className == "droppable"){
      drag_element.classList.add("droppable-hover");  // 當最上方的元素是droppable的就增加droppable-hover這個class
    }
    event.preventDefault();
  }
}

// 按鈕音效
function playSoundEffect(){
	var playSoundCorrect = new Audio("./public/game3/click.mp3");
	playSoundCorrect.play();
  }
  $(function(){
	// 按下開始按鈕
	$("#startImg").on("click",function(){
		playSoundEffect();
	})
	// // 觸碰icon
	// $(".icon").on("click",function(){
	//   playSoundEffect();
  // })
  // // drop icon
	// $(".icon").on("touchend",function(){
	//   playSoundEffect();
	// })
	// 按下再玩一次的按鈕
	$("#playagain").on("click",function(){
	  playSoundEffect();
	})
  });