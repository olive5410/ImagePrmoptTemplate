import { supabaseAdmin } from '@/lib/supabase/server';

export type GenerationRecord = {
  id: string;
  prompt: string;
  result: any;
  user_id: string;
  created_at: string;
};

export async function getGenerations(userId: string): Promise<GenerationRecord[]> {
  const { data, error } = await supabaseAdmin
    .from('generations')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[Supabase] Failed to fetch generations:', error.message);
    return [];
  }

  return data ?? [];
}

export async function insertGeneration(prompt: string, result: any, userId: string): Promise<GenerationRecord | null> {
  const { data, error } = await supabaseAdmin
    .from('generations')
    .insert([{ prompt, result, user_id: userId }])
    .select()
    .single();

  if (error) {
    console.error('[Supabase] Failed to insert generation:', error.message);
    return null;
  }

  return data;
}

export async function updateGeneration(
  generationId: string,
  newResult: any,
  userId: string
): Promise<GenerationRecord | null> {
  const { data, error } = await supabaseAdmin
    .from('generations')
    .update({ result: newResult })
    .eq('id', generationId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    console.error('[Supabase] Failed to update generation:', error.message);
    return null;
  }

  return data;
}
