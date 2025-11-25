const form = document.getElementById('uploadForm');
const msg = document.getElementById('msg');
const fileInput = document.getElementById('fileInput');
const progressBar = document.getElementById('progressBar');
const progressContainer = document.querySelector('.progress-bar-container');

form.addEventListener('submit', async function(e) {
  e.preventDefault();
  msg.textContent = '';
  progressContainer.style.display = 'none';
  progressBar.style.width = '0%';

  const files = fileInput.files;
  if (!files || files.length === 0) {
    msg.textContent = 'Please select at least one file!';
    return;
  }

  let allUploaded = [];
  for(let i=0; i<files.length; i++) {
    progressContainer.style.display = 'block';
    progressBar.style.width = '0%';

    const formData = new FormData();
    formData.append('file', files[i]);

    await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/api/upload', true);

      xhr.upload.onprogress = function(event) {
        if (event.lengthComputable) {
          let percent = (event.loaded / event.total) * 100;
          progressBar.style.width = percent.toFixed(1) + '%';
        }
      };

      xhr.onload = function() {
        if (xhr.status == 200) {
          allUploaded.push(files[i].name);
          progressBar.style.width = '100%';
          resolve(true);
        } else {
          msg.textContent = `Failed to upload ${files[i].name}`;
          progressBar.style.width = '0%';
          reject();
        }
      };

      xhr.onerror = function() {
        msg.textContent = `Failed to upload ${files[i].name} (network error)`;
        progressBar.style.width = '0%';
        reject();
      };

      xhr.send(formData);
    });
  }

  progressContainer.style.display = 'none';
  if(allUploaded.length === files.length) {
    msg.textContent = `Uploaded successfully: ${allUploaded.join(', ')}`;
  }
  form.reset();
});
