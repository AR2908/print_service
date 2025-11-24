// USERNAME & PASSWORD (change for security, DON'T show real credentials in public code)
const ADMIN_USER = "admin";
const ADMIN_PASS = "1234";

function adminLogin() {
  const user = document.getElementById('adminUser').value;
  const pass = document.getElementById('adminPass').value;
  if (user === ADMIN_USER && pass === ADMIN_PASS) {
    document.getElementById('loginBox').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'block';
  } else {
    document.getElementById('loginMsg').textContent = 'Invalid credentials!';
  }
}

// baaki adminPanel ke code ko window.onload = fetchFiles; ke andar wrap kar do!
window.onload = function() {
  // Automatically hide adminPanel until login successful
  document.getElementById('adminPanel').style.display = 'none';
};

const fileListEl = document.getElementById("fileList");
const searchEl = document.getElementById("search");
const msgEl = document.getElementById("msg");
let fileList = [];

// Fetch file list from API
async function fetchFiles() {
  msgEl.textContent = "Loading...";
  let res = await fetch("/api/listFiles");
  let data = await res.json();
  fileList = data.files || [];
  renderList();
  msgEl.textContent = "";
}

// Render file list with delete buttons & search filter
function renderList() {
  let searchVal = searchEl.value ? searchEl.value.toLowerCase() : "";
  let filtered = fileList.filter(
    f => !searchVal || f.name.toLowerCase().includes(searchVal)
  );
  fileListEl.innerHTML = filtered
    .map(
      (f) => `
    <li>
      ${f.name}
      <button class="delete-btn" onclick="deleteFile('${f.name}')">Delete</button>
    </li>
  `
    )
    .join("");
}

// Delete file function
async function deleteFile(filename) {
  if (!confirm(`Delete ${filename}?`)) return;
  msgEl.textContent = 'Deleting...';
  
  let res = await fetch("/api/deleteFile", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({filename})
  });
  let data = await res.json();
  if (data.success) {
    msgEl.textContent = "Deleted!";
    fileList = fileList.filter(f => f.name !== filename);
    renderList();
  } else {
    msgEl.textContent = "Delete error: " + (data.error || "unknown error");
  }
}

searchEl.oninput = renderList;

window.deleteFile = deleteFile; // for inline HTML button
window.onload = fetchFiles;
