const cameras = {
  Nota: { videoEl: 'videoNota', canvasEl: 'canvasNota', previewEl: 'previewNota', retryBtn: 'retryNota', container: 'notaKameraContainer' },
  Retur: { videoEl: 'videoRetur', canvasEl: 'canvasRetur', previewEl: 'previewRetur', retryBtn: 'retryRetur', container: 'returFotoContainer' },
  Bukti: { videoEl: 'videoBukti', canvasEl: 'canvasBukti', previewEl: 'previewBukti', retryBtn: 'retryBukti', container: 'buktiTransferContainer' },
};

const constraints = {
  audio: false,
  video: {
    facingMode: { exact: 'environment' },
    width: { ideal: 1280 },
    height: { ideal: 720 }
  }
};

async function startCamera(key) {
  const video = document.getElementById(cameras[key].videoEl);
  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    video.srcObject = stream;
  } catch (err) {
    alert('Tidak bisa mengakses kamera: ' + err.message);
  }
}

function stopCamera(key) {
  const video = document.getElementById(cameras[key].videoEl);
  const stream = video.srcObject;
  if (stream) {
    const tracks = stream.getTracks();
    tracks.forEach(track => track.stop());
    video.srcObject = null;
  }
}

function takeSnapshot(key) {
  const video = document.getElementById(cameras[key].videoEl);
  const canvas = document.getElementById(cameras[key].canvasEl);
  const preview = document.getElementById(cameras[key].previewEl);
  const retryBtn = document.getElementById(cameras[key].retryBtn);

  const context = canvas.getContext('2d');
  canvas.width = 1280;
  canvas.height = 720;
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  const dataURL = canvas.toDataURL('image/jpeg');
  preview.src = dataURL;
  preview.classList.remove('hidden');
  video.classList.add('hidden');
  retryBtn.classList.remove('hidden');

  stopCamera(key);
  window[`foto${key}Base64`] = dataURL.split(',')[1];
}

function retrySnapshot(key) {
  const video = document.getElementById(cameras[key].videoEl);
  const preview = document.getElementById(cameras[key].previewEl);
  const retryBtn = document.getElementById(cameras[key].retryBtn);

  preview.classList.add('hidden');
  retryBtn.classList.add('hidden');
  video.classList.remove('hidden');
  startCamera(key);
}

function toggleCameraSection(key, show) {
  const container = document.getElementById(cameras[key].container);
  const video = document.getElementById(cameras[key].videoEl);
  const preview = document.getElementById(cameras[key].previewEl);
  const retryBtn = document.getElementById(cameras[key].retryBtn);
  container.classList.toggle('hidden', !show);
  if (show) {
    preview.classList.add('hidden');
    retryBtn.classList.add('hidden');
    video.classList.remove('hidden');
    startCamera(key);
  } else {
    stopCamera(key);
  }
}

const returInput = document.getElementById('retur');
returInput.addEventListener('input', (e) => {
  const val = parseInt(e.target.value);
  toggleCameraSection('Retur', val > 0);
});

const pembayaranInput = document.getElementById('pembayaran');
pembayaranInput.addEventListener('change', (e) => {
  const show = e.target.value === 'Ya';
  toggleCameraSection('Bukti', show);
});

window.addEventListener('DOMContentLoaded', () => {
  toggleCameraSection('Nota', true);
});
