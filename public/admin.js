// ====== Admin Login Logic (with Remember Session) ======
const ADMIN_USER = "admin";
const ADMIN_PASS = "12345";

function adminLogin() {
  const user = document.getElementById('adminUser').value;
  const pass = document.getElementById('adminPass').value;
  if (user === ADMIN_USER && pass === ADMIN_PASS) {
    document.getElementById('loginBox').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'block';
    localStorage.setItem("adminLoggedIn", "true");
    fetchFiles(); // login ke turant baad files laao
  } else {
    document.getElementById('loginMsg').textContent = 'Invalid credentials!';
  }
}

function adminLogout() {
  localStorage.removeItem("adminLoggedIn");
  document.getElementById('adminPanel').style.display = 'none';
  document.getElementById('loginBox').style.display = 'block';
}

// ====== File Management Logic ======
const fileListEl = document.getElementById("fileList");
const searchEl = document.getElementById("search");
const msgEl = document.getElementById("msg");
let fileList = [];

// Apna Supabase URL YAHAN daalein:
function getSupabaseUrl(filename) {
  const base = "https://myctcathdbroxzbvjtdg.supabase.co"; // <-- YAHAN apna Supabase project URL
  return `${base}/storage/v1/object/public/uploads/${encodeURIComponent(filename)}`;
}

// Api se file list fetch karo
async function fetchFiles() {
  msgEl.textContent = "Loading...";
  try {
    let res = await fetch("/api/listFiles");
    let data = await res.json();
    fileList = data.files || [];
    renderList();
    msgEl.textContent = "";
  } catch (err) {
    msgEl.textContent = "Failed to load file list!";
  }
}

// Render file list with Open, Print, Delete, Search
function renderList() {
  let searchVal = searchEl.value ? searchEl.value.toLowerCase() : "";
  let filtered = fileList
    .filter(f => !searchVal || f.name.toLowerCase().includes(searchVal))
    .slice()    // Safe shallow copy
    .reverse(); // Latest file sabse pehle

  fileListEl.innerHTML = filtered
    .map(
      (f) => `
    <li>
      <a href="${getSupabaseUrl(f.name)}" class="open-btn" target="_blank">Open</a>
      ${f.name}
      <button class="print-btn" onclick="printFile('${f.name}')">Print</button>
      <button class="delete-btn" onclick="deleteFile('${f.name}')">Delete</button>
    </li>
  `
    )
    .join("");
}

// Delete functionality
async function deleteFile(filename) {
  if (!confirm(`Delete ${filename}?`)) return;
  msgEl.textContent = 'Deleting...';
  try {
    let res = await fetch("/api/deleteFile", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ filename })
    });
    let data = await res.json();
    if (data.success) {
      msgEl.textContent = "Deleted!";
      fileList = fileList.filter(f => f.name !== filename);
      renderList();
    } else {
      msgEl.textContent = "Delete error: " + (data.error || "unknown error");
    }
  } catch (err) {
    msgEl.textContent = "Delete error: Something went wrong!";
  }
}

// Print — only that file
window.printFile = function(filename) {
  const url = getSupabaseUrl(filename);
  const printWindow = window.open(url, '_blank');
  printWindow.onload = function() {
    printWindow.print();
  };
};

// Search/filter
searchEl.oninput = renderList;

// Put delete in window for button
window.deleteFile = deleteFile;

// ====== Page Load: Show right panel based on login status ======
window.onload = function() {
  if (localStorage.getItem("adminLoggedIn") === "true") {
    document.getElementById('loginBox').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'block';
    fetchFiles();
  } else {
    document.getElementById('loginBox').style.display = 'block';
    document.getElementById('adminPanel').style.display = 'none';
  }
};
