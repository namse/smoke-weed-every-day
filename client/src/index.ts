import io from 'socket.io-client';

console.log('i am loaded, i am lord. i am tachanka');

const serverUrl = 'http://192.168.0.2:13130';

const socket = io(serverUrl);
window.onerror = (message, file, line, col, error) => {
  socket.emit('log', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
};

socket.on('refresh', () => {
  location.reload();
});

const videoElement = document.getElementById('weed-player') as HTMLVideoElement;
videoElement.crossOrigin = "Anonymous";
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('muted')) {
  videoElement.muted = true;
}
videoElement.load();

interface IVideoInfo {
  filename: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface IVideo extends IVideoInfo{
  objectUrl: string;
};

let videos: IVideo[] = null;

async function init() {
  const videoInfos = await fetchVideoInfos();

  videos = await Promise.all(videoInfos.map(async info => {
    const objectUrl = await fetchVideo(info.filename);
    return {
      ...info,
      objectUrl,
    };
  }));
}

const initPromise = init();

async function fetchVideoInfos(): Promise<IVideoInfo[]> {
  const response = await fetch(`${serverUrl}/weeds/weeds.json`);
  return await response.json();
}

async function fetchVideo(filename) {
  const url = encodeURI(`${serverUrl}/weeds/${filename}`);
  const response = await  fetch(url)
  const blob = await response.blob();
  return URL.createObjectURL(blob)
}

function stop() {
  videoElement.pause();
  videoElement.src = '';
  videoElement.load();
}

async function play(video: IVideo) {
  await initPromise;

  videoElement.width = video.width;
  videoElement.height = video.height;
  videoElement.style.left = `${video.x}px`;
  videoElement.style.top = `${video.y}px`;
  videoElement.src = video.objectUrl;
  videoElement.play();
}

socket.on('onKey', async (number) => {
  if (number === 0)  {
    stop();
    return;
  }
  console.log(`I smoked ${number} times!`);

  await play(videos[number - 1]);
});

videoElement.onended = () => {
  stop();
};
