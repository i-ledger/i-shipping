// kamera-kanvas.js

const cameras = {
  Nota: { videoEl: 'videoNota', canvasEl: 'canvasNota', previewEl: 'previewNota', retryBtn: 'retryNota' },
  Retur: { videoEl: 'videoRetur', canvasEl: 'canvasRetur', previewEl: 'previewRetur', retryBtn: 'retryRetur' },
  Bukti: { videoEl: 'videoBukti', canvasEl: 'canvasBukti', previewEl: 'previewBukti', retryBtn: 'retryBukti' },
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

// Retur aktif jika input > 0
const returInput = document.getElementById('retur');
returInput.addEventListener('input', (e) => {
  const val = parseInt(e.target.value);
  const container = document.getElementById('returFotoContainer');
  const video = document.getElementById(cameras['Retur'].videoEl);
  const preview = document.getElementById(cameras['Retur'].previewEl);
  const retryBtn = document.getElementById(cameras['Retur'].retryBtn);
  container.classList.toggle('hidden', !val);
  if (val) {
    preview.classList.add('hidden');
    retryBtn.classList.add('hidden');
    video.classList.remove('hidden');
    startCamera('Retur');
  } else {
    stopCamera('Retur');
  }
});

// Bukti Transfer aktif jika Ya
const pembayaranInput = document.getElementById('pembayaran');
pembayaranInput.addEventListener('change', (e) => {
  const show = e.target.value === 'Ya';
  const container = document.getElementById('buktiTransferContainer');
  const video = document.getElementById(cameras['Bukti'].videoEl);
  const preview = document.getElementById(cameras['Bukti'].previewEl);
  const retryBtn = document.getElementById(cameras['Bukti'].retryBtn);
  container.classList.toggle('hidden', !show);
  if (show) {
    preview.classList.add('hidden');
    retryBtn.classList.add('hidden');
    video.classList.remove('hidden');
    startCamera('Bukti');
  } else {
    stopCamera('Bukti');
  }
});

// Kamera utama pangkalan langsung aktif saat load
window.addEventListener('DOMContentLoaded', () => {
  const video = document.getElementById(cameras['Nota'].videoEl);
  const preview = document.getElementById(cameras['Nota'].previewEl);
  const retryBtn = document.getElementById(cameras['Nota'].retryBtn);
  preview.classList.add('hidden');
  retryBtn.classList.add('hidden');
  video.classList.remove('hidden');
  startCamera('Nota');
});
