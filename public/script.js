const form = document.getElementById('uploadForm');
const msg = document.getElementById('msg');

form.addEventListener('submit', async function(e) {
  e.preventDefault();
  msg.textContent = '';

  const fileInput = document.getElementById('fileInput');
  const file = fileInput.files[0];
  if (!file) {
    msg.textContent = 'Please select a file!';
    return;
  }

  const formData = new FormData();
  formData.append('file', file);

  try {
    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });
    const text = await res.text();
    msg.textContent = text;
  } catch (err) {
    msg.textContent = 'Upload failed!';
  }
});
