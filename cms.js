const REPO = 'jayc8586/JanakCMS';
const FILE_PATH = 'content.json';

window.onload = () => {
  const token = localStorage.getItem('gh_token');

  document.getElementById('saveTokenBtn').onclick = () => {
    const input = document.getElementById('tokenInput').value.trim();
    if (!input) return alert('Please enter your GitHub token.');
    localStorage.setItem('gh_token', input);
    location.reload();
  };

  if (!token) return;

  document.getElementById('auth').style.display = 'none';
  document.getElementById('editor').style.display = 'block';

  // Load JSON content from GitHub
  fetch(`https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`, {
    headers: { Authorization: `token ${token}` }
  })
    .then(res => res.json())
    .then(data => {
      const content = atob(data.content);
      document.getElementById('content').value = content;
      document.getElementById('save').onclick = () => {
        const newContent = document.getElementById('content').value;
        const encoded = btoa(unescape(encodeURIComponent(newContent)));

        fetch(`https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`, {
          method: 'PUT',
          headers: {
            Authorization: `token ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message: 'Update content.json',
            content: encoded,
            sha: data.sha
          })
        })
          .then(res => res.ok ? alert('✅ Saved!') : alert('❌ Error saving.'))
      };
    })
    .catch(err => {
      alert('Failed to load content.json. Does it exist in your repo?');
      console.error(err);
    });
};
