function toggleDetails(button) {
  const details = button.nextElementSibling;
  if (details.classList.contains('visible')) {
    details.classList.remove('visible');
    setTimeout(() => {
      details.style.display = 'none';
    }, 50);
    button.textContent = 'Show more';
  } else {
    details.style.display = 'block';
    setTimeout(() => {
      details.classList.add('visible');
    }, 0);
    button.textContent = 'Show less';
  }
}