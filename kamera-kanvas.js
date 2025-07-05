const cameras = {
  Nota: { videoEl: 'videoNota', canvasEl: 'canvasNota', previewEl: 'previewNota' },
  Retur: { videoEl: 'videoRetur', canvasEl: 'canvasRetur', previewEl: 'previewRetur' },
  Bukti: { videoEl: 'videoBukti', canvasEl: 'canvasBukti', previewEl: 'previewBukti' },
};

const constraints = {
  audio: false,
  video: {
    facingMode: { ideal: 'environment' },
    width: { ideal: 1280 },
    height: { ideal: 1024 }
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

  const outputWidth = 1280;
  const outputHeight = 1024;
  canvas.width = outputWidth;
  canvas.height = outputHeight;

  const ctx = canvas.getContext('2d');

  const videoWidth = video.videoWidth;
  const videoHeight = video.videoHeight;
  const videoRatio = videoWidth / videoHeight;
  const outputRatio = outputWidth / outputHeight;

  let sx, sy, sWidth, sHeight;

  if (videoRatio > outputRatio) {
    sHeight = videoHeight;
    sWidth = sHeight * outputRatio;
    sx = (videoWidth - sWidth) / 2;
    sy = 0;
  } else {
    sWidth = videoWidth;
    sHeight = sWidth / outputRatio;
    sx = 0;
    sy = (videoHeight - sHeight) / 2;
  }

  ctx.drawImage(video, sx, sy, sWidth, sHeight, 0, 0, outputWidth, outputHeight);

  const dataURL = canvas.toDataURL('image/jpeg');
  preview.src = dataURL;
  preview.classList.remove('hidden');
  video.classList.add('hidden');

  stopCamera(key);
  window[`foto${key}Base64`] = dataURL.split(',')[1];

  addRemoveButton(preview, key);
  const takeBtn = document.getElementById(`ambil${key}`);
  if (takeBtn) takeBtn.classList.add('hidden');
}

function addRemoveButton(previewEl, key) {
  removeExistingRemoveButton(previewEl);

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.innerHTML = '❌';
  btn.className = 'remove-btn';

  btn.onclick = (e) => {
    e.preventDefault();

    previewEl.src = '';
    previewEl.classList.add('hidden');

    const video = document.getElementById(cameras[key].videoEl);
    video.classList.remove('hidden');
    startCamera(key);

    const takeBtn = document.getElementById(`ambil${key}`);
    if (takeBtn) takeBtn.classList.remove('hidden');

    delete window[`foto${key}Base64`];

    btn.remove();
  };

  previewEl.parentElement.style.position = 'relative';
  previewEl.parentElement.appendChild(btn);
}

function removeExistingRemoveButton(previewEl) {
  const existing = previewEl.parentElement.querySelector('.remove-btn');
  if (existing) existing.remove();
}

// Event khusus untuk Retur
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

// Kamera Pangkalan langsung aktif saat halaman dimuat
window.addEventListener('DOMContentLoaded', () => {
  const video = document.getElementById(cameras['Nota'].videoEl);
  const preview = document.getElementById(cameras['Nota'].previewEl);
  preview.classList.add('hidden');
  video.classList.remove('hidden');
  startCamera('Nota');

  ['Nota', 'Retur', 'Bukti'].forEach(k => {
    const btn = document.getElementById(`ambil${k}`);
    if (!btn) console.warn(`Tombol ambil${k} tidak ditemukan di HTML`);
  });
});
