// kamera-kanvas.js

const cameras = {
  Nota: { videoEl: 'videoNota', canvasEl: 'canvasNota', previewEl: 'previewNota' },
  Retur: { videoEl: 'videoRetur', canvasEl: 'canvasRetur', previewEl: 'previewRetur' },
  Bukti: { videoEl: 'videoBukti', canvasEl: 'canvasBukti', previewEl: 'previewBukti' },
};

const constraints = {
  audio: false,
  video: {
    facingMode: { ideal: 'environment' }, // kamera belakang
    width: { ideal: 1280 },
    height: { ideal: 720 }
  }
};

async function startCamera(key) {
  const video = document.getElementById(cameras[key].videoEl);
  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    video.srcObject = stream;
    video.play();
  } catch (err) {
    alert('❌ Tidak bisa mengakses kamera: ' + err.message);
  }
}

function stopCamera(key) {
  const video = document.getElementById(cameras[key].videoEl);
  const stream = video.srcObject;
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    video.srcObject = null;
  }
}

function takeSnapshot(key) {
  const video = document.getElementById(cameras[key].videoEl);
  const canvas = document.getElementById(cameras[key].canvasEl);
  const preview = document.getElementById(cameras[key].previewEl);

  // Set ukuran tetap 640x480 (crop tengah dari video)
  const width = 640;
  const height = 480;
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext('2d');
  // Hitung offset untuk crop tengah dari video asli
  const videoRatio = video.videoWidth / video.videoHeight;
  const cropWidth = video.videoHeight * (width / height);
  const cropX = (video.videoWidth - cropWidth) / 2;

  context.drawImage(
    video,
    cropX, 0, cropWidth, video.videoHeight, // sumber (crop tengah)
    0, 0, width, height // target canvas
  );

  const dataURL = canvas.toDataURL('image/jpeg');
  preview.src = dataURL;
  preview.classList.remove('hidden');
  video.classList.add('hidden');

  stopCamera(key);
  window[`foto${key}Base64`] = dataURL.split(',')[1];
}

// Event untuk Retur
const returInput = document.getElementById('retur');
returInput.addEventListener('input', (e) => {
  const val = parseInt(e.target.value);
  const container = document.getElementById('returFotoContainer');
  const video = document.getElementById(cameras['Retur'].videoEl);
  const preview = document.getElementById(cameras['Retur'].previewEl);

  if (val > 0) {
    container.classList.remove('hidden');
    preview.classList.add('hidden');
    video.classList.remove('hidden');
    startCamera('Retur');
  } else {
    container.classList.add('hidden');
    stopCamera('Retur');
  }
});

// Event untuk Bukti Transfer
const pembayaranInput = document.getElementById('pembayaran');
pembayaranInput.addEventListener('change', (e) => {
  const show = e.target.value === 'Ya';
  const container = document.getElementById('buktiTransferContainer');
  const video = document.getElementById(cameras['Bukti'].videoEl);
  const preview = document.getElementById(cameras['Bukti'].previewEl);

  container.classList.toggle('hidden', !show);
  if (show) {
    preview.classList.add('hidden');
    video.classList.remove('hidden');
    startCamera('Bukti');
  } else {
    stopCamera('Bukti');
  }
});

// Kamera pangkalan langsung aktif
window.addEventListener('DOMContentLoaded', () => {
  const video = document.getElementById(cameras['Nota'].videoEl);
  const preview = document.getElementById(cameras['Nota'].previewEl);
  preview.classList.add('hidden');
  video.classList.remove('hidden');
  startCamera('Nota');
});
