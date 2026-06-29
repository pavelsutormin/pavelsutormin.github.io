const codeArea = document.getElementById('code-area');
const generateButton = document.getElementById('generate-button');
const bookmarkletOut = document.getElementById('bookmarklet-out');

generateButton.addEventListener('click', () => {
  let rawCode = codeArea.value.trim();
  if (!rawCode) {
    alert('Please enter some JavaScript code first!');
    return;
  }
  let formattedCode = `(function(){${rawCode}\n})();`;
  let bookmarkletUrl = 'javascript:' + encodeURIComponent(formattedCode);
  bookmarkletOut.href = bookmarkletUrl;
});