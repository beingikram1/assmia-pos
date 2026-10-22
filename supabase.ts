import { createClient, SupabaseClient } from '@supabase/supabase-js';
let instance: SupabaseClient | null = null;
export function db() {
 if (!instance) {
   const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
   const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
   if (!url || !key) throw new Error('Set Supabase environment variables using .env.example');
   instance=createClient(url,key,{auth:{persistSession:true,autoRefreshToken:true}});
 }
 return instance;
}
export type Membership={restaurant_id:string,role:'owner'|'manager'|'cashier'|'kitchen',restaurants:{name:string}|{name:string}[]|null};
