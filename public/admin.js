const supabaseUrl = "https://myctcathdbroxzbvjtdg.supabase.co";
const supabaseKey = "sb_secret_BbnW15bg8W8mLUb11SNU4w_dKclOYf_";
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// Simple login (change credentials for production!)
function adminLogin() {
  const user = document.getElementById('adminUser').value;
  const pass = document.getElementById('adminPass').value;
  const loginMsg = document.getElementById('loginMsg');
  if (user === "admin" && pass === "admin123") {
    document.getElementById('loginBox').style.display = "none";
    document.getElementById('adminPanel').style.display = "block";
    loginMsg.textContent = "";
    fetchFiles();
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

// Fetch and list files date-wise desc order
async function fetchFiles() {
  const { data, error } = await supabase.storage.from("uploads").list('');
  const fileTableBody = document.querySelector('#fileTable tbody');
  const search = document.getElementById('search').value.toLowerCase();
  fileTableBody.innerHTML = "";

  if (error) {
    fileTableBody.innerHTML = "<tr><td colspan='2'>Error fetching files!</td></tr>";
    return;
  }
  if (!data || data.length === 0) {
    fileTableBody.innerHTML = "<tr><td colspan='2'>No files found.</td></tr>";
    return;
  }

  data
    .filter(file => file.name.toLowerCase().includes(search))
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) // Descending order
    .forEach(file => {
      const fileDate = file.created_at 
        ? new Date(file.created_at).toLocaleString()
        : "N/A";
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${file.name}</td><td>${fileDate}</td>`;
      fileTableBody.appendChild(tr);
    });
}

// Fetch on typing/search
document.getElementById('search').addEventListener('input', fetchFiles);
