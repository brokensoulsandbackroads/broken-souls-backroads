document.getElementById("year").textContent = new Date().getFullYear();

function playSong(videoId, title){
  const player = document.getElementById("music-player");
  const frame = document.getElementById("player-frame");
  const titleBox = document.getElementById("player-title");

  titleBox.textContent = title;

  frame.src = "https://www.youtube.com/embed/" + videoId + "?autoplay=1";

  player.classList.add("open");
}

function closePlayer(){
  const player = document.getElementById("music-player");
  const frame = document.getElementById("player-frame");

  player.classList.remove("open");
  frame.src = "";
}
