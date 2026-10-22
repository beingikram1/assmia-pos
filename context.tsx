"use client";
import React,{createContext,useContext,useEffect,useState} from 'react';
import {usePathname,useRouter} from 'next/navigation';import Link from 'next/link';import {db,Membership} from './supabase';
type Context={membership:Membership|null;isPlatformAdmin:boolean;loading:boolean;refresh:()=>Promise<void>};
const C=createContext<Context>({membership:null,isPlatformAdmin:false,loading:true,refresh:async()=>{}});
export function useWorkspace(){return useContext(C)}
export function Workspace({children}:{children:React.ReactNode}){
 const [membership,setMembership]=useState<Membership|null>(null);const [isPlatformAdmin,setAdmin]=useState(false);const [loading,setLoading]=useState(true);const router=useRouter();const pathname=usePathname();
 async function refresh(){try{const s=db();const {data:{user}}=await s.auth.getUser();if(!user){setMembership(null);setAdmin(false);if(pathname!=='/login')router.replace('/login');return}
 const [{data:m},{data:a}]=await Promise.all([s.from('memberships').select('restaurant_id,role,restaurants(name)').eq('user_id',user.id).limit(1).maybeSingle(),s.from('platform_admins').select('user_id').eq('user_id',user.id).maybeSingle()]);setMembership(m as Membership|null);setAdmin(!!a);
 }catch(e){console.error(e)}finally{setLoading(false)}}
 useEffect(()=>{refresh();const {data:{subscription}}=db().auth.onAuthStateChange(()=>{void refresh()});return()=>subscription.unsubscribe()},[]);
 if(loading)return <div className="container">Loading ASSMIA POS…</div>;
 return <C.Provider value={{membership,isPlatformAdmin,loading,refresh}}>{pathname!=='/login'&&<><header className="top"><b>◆ ASSMIA POS</b><span>{membership?(Array.isArray(membership.restaurants)?membership.restaurants[0]?.name:membership.restaurants?.name):'No restaurant assigned'} · {membership?.role||'Account'}</span><button className="mutedButton" onClick={async()=>{await db().auth.signOut();router.replace('/login')}}>Log out</button></header><nav className="nav"><Link href="/dashboard">Dashboard</Link><Link href="/menu">Menu</Link><Link href="/pos">POS Billing</Link><Link href="/kitchen">Kitchen KOT</Link>{isPlatformAdmin&&<Link href="/admin">SaaS Admin</Link>}</nav></>}{children}</C.Provider>
}
