// Supabase config
const supabaseUrl = "https://myctcathdbroxzbvjtdg.supabase.co";
const supabaseKey = "sb_secret_BbnW15bg8W8mLUb11SNU4w_dKclOYf_";
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// Simple hardcoded login (change for real production use!)
function adminLogin() {
  const user = document.getElementById('adminUser').value;
  const pass = document.getElementById('adminPass').value;
  const loginBox = document.getElementById('loginBox');
  const adminPanel = document.getElementById('adminPanel');
  const loginMsg = document.getElementById('loginMsg');

  if (user === "admin" && pass === "12345") { // Example credentials
    loginBox.style.display = "none";
    adminPanel.style.display = "block";
    loginMsg.textContent = "";
    fetchFiles(); // Show file list on login
  } else {
    loginMsg.textContent = "Invalid credentials!";
  }
}

function adminLogout() {
  document.getElementById('adminUser').value = "";
  document.getElementById('adminPass').value = "";
  document.getElementById('loginBox').style.display = "block";
  document.getElementById('adminPanel').style.display = "none";
}

async function fetchFiles() {
  const { data, error } = await supabase.storage.from("uploads").list('');
  const fileList = document.getElementById('fileList');
  const search = document.getElementById('search').value.toLowerCase();
  fileList.innerHTML = '';

  if (error) {
    fileList.innerHTML = "<li>Error fetching files!</li>";
    return;
  }
  if (!data || data.length === 0) {
    fileList.innerHTML = "<li>No files found.</li>";
    return;
  }

  data
    .filter(file => file.name.toLowerCase().includes(search))
    .forEach(file => {
      const li = document.createElement('li');
      li.textContent = file.name;
      fileList.appendChild(li);
    });
}

// Optionally: Fetch files while typing in search box
document.getElementById('search').addEventListener('input', fetchFiles);

