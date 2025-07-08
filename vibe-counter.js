const supabaseClient = supabase.createClient(
  'https://nymxmkinvweoxwbkbvjk.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55bXhta2ludndlb3h3YmtidmprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5OTI1MjQsImV4cCI6MjA2NzU2ODUyNH0.35mx5k1lJryn6-Sek-by7sjJ5Joq-8SBUtRvuR24VHI'
);

const button = document.getElementById('vibe-button');
const countDisplay = document.getElementById('vibe-count');

function markVibed() {
  button.textContent = '🤍';
  button.classList.add('vibed');
  button.disabled = true;
  localStorage.setItem('hasVibed', 'true');
}

async function insertRow() {
  if (localStorage.getItem('hasVibed') === 'true') return;

  const { error } = await supabaseClient
    .from('clicks')
    .insert([{}]);

  if (error) {
    console.error('Insert error:', error);
    return;
  }

  markVibed();
  updateCount();
}

async function updateCount() {
  const { count, error } = await supabaseClient
    .from('clicks')
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.error('Count fetch error:', error);
    countDisplay.textContent = 'Error loading count.';
    return;
  }

  countDisplay.textContent = `${count} people have vibed so far.`;
}

button.addEventListener('click', insertRow);

// Initial load
updateCount();

// Restore state if already vibed
if (localStorage.getItem('hasVibed') === 'true') {
  markVibed();
}