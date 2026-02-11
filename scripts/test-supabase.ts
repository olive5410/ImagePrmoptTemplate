import { createClient } from '@supabase/supabase-js';

async function main() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  const supabase = createClient(url, key, {
    auth: { persistSession: false },
  });

  const { data, error } = await supabase
    .from('generations')
    .select('*')
    .limit(1);

  if (error) {
    console.error('[Supabase Test] Query failed:', error.message);
    process.exit(1);
  }

  console.log('[Supabase Test] Success, sample row:', data);
}

main();
