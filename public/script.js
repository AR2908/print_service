// --- Supabase Config ---
const supabaseUrl = "https://myctcathdbroxzbvjtdg.supabase.co";
const supabaseKey = "sb_secret_BbnW15bg8W8mLUb11SNU4w_dKclOYf_";
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

const form = document.getElementById('uploadForm');
const msg = document.getElementById('msg');
const fileInput = document.getElementById('fileInput');
const progressBar = document.getElementById('progressBar');
const progressContainer = document.getElementById('progressContainer');

const MAX_SIZE_MB = 50;
const MAX_SIZE = MAX_SIZE_MB * 1024 * 1024;

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

  for(let i = 0; i < files.length; i++) {
    if (files[i].size > MAX_SIZE) {
      msg.textContent = `${files[i].name} is too large (max ${MAX_SIZE_MB} MB allowed)`;
      return;
    }
  }

  let allUploaded = [];

  for (let i = 0; i < files.length; i++) {
    progressContainer.style.display = 'block';
    progressBar.style.width = '0%';

    // Timestamped filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const newFilename = `${timestamp}_${files[i].name}`;

    // Supabase direct client-side upload with progress
    const { data, error } = await supabase.storage
      .from('uploads')
      .upload(newFilename, files[i], {
        cacheControl: '3600',
        upsert: false
      });

    // No native progress in Supabase client yet, so show instantly to 100%
    progressBar.style.width = '100%';

    if (error) {
      msg.textContent = `Upload error: ${error.message || files[i].name}`;
    } else {
      allUploaded.push(files[i].name);
    }
  }

  progressContainer.style.display = 'none';
  if (allUploaded.length === files.length) {
    msg.textContent = `Uploaded successfully: ${allUploaded.join(', ')}`;
  }
  form.reset();
});
