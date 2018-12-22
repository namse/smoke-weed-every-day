console.log('i am loaded, i am lord. i am tachanka');

const serverUrl = 'http://192.168.0.2:13130';

const socket = io(serverUrl);

const videoElement = document.getElementById('weed-player');
videoElement.crossOrigin = "Anonymous";
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('muted')) {
  videoElement.muted = true;
}
videoElement.load();

let videos = [];
const videoNames = [
  // died
  'wasted',
  'you died',
  'minecraft died',

  // kill
  'gun',
  'bomb',
  'overwatch kill',

  // wow
  'wow',
  'omg wow',
  'Japanese',
];

function fetchVideos() {
  return Promise.all(videoNames.map((name) => {
    const url = encodeURI(`${serverUrl}/weeds/${name}.mp4`);
    return fetch(url)
      .then(response => response.blob())
      .then(blob => URL.createObjectURL(blob))
    }))
    .then((videoBlobUrls) => {
      videos = videoBlobUrls;
    });
}

const fetchVideosPromise = fetchVideos();

function stop() {
  videoElement.pause();
  videoElement.src = '';
  videoElement.load();
}

socket.on('onKey', (number) => {
  if (number === 0)  {
    stop();
    return;
  }
  console.log(`I smoked ${number} times!`);

  fetchVideosPromise.then(() => {
    videoElement.src = videos[number - 1];
    videoElement.play();
  });
});



videoElement.onended = () => {
  stop();
};

