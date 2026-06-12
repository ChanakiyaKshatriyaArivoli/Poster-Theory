import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import { Package, Heart, ChevronRight, ArrowRight, MapPin, User, X, Plus, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

interface Address {
  id: number;
  label: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
  is_default: boolean;
}

export default function Dashboard() {
  const { user, token, refreshUser } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);

  // Profile panel
  const [showProfile, setShowProfile] = useState(false);
  const [profileName, setProfileName] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState('');

  // Address panel
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [addrForm, setAddrForm] = useState({ label: 'Home', line1: '', line2: '', city: '', state: '', pincode: '', is_default: false });
  const [addrSaving, setAddrSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          const [ordersRes, designsRes] = await Promise.all([
            api.get(`/api/orders/user`, { headers: { Authorization: `Bearer ${token}` } }),
            api.get(`/api/designs/user/${user.id}`, { headers: { Authorization: `Bearer ${token}` } })
          ]);
          setOrders(ordersRes.data);
          setDesigns(designsRes.data);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [user, token]);

  useEffect(() => {
    if (user) {
      setProfileName(user.name || '');
      setProfilePhone(user.phone || '');
    }
  }, [user]);

  const fetchAddresses = async () => {
    try {
      const res = await api.get('/api/profile/addresses', { headers: { Authorization: `Bearer ${token}` } });
      setAddresses(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    if (showProfile && token) fetchAddresses();
  }, [showProfile, token]);

  const handleProfileSave = async () => {
    if (profilePhone && (profilePhone.length !== 10 || !/^[6-9]/.test(profilePhone))) {
      setProfileMsg('Enter valid mobile number');
      return;
    }
    setProfileSaving(true);
    setProfileMsg('');
    try {
      await api.put('/api/profile', { name: profileName, phone: profilePhone }, { headers: { Authorization: `Bearer ${token}` } });
      await refreshUser();
      setProfileMsg('Profile updated!');
    } catch (err: any) {
      setProfileMsg(err.response?.data?.error || 'Update failed');
    } finally {
      setProfileSaving(false);
    }
  };

  const resetAddrForm = () => {
    setAddrForm({ label: 'Home', line1: '', line2: '', city: '', state: '', pincode: '', is_default: false });
    setEditingAddress(null);
    setShowAddressForm(false);
  };

  const handleAddressSave = async () => {
    setAddrSaving(true);
    try {
      if (editingAddress) {
        await api.put(`/api/profile/addresses/${editingAddress.id}`, addrForm, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        await api.post('/api/profile/addresses', addrForm, { headers: { Authorization: `Bearer ${token}` } });
      }
      await fetchAddresses();
      resetAddrForm();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to save address');
    } finally {
      setAddrSaving(false);
    }
  };

  const handleAddressDelete = async (id: number) => {
    try {
      await api.delete(`/api/profile/addresses/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      await fetchAddresses();
    } catch (err) { console.error(err); }
  };

  const startEditAddress = (addr: Address) => {
    setEditingAddress(addr);
    setAddrForm({ label: addr.label, line1: addr.line1, line2: addr.line2, city: addr.city, state: addr.state, pincode: addr.pincode, is_default: addr.is_default });
    setShowAddressForm(true);
  };

  if (loading) return (
    <div className="pt-32 text-center h-screen flex flex-col items-center justify-center space-y-6 bg-white">
      <div className="w-16 h-16 border-4 border-z-border border-t-transparent rounded-full animate-spin"></div>
      <p className="font-mono font-bold text-z-ink uppercase tracking-[0.4em] text-[10px]">VERIFYING_CREDENTIALS...</p>
    </div>
  );

  return (
    <div className="pt-40 pb-32 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <header className="mb-20 flex flex-col md:flex-row justify-between items-end gap-10 border-b-4 border-z-border pb-12">
          <div>
            <p className="text-[11px] font-mono uppercase tracking-[0.5em] text-z-muted font-black mb-4">THE_ARCHIVE_DASHBOARD</p>
            <h1 className="font-display font-black text-6xl sm:text-7xl uppercase tracking-tighter italic leading-none text-z-ink">
              HELLO, <span className="text-outline">{user?.name || user?.email.split('@')[0]}</span>
            </h1>
          </div>
          <div className="flex gap-4">
            {user?.is_admin && (
                <Link to="/admin" className="sticker-btn bg-z-ink text-white">ADMIN_TERMINAL_</Link>
            )}
            <button 
              onClick={() => {}}
              className="px-6 py-2 border-2 border-z-border font-mono text-[10px] font-bold hover:bg-black hover:text-white transition-all uppercase"
            >
              Sign Out
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-24">
            {/* Profile Panel */}
            {showProfile && (
              <motion.section initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-white border-2 border-z-border p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative">
                <button onClick={() => setShowProfile(false)} className="absolute top-4 right-4 p-2 hover:bg-z-ink hover:text-white transition-all border-2 border-z-border"><X className="w-4 h-4" /></button>
                <div className="flex items-center space-x-4 mb-8 pb-4 border-b-2 border-z-border">
                  <User className="w-5 h-5" />
                  <h2 className="text-[12px] font-display font-black uppercase tracking-widest text-z-ink">MANAGE_PROFILE_</h2>
                </div>
                <div className="space-y-6 max-w-md">
                  <div>
                    <label className="text-[10px] font-mono uppercase tracking-[0.3em] text-z-muted mb-2 block font-black">NAME</label>
                    <input value={profileName} onChange={e => setProfileName(e.target.value)} className="w-full bg-transparent border-b-2 border-z-border py-3 text-sm font-display font-bold uppercase focus:outline-none focus:border-z-ink" />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono uppercase tracking-[0.3em] text-z-muted mb-2 block font-black">PHONE (10 DIGITS)</label>
                    <input value={profilePhone} onChange={e => setProfilePhone(e.target.value.replace(/\D/g, '').slice(0, 10))} className="w-full bg-transparent border-b-2 border-z-border py-3 text-sm font-display font-bold focus:outline-none focus:border-z-ink" placeholder="9876543210" maxLength={10} />

                  </div>
                  <div>
                    <label className="text-[10px] font-mono uppercase tracking-[0.3em] text-z-muted mb-2 block font-black">EMAIL</label>
                    <p className="py-3 text-sm font-display font-bold uppercase text-z-muted">{user?.email}</p>
                  </div>
                  {profileMsg && <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-z-ink border-2 border-z-border px-4 py-2 inline-block">{profileMsg}</p>}
                  <button onClick={handleProfileSave} disabled={profileSaving} className="sticker-btn bg-z-ink text-white">
                    {profileSaving ? 'SAVING...' : 'SAVE_PROFILE_'}
                  </button>
                </div>

                {/* Addresses inside Profile */}
                <div className="mt-12 pt-8 border-t-2 border-z-border">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-4">
                      <MapPin className="w-5 h-5" />
                      <h2 className="text-[12px] font-display font-black uppercase tracking-widest text-z-ink">ADDRESS</h2>
                    </div>
                    {!showAddressForm && (
                      <button onClick={() => { resetAddrForm(); setShowAddressForm(true); }} className="flex items-center gap-2 px-4 py-2 border-2 border-z-border font-mono text-[10px] font-bold hover:bg-z-ink hover:text-white transition-all uppercase">
                        <Plus className="w-3 h-3" /> ADD_NEW
                      </button>
                    )}
                  </div>

                  {showAddressForm && (
                    <div className="mb-8 p-6 border-2 border-dashed border-z-border bg-z-paper space-y-4">
                      <p className="text-[10px] font-mono font-black uppercase tracking-widest mb-4">{editingAddress ? 'EDIT_ADDRESS' : 'NEW_ADDRESS'}</p>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[9px] font-mono uppercase text-z-muted font-black block mb-1">LABEL</label>
                          <input value={addrForm.label} onChange={e => setAddrForm({ ...addrForm, label: e.target.value })} className="w-full border-b-2 border-z-border py-2 text-sm font-bold bg-transparent focus:outline-none" placeholder="Home" />
                        </div>
                        <div>
                          <label className="text-[9px] font-mono uppercase text-z-muted font-black block mb-1">PINCODE (6 DIGITS)</label>
                          <input value={addrForm.pincode} onChange={e => setAddrForm({ ...addrForm, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) })} className="w-full border-b-2 border-z-border py-2 text-sm font-bold bg-transparent focus:outline-none" placeholder="560001" maxLength={6} />
                        </div>
                      </div>
                      <div>
                        <label className="text-[9px] font-mono uppercase text-z-muted font-black block mb-1">ADDRESS LINE 1</label>
                        <input value={addrForm.line1} onChange={e => setAddrForm({ ...addrForm, line1: e.target.value })} className="w-full border-b-2 border-z-border py-2 text-sm font-bold bg-transparent focus:outline-none" placeholder="123, Street Name" />
                      </div>
                      <div>
                        <label className="text-[9px] font-mono uppercase text-z-muted font-black block mb-1">ADDRESS LINE 2</label>
                        <input value={addrForm.line2} onChange={e => setAddrForm({ ...addrForm, line2: e.target.value })} className="w-full border-b-2 border-z-border py-2 text-sm font-bold bg-transparent focus:outline-none" placeholder="Apt, Floor (optional)" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[9px] font-mono uppercase text-z-muted font-black block mb-1">CITY</label>
                          <input value={addrForm.city} onChange={e => setAddrForm({ ...addrForm, city: e.target.value })} className="w-full border-b-2 border-z-border py-2 text-sm font-bold bg-transparent focus:outline-none" placeholder="Bangalore" />
                        </div>
                        <div>
                          <label className="text-[9px] font-mono uppercase text-z-muted font-black block mb-1">STATE</label>
                          <input value={addrForm.state} onChange={e => setAddrForm({ ...addrForm, state: e.target.value })} className="w-full border-b-2 border-z-border py-2 text-sm font-bold bg-transparent focus:outline-none" placeholder="Karnataka" />
                        </div>
                      </div>
                      <label className="flex items-center gap-2 cursor-pointer mt-2">
                        <input type="checkbox" checked={addrForm.is_default} onChange={e => setAddrForm({ ...addrForm, is_default: e.target.checked })} className="w-4 h-4" />
                        <span className="text-[10px] font-mono font-bold uppercase">SET_AS_DEFAULT</span>
                      </label>
                      <div className="flex gap-4 mt-4">
                        <button onClick={handleAddressSave} disabled={addrSaving} className="sticker-btn bg-z-ink text-white">{addrSaving ? 'SAVING...' : 'SAVE_ADDRESS_'}</button>
                        <button onClick={resetAddrForm} className="px-6 py-2 border-2 border-z-border font-mono text-[10px] font-bold hover:bg-black hover:text-white transition-all uppercase">CANCEL</button>
                      </div>
                    </div>
                  )}

                  {addresses.length > 0 ? (
                    <div className="space-y-4">
                      {addresses.map(addr => (
                        <div key={addr.id} className="flex justify-between items-start p-6 border-2 border-z-border bg-z-paper/50 hover:bg-white transition-all">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-[10px] font-mono font-black uppercase tracking-widest bg-z-ink text-white px-2 py-0.5">{addr.label}</span>
                              {addr.is_default && <span className="flex items-center gap-1 text-[9px] font-mono font-bold uppercase text-z-muted"><Star className="w-3 h-3" />DEFAULT</span>}
                            </div>
                            <p className="text-sm font-display font-bold text-z-ink">{addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}</p>
                            <p className="text-[11px] font-mono text-z-muted uppercase">{addr.city}, {addr.state} - {addr.pincode}</p>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => startEditAddress(addr)} className="px-3 py-1 border-2 border-z-border text-[9px] font-mono font-bold uppercase hover:bg-z-ink hover:text-white transition-all">EDIT</button>
                            <button onClick={() => handleAddressDelete(addr.id)} className="px-3 py-1 border-2 border-z-border text-[9px] font-mono font-bold uppercase hover:bg-red-600 hover:text-white hover:border-red-600 transition-all">DEL</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : !showAddressForm ? (
                    <div className="text-center py-12 border-2 border-dashed border-z-border">
                      <p className="font-display font-black text-xl uppercase tracking-tighter text-z-muted italic">NO_ADDRESS_SAVED</p>
                      <p className="text-[10px] font-mono text-z-muted uppercase mt-2">Add an address to enable checkout</p>
                    </div>
                  ) : null}
                </div>
              </motion.section>
            )}


            {/* Orders */}
            <section>
              <div className="flex items-center space-x-4 mb-10 pb-4 border-b-2 border-z-border">
                <Package className="w-5 h-5 text-z-ink" />
                <h2 className="text-[12px] font-display font-black uppercase tracking-widest text-z-ink">RECENT_CURATIONS_</h2>
              </div>
              
              {orders.length > 0 ? (
                <div className="space-y-8">
                  {orders.map((order: any) => {
                    const isExpanded = expandedOrderId === order.id;
                    const items = Array.isArray(order.items) ? order.items : (typeof order.items === 'string' ? JSON.parse(order.items) : []);
                    
                    return (
                      <div 
                        key={order.id} 
                        onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                        className={`bg-white border-2 border-z-border p-8 group cursor-pointer shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all relative ${isExpanded ? 'shadow-none translate-x-[4px] translate-y-[4px] border-z-ink' : ''}`}
                      >
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                          <div className="mb-6 sm:mb-0">
                            <p className="text-[10px] font-mono uppercase tracking-widest text-z-muted mb-3 font-bold underline decoration-2 decoration-z-border">REF_ID: STUDIO-{order.id}</p>
                            <p className="font-display font-black text-4xl text-z-ink tracking-tighter uppercase leading-none italic"><span className="text-outline">₹</span>{order.total.toLocaleString()}</p>
                            <p className="text-[9px] font-mono font-bold uppercase text-z-muted mt-4 tracking-widest">RECORDED: {new Date(order.created_at).toLocaleDateString()}</p>
                          </div>
                          <div className="flex items-center space-x-8 w-full sm:w-auto justify-between sm:justify-end">
                            <span className="px-6 py-2 bg-z-paper border-2 border-z-border text-z-ink text-[10px] uppercase tracking-widest font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">{order.status}</span>
                            <div className={`w-12 h-12 border-2 border-z-border flex items-center justify-center bg-white group-hover:bg-z-ink group-hover:text-white transition-all ${isExpanded ? 'rotate-90 bg-z-ink text-white' : ''}`}>
                              <ChevronRight className="w-6 h-6" />
                            </div>
                          </div>
                        </div>

                        {isExpanded && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-10 pt-10 border-t-2 border-z-border border-dashed overflow-hidden"
                            onClick={e => e.stopPropagation()}
                          >
                            <h4 className="text-[10px] font-mono font-black uppercase tracking-[0.3em] text-z-ink mb-6 underline">ORDERED_CONTENTS_</h4>
                            <div className="space-y-4">
                              {items.length > 0 ? items.map((item: any, idx: number) => (
                                <div key={idx} className="flex justify-between items-center bg-z-paper/50 p-4 border border-z-border/50">
                                   <div className="flex items-center gap-6">
                                      <div className="w-12 h-16 bg-white border border-z-border p-1">
                                        <img src={item.image} alt={item.title || item.name} className="w-full h-full object-cover" />
                                      </div>
                                      <div>
                                        <p className="font-display font-black text-[11px] uppercase tracking-tighter text-z-ink">{item.title || item.name}</p>
                                        <p className="text-[9px] font-mono uppercase tracking-widest text-z-muted font-bold">QTY: {item.quantity || 1} // COL: {item.collection || 'N/A'}</p>
                                      </div>
                                   </div>
                                   <p className="font-mono font-black text-sm text-z-ink">₹{item.price.toLocaleString()}</p>
                                </div>
                              )) : (
                                <p className="font-mono text-[10px] uppercase tracking-widest text-z-muted italic">NO_ITEM_DATA_LOGGED_FOR_THIS_TRANSACTION_</p>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-white border-2 border-dashed border-z-border p-20 text-center">
                  <p className="font-display font-black text-2xl uppercase tracking-tighter text-z-muted italic mb-8 underline underline-offset-8">ARCHIVE_IS_EMPTY</p>
                  <Link to="/shop" className="sticker-btn bg-z-ink text-white inline-block">EXPLORE_THE_DIRECTORY_</Link>
                </div>
              )}
            </section>

             {/* Designs */}
             <section>
              <div className="flex items-center space-x-4 mb-10 pb-4 border-b-2 border-z-border">
                <Heart className="w-5 h-5 text-z-ink" />
                <h2 className="text-[12px] font-display font-black uppercase tracking-widest text-z-ink">SAVED_SKETCHES_</h2>
              </div>
              
              {designs.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                  {designs.map((design: any) => (
                    <div key={design.id} className="group relative aspect-[3/4] bg-white border-2 border-z-border p-8 flex flex-col items-center justify-center text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
                        <div className="w-full h-full flex items-center justify-center bg-z-paper/30 border border-z-border/10">
                          <p className="font-display font-black uppercase leading-tight tracking-tighter text-z-ink" style={{ fontSize: `${design.font_size / 3}px` }}>{design.text}</p>
                        </div>
                        <div className="absolute inset-0 bg-z-ink/90 backdrop-blur-sm flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 p-6">
                             <p className="text-white text-[10px] uppercase font-mono tracking-widest mb-6 font-bold border-b border-white/30 pb-2">FORMAT: {design.size}</p>
                             <button className="sticker-btn bg-white text-z-ink w-full">RE-EDIT_</button>
                        </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white border-2 border-dashed border-z-border p-12 text-center">
                  <p className="font-display font-black text-xl uppercase tracking-tighter text-z-muted italic leading-none border-b-2 border-z-border inline-block pb-1">NO_SKETCHES_LOGGED</p>
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-12">
            <div className="bg-z-paper p-10 border-2 border-z-border shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] sticky top-40 overflow-hidden">
              <h3 className="text-[12px] font-display font-black uppercase tracking-widest text-z-ink mb-12 border-b-2 border-z-border pb-2 inline-block italic">IDENTITY_FILE</h3>
              <div className="space-y-10">
                <div className="flex items-center space-x-6 pb-10 border-b-2 border-dashed border-z-border">
                   <div className="w-16 h-16 bg-z-ink border-2 border-z-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center text-white text-2xl font-display font-black italic">
                      {(user?.name || user?.email)?.[0]?.toUpperCase()}
                   </div>
                   <div>
                      <p className="text-lg font-display font-black truncate w-40 uppercase tracking-tighter text-z-ink">{user?.name || user?.email.split('@')[0]}</p>
                      <p className="text-[9px] font-mono text-z-muted uppercase tracking-widest font-black bg-white border border-z-border px-2 py-0.5 inline-block mt-1">LVL: STANDARD_CURATOR</p>
                   </div>
                </div>
                <div className="space-y-4 font-display font-bold text-sm uppercase tracking-tight text-z-ink">
                  <button onClick={() => { setShowProfile(!showProfile); if (!showProfile) fetchAddresses(); }} className="w-full text-left py-3 px-4 border-2 border-transparent hover:border-z-border hover:bg-white transition-all flex justify-between items-center group">
                    <span>MANAGE_PROFILE_</span>
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-z-ink p-10 border-2 border-z-border text-white relative shadow-[12px_12px_0px_0px_rgba(255,255,255,1),14px_14px_0px_0px_rgba(0,0,0,1)]">
               <div className="relative z-10">
                 <h3 className="font-display font-black text-4xl uppercase tracking-tighter italic mb-8 leading-none">JOIN_THE<br/><span className="text-outline">COLLECTIVE</span></h3>
                 <p className="text-[10px] font-mono font-bold text-white/60 mb-10 leading-relaxed uppercase tracking-widest">Share the vision. Your referral provides 20% off and adds credits to your archive.</p>
                 <button className="sticker-btn bg-white text-z-ink w-full font-black">GENERATE_INVITE_</button>
               </div>
               <div className="absolute -top-12 -right-12 w-48 h-48 border-2 border-white/5 rounded-full pointer-events-none" />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

