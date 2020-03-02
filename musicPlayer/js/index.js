
var currentIndex = 0;
var musicList = [];
var audio = new Audio();
var timer;
audio.autoplay = true;

function $(selector) {
  return document.querySelector(selector);
}

 getMusicList(function(list) {
   musicList = list;
  loadMusic(list[currentIndex]); 
  generateList(list);
});

audio.ontimeupdate = function() {
  $('.musicbox .progress-now').style.width = (this.currentTime/this.duration) *100 + '%';
}  //this代表audio；谁绑定事件，this就代表谁。
audio.onplay = function() {
  timer = setInterval(function() {
    var minute = Math.floor(audio.currentTime/60);
    var sec = Math.floor(audio.currentTime%60) + '';
    sec = sec.length === 2? sec : '0' + sec;
    $('.musicbox .time').innerText = minute + ':' + sec;
  },1000);
  $('.musicbox .musicbutton').classList.remove('fa-play');
  $('.musicbox .musicbutton').classList.add('fa-pause');
  $(`.list>li:nth-child(${currentIndex+1})`).classList.add('active');
} 
audio.onpause = function() {
  clearInterval(timer);
}
audio.onended = function() {
  currentIndex = (++currentIndex)%musicList.length;
  loadMusic(musicList[currentIndex]);
  $(`.list>li:nth-child(${currentIndex})`).classList.remove('active');
 }


$('.musicbox .play').onclick = function() {
  if(audio.paused){
    audio.play();
    this.querySelector('.fa').classList.remove('fa-play');
    this.querySelector('.fa').classList.add('fa-pause');
  }else{
    audio.pause();
    this.querySelector('.fa').classList.remove('fa-pause');
    this.querySelector('.fa').classList.add('fa-play');
  }
}

$('.musicbox .forward').onclick = function() {
  $(`.list>li:nth-child(${currentIndex+1})`).classList.remove('active');
  currentIndex = (++currentIndex)%musicList.length;
  loadMusic(musicList[currentIndex]);
 }
$('.musicbox .back').onclick = function() {
  $(`.list>li:nth-child(${currentIndex+1})`).classList.remove('active'); 
  currentIndex =(musicList.length + (--currentIndex))%musicList.length;
  loadMusic(musicList[currentIndex]);
}

$('.musicbox .bar').onclick = function(e) {
  var percent = e.offsetX / parseInt(getComputedStyle(this).width);
  audio.currentTime = audio.duration * percent;
}


function getMusicList(callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET','/music.json',true);
 xhr.onload = function() {
    if((xhr.status >=200 && xhr.status < 300) || xhr.status ===300) {
      callback(JSON.parse(this.responseText));
    }else{
      console.log('获取数据失败');
    }
  }
  xhronerror = function() {
    console.log('网络异常')
  } 
  xhr.send();
}

function loadMusic(musicObj) {
  console.log('behin play', musicObj)
  $('.musicbox .title').innerText = musicObj.title;
  $('.musicbox .auther').innerText = musicObj.auther;
  $('.cover').style.backgroundImage = 'url(' + musicObj.img + ')';
  audio.src = musicObj.src;
} 

function generateList(list) {
  var num = list.length;
  var html = '';
  for(var i = 0;i<num;i++){
    html +='<li>'+ list[i].title + '-' + list[i].auther + '</li>'; 
  }
    $('.list').innerHTML = html; 
    $('.list').onclick = function(e) {
     var  arr=[];
      for(var i in e.target){
          arr.push(e.target[i]);
      }
      var str = '' ;
      str = arr[20];
      str = str.substr(0,str.search('-'));
      var arr1 = [];
      arr1.push(musicList);
      var arr2 = arr1[0];
      for(var j = 0;j<list.length;j++){
        if(str === arr2[j].title) {
          $(`.list>li:nth-child(${currentIndex+1})`).classList.remove('active');
          currentIndex = j;
          loadMusic(arr2[j]);
          } 
      }
      }
    }
