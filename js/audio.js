var player = document.getElementById("musicPlayer");
var currentVolume = 0.5; // 預設音量
var musicList = ["airball.mp3","elysees.mp3","moon.mp3","nothing.mp3","rain.mp3","travel.mp3"]; // 音樂列表
var musicIndex = 0; // 當前音樂索引
var musicSpeed = false; // 音樂速度
var loopType = "none"; // 循環播放類型
var endMusic = false; // 音樂結束標誌
var playing = false; // 音樂播放狀態
var info = document.getElementById("infoPanel").firstElementChild; // 播放狀態顯示

document.addEventListener("DOMContentLoaded", function () {
    initEventListeners(); // 初始化事件監聽器

});
function playMusic(event){
    if (!playing && !endMusic) { // 如果音樂暫停且沒有結束
        player.play(); // 播放音樂
        event.target.innerHTML = ";"; // 更新按鈕文字
    } else {
        player.pause(); // 暫停音樂
        event.target.innerHTML = "4"; // 更新按鈕文字
    }
    playing = !playing; // 切換播放狀態
    info.className = playing ? "" : "hidden"; // 更新播放狀態顯示
}
function stopMusic(event) {
    player.currentTime = 0; // 重置播放時間到開頭
    if(playing || endMusic){ // 如果音樂正在播放或結束
        event.target.previousElementSibling.click(); // 觸發播放按鈕的點擊事件
    }
    endMusic = false; // 重置音樂結束標誌
    fillRangeColor(document.getElementById("bar_currentTime"), 0); // 更新進度條顏色
}

function setVolume(event) {
    player.volume = event.target.value; // 設定音量
    event.target.nextElementSibling.innerHTML = Math.round(event.target.value * 100); // 更新音量顯示
    currentVolume = event.target.value; // 儲存當前音量
    if(player.muted){
        document.getElementById("btn_mute").click(); // 取消靜音)
    } else {
        fillRangeColor(event.target, event.target.value * 100); // 更新進度條顏色
    }
}

function muteMusic(event) {
    var bar_volume = document.getElementById("bar_volume");
    if (player.muted) {
        player.muted = false; // 取消靜音
        event.target.innerHTML = "V";
        bar_volume.value = currentVolume; // 恢復音量
    } else {
        player.muted = true; // 開啟靜音
        event.target.innerHTML = "U";
        currentVolume = document.getElementById("bar_volume").value; // 儲存當前音量
        bar_volume.value = 0; // 設定音量為0
    }
    fillRangeColor(bar_volume, bar_volume.value * 100); // 更新音量進度條顏色
}

function setMusicList() {
    var selectMusic = document.getElementById("selectMusic");

    for (var i = 0; i < musicList.length; i++) {
        var option = document.createElement("option");
        option.value = i;
        option.textContent = "歌曲 " + (i + 1) + ": " + musicList[i]; // 顯示的文字
        selectMusic.appendChild(option);
    }
    player.src = "music\\" + musicList[0]; // 設定音樂檔案的路徑
}

function setMaxTime() {
    var bar_currentTime = document.getElementById("bar_currentTime");
    bar_currentTime.max = player.duration; // 設定進度條的最大值為音樂的總長度
    updateTimeLabel(bar_currentTime); // 更新當前時間顯示
    //歌曲載入完成檢查是否需要繼續撥放
    if(playing){
        player.play(); // 播放音樂
    }
}
function setCurrentTime(event) {
    player.currentTime = event.target.value; // 設定音樂的當前播放時間為進度條的當前值
    //updateTimeLabel(event.target); // 更新當前時間顯示 (指令重複 已由updateCurrentTime函數處理)
}
function increaseTime(num,event) {
    if(player.currentTime + num > player.duration){ // 如果增加的時間超過音樂的總長度
        player.currentTime = player.duration; // 設定當前播放時間為音樂的總長度
    }else {
    player.currentTime += num; // 增加音樂的當前播放時間
    }   
    event.target.parentNode.firstElementChild.value = player.currentTime; // 更新進度條的當前值
}

function updateCurrentTime() {
    var bar_currentTime = document.getElementById("bar_currentTime");
    bar_currentTime.value = player.currentTime; // 更新進度條的當前值為音樂的當前播放時間
    updateTimeLabel(bar_currentTime); // 更新當前時間顯示
    fillRangeColor(bar_currentTime, (player.currentTime / player.duration) * 100); // 更新進度條顏色
}

// 更新當前時間顯示的函數
function updateTimeLabel(labelTime) {
    labelTime.nextElementSibling.innerHTML = convertTime(player.currentTime) + " / " + convertTime(player.duration); // 更新當前時間顯示
}
// 將時間轉換為分鐘和秒的函數
function convertTime(number) {
    var minutes = Math.floor(number / 60); // 計算分鐘數
    var seconds = Math.floor(number % 60); // 計算秒數
    return (minutes < 10 ? "0" : "") + minutes + ":" + (seconds < 10 ? "0" : "") + seconds; // 返回格式化的時間字串
}
function fillRangeColor(range, percent) {
    // 計算進度條的顏色採取三重漸層
    var color = "linear-gradient(to right, rgb(0,150,0) 1%,rgb(150,150,0),rgb(255, 255, 255) " + percent + "%)"; // 設定顏色
    range.style.backgroundImage = color; // 更新進度條顏色
}

function changeMusic(event,i){
    if(event.target.id === "selectMusic"){
        musicIndex = parseInt(this.value); // 更新音樂索引
        changeMusicByNumber(0); // 直接播放選擇的音樂
    }else if(event.target.id === "btn_NextMusic"){
        changeMusicByNumber(1); // 播放下一首音樂
    }else if(event.target.id === "btn_PreMusic"){
        changeMusicByNumber(-1); // 播放上一首音樂
    }



}

function changeMusicByNumber(i) {

    musicIndex = (musicIndex + i +musicList.length) % musicList.length; // 更新音樂索引
    document.getElementById("selectMusic").value = musicIndex; // 更新下拉選單的值

    player.src = "music\\" + musicList[musicIndex]; // 設定音樂檔案的路徑    
    if(!playing){ // 如果音樂沒有播放
        document.getElementById("btn_stopMusic").click(); // 停止音樂 
    }
    info.innerHTML = musicList[musicIndex] + " 播放中"; // 更新播放狀態顯示
}

function increaseSpeed(event) {
    if (musicSpeed) {
        player.playbackRate = 1; // 恢復正常速度
        musicSpeed = false; // 設定為正常速度
        event.target.className = ""; // 更新按鈕樣式
    } else {
        player.playbackRate = 2; // 設定為兩倍速度
        musicSpeed = true; // 設定為加速播放
        event.target.className = "selected"; // 更新按鈕樣式
    }
}

function changeLoop(event) {
    loopType = event.target.checked ? event.target.nextElementSibling.value : "none"; // 更新循環播放類型
    event.target.nextElementSibling.disabled = !event.target.checked; // 啟用或禁用循環播放選項

}
function changeLoopType(event) {
    loopType = event.target.value; // 更新循環播放類型
}

function changeLoopMusic() {
    if (loopType === "none"){
        endMusic = true; // 設定音樂結束標誌為true
        document.getElementById("btn_stopMusic").click(); // 停止音樂   
        return;
    } // 如果沒有選擇循環播放則不執行任何操作

    if(loopType === "one"){
        player.currentTime = 0; // 重置播放時間到開頭
    }else if(loopType === "all"){
        changeMusicByNumber(1); // 播放下一首音樂
    }else if(loopType === "random"){
        changeMusicByNumber(Math.floor(Math.random() * musicList.length)); // 隨機播放音樂
    }
    player.play(); // 播放音樂
}

function initEventListeners(){
    // 設定事件監聽器當controller中的按鈕被點擊時觸發對應的函數
    document.getElementById("controller").addEventListener("click", function (event) {
    switch (event.target.id) {
        case "btn_playMusic":
            playMusic(event);
            break;
        case "btn_stopMusic":
            stopMusic(event);
            break;
        case "btn_mute":
            muteMusic(event);
            break;
        case "btn_NextMusic":
        case "btn_PreMusic":
            changeMusic(event);
            break;
        case "btn_IncreaseSpeed":
            increaseSpeed(event); // 增加播放速度
            break;
        default:
            break;
    }
});
document.getElementById("selectMusic").addEventListener("change",changeMusic);// 當選擇歌曲改變時更新音樂檔案的路徑
document.getElementById("bar_currentTime").addEventListener("input", setCurrentTime); // 當進度條改變時更新音樂的當前播放時間
document.getElementById("bar_volume").addEventListener("input", setVolume); // 當音量改變時更新音量
document.getElementById("btn_LoopMusic").addEventListener("change", changeLoop); // 當循環播放選項改變時更新音樂循環播放
document.getElementById("selectLoopType").addEventListener("change", changeLoopType); // 當循環播放類型改變時更新音樂循環播放類型

player.addEventListener("loadedmetadata", setMaxTime); // 當音樂檔案加載完成後設定最大值及更新當前時間顯示並決定是否撥放
player.addEventListener("timeupdate", updateCurrentTime); // 當音樂播放時更新進度條
player.addEventListener("ended", changeLoopMusic); // 當音樂結束時根據循環播放類型更新音樂
setMusicList(); // 設定音樂列表
fillRangeColor(document.getElementById("bar_volume"), currentVolume*100); // 更新進度條顏色
info.innerHTML = musicList[musicIndex] + " 播放中"; // 播放狀態和歌曲名稱顯示

//利用增加類別修改css樣式使ScrollBar在按下時改變顏色
document.querySelectorAll("input[type='range']").forEach(function (range) {
    range.addEventListener("mousedown",function () {
        range.classList.add("active"); // 當按下進度條時添加樣式
    })
    range.addEventListener("mouseup",function () {
        range.classList.remove("active"); // 當放開進度條時移除樣式
    });
})
}
