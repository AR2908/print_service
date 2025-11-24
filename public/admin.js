const fileList = document.getElementById('fileList');

// In real use, yahan API call hoti e.g. /api/listFiles
fileList.innerHTML = `
  <ul>
    <li><b>Note:</b> Serverless function par local uploads persist nahi karte.<br>
      <i>To see real filenames, use cloud storage (S3 etc.) with listing API!<i>
    </li>
  </ul>
`;
