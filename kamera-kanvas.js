// kamera-kanvas.js

const cameras = {
  Nota: { videoEl: 'videoNota', canvasEl: 'canvasNota', previewEl: 'previewNota' },
  Retur: { videoEl: 'videoRetur', canvasEl: 'canvasRetur', previewEl: 'previewRetur' },
  Bukti: { videoEl: 'videoBukti', canvasEl: 'canvasBukti', previewEl: 'previewBukti' },
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

function takeSnapshot(key) {
  const video = document.getElementById(cameras[key].videoEl);
  const canvas = document.getElementById(cameras[key].canvasEl);
  const preview = document.getElementById(cameras[key].previewEl);

  const context = canvas.getContext('2d');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  const dataURL = canvas.toDataURL('image/jpeg');
  preview.src = dataURL;
  preview.classList.remove('hidden');

  // simpan data ke global (untuk dikirim ke API nanti)
  window[`foto${key}Base64`] = dataURL.split(',')[1];
}

// Retur aktif jika input > 0
document.getElementById('retur').addEventListener('input', (e) => {
  const val = parseInt(e.target.value);
  const container = document.getElementById('returFotoContainer');
  container.classList.toggle('hidden', !val);
  if (val) startCamera('Retur');
});

// Bukti Transfer aktif jika Ya
document.getElementById('pembayaran').addEventListener('change', (e) => {
  const container = document.getElementById('buktiTransferContainer');
  const show = e.target.value === 'Ya';
  container.classList.toggle('hidden', !show);
  if (show) startCamera('Bukti');
});

// Kamera utama pangkalan langsung aktif saat load
startCamera('Nota');
