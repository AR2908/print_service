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
document.getElementById('fileInput').addEventListener('change', function(e){
  const file = e.target.files[0];
  const msg = document.getElementById('msg');
  if (file && file.type === 'application/pdf') {
    // PDF file => show page count
    const fileReader = new FileReader();
    fileReader.onload = async function (ev) {
      const typedArray = new Uint8Array(ev.target.result);
      try {
        const pdf = await pdfjsLib.getDocument(typedArray).promise;
        msg.textContent = `This PDF has ${pdf.numPages} pages.`;
      } catch (err) {
        msg.textContent = 'Unable to read PDF pages.';
      }
    };
    fileReader.readAsArrayBuffer(file);
  } else {
    msg.textContent = "";
  }
});


