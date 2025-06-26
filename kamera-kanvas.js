const cameras = {
  Nota: { videoEl: 'videoNota', canvasEl: 'canvasNota', previewEl: 'previewNota', retakeBtnEl: 'retakeNota' },
  Retur: { videoEl: 'videoRetur', canvasEl: 'canvasRetur', previewEl: 'previewRetur', retakeBtnEl: 'retakeRetur' },
  Bukti: { videoEl: 'videoBukti', canvasEl: 'canvasBukti', previewEl: 'previewBukti', retakeBtnEl: 'retakeBukti' },
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
  const retakeBtn = document.getElementById(cameras[key].retakeBtnEl);

  const context = canvas.getContext('2d');

  // Tentukan ukuran crop yang diinginkan (misal 640x480)
  const cropWidth = 640;
  const cropHeight = 480;

  // Tentukan posisi crop di tengah video asli
  const sx = (video.videoWidth - cropWidth) / 2;
  const sy = (video.videoHeight - cropHeight) / 2;

  canvas.width = cropWidth;
  canvas.height = cropHeight;

  // crop dan draw image dari video ke canvas
  context.drawImage(video, sx, sy, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);

  const dataURL = canvas.toDataURL('image/jpeg');
  preview.src = dataURL;
  preview.classList.remove('hidden');
  video.classList.add('hidden');
  retakeBtn.classList.remove('hidden'); // munculin tombol ambil ulang

  stopCamera(key);

  window[`foto${key}Base64`] = dataURL.split(',')[1];
}


function retakePhoto(key) {
  const video = document.getElementById(cameras[key].videoEl);
  const preview = document.getElementById(cameras[key].previewEl);
  const retakeBtn = document.getElementById(cameras[key].retakeBtnEl);

  preview.classList.add('hidden');
  video.classList.remove('hidden');
  retakeBtn.classList.add('hidden');

  startCamera(key);
}

// Event listener tombol ambil ulang untuk tiap kamera
window.addEventListener('DOMContentLoaded', () => {
  Object.keys(cameras).forEach(key => {
    const btn = document.getElementById(cameras[key].retakeBtnEl);
    if (btn) {
      btn.addEventListener('click', () => retakePhoto(key));
      btn.classList.add('hidden'); // sembunyikan tombol retake awalnya
    }
  });

  // Start kamera Nota saat halaman load
  const video = document.getElementById(cameras['Nota'].videoEl);
  const preview = document.getElementById(cameras['Nota'].previewEl);
  const retakeBtn = document.getElementById(cameras['Nota'].retakeBtnEl);
  preview.classList.add('hidden');
  video.classList.remove('hidden');
  if (retakeBtn) retakeBtn.classList.add('hidden');
  startCamera('Nota');
});
