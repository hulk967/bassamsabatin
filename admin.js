async function loadSettings(){
  const { data, error } = await supabase
    .from('site_settings')
    .select('content')
    .eq('key', 'main')
    .maybeSingle();

  if(error){
    console.error(error);
    return;
  }

  settings = {
    ...fallbackSettings,
    ...(data?.content || {})
  };
}

async function saveSettingsObj(){

  const { error } = await supabase
    .from('site_settings')
    .upsert(
      {
        key: 'main',
        content: settings,
        updated_at: new Date().toISOString()
      },
      {
        onConflict: 'key'
      }
    );

  if(error){
    throw error;
  }
}
