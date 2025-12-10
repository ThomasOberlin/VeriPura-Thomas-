
import React, { useState } from 'react';
import { User, Building, Bell, Lock, Users, Plus, Shield, Trash2, Mail, CheckCircle2 } from 'lucide-react';
import { CompanyType, UserAccount } from '../types';

export default function Settings() {
    const [activeTab, setActiveTab] = useState<'profile' | 'users' | 'roles'>('profile');
    
    // Mock State for Company
    const [company, setCompany] = useState({
        name: "VeriPura Imports Inc.",
        type: "Importer" as CompanyType,
        taxId: "12-3456789",
        address: "123 Market St, Suite 400, San Francisco, CA 94105",
        fdaReg: "12345678900",
        contactEmail: "compliance@veripura.com"
    });

    // Mock State for Users
    const [users, setUsers] = useState<UserAccount[]>([
        { id: '1', name: 'Sarah Jenkins', email: 'sarah.j@veripura.com', role: 'Admin', status: 'Active', lastActive: 'Just now' },
        { id: '2', name: 'Michael Chen', email: 'm.chen@veripura.com', role: 'Manager', status: 'Active', lastActive: '2 hours ago' },
        { id: '3', name: 'David Miller', email: 'd.miller@veripura.com', role: 'User', status: 'Active', lastActive: '1 day ago' },
        { id: '4', name: 'Elaine Benes', email: 'e.benes@veripura.com', role: 'Viewer', status: 'Invited', lastActive: '-' }
    ]);

    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [inviteData, setInviteData] = useState({ name: '', email: '', role: 'User' as UserAccount['role'] });

    const handleInvite = (e: React.FormEvent) => {
        e.preventDefault();
        const newUser: UserAccount = {
            id: `usr-${Date.now()}`,
            name: inviteData.name,
            email: inviteData.email,
            role: inviteData.role,
            status: 'Invited',
            lastActive: '-'
        };
        setUsers([...users, newUser]);
        setIsInviteModalOpen(false);
        setInviteData({ name: '', email: '', role: 'User' });
    };

    const removeUser = (id: string) => {
        setUsers(users.filter(u => u.id !== id));
    };

    const getRoleDescription = (role: string) => {
        switch(company.type) {
            case 'Importer':
                if (role === 'Admin') return 'Full control over FDA Reports, Suppliers, and Traceability Plans.';
                if (role === 'Manager') return 'Can approve Suppliers and log Receipts. Cannot change Company settings.';
                if (role === 'User') return 'Can log Receipts and upload documents.';
                return 'Read-only access to Dashboards.';
            case 'Raw Material Supplier':
                 if (role === 'Admin') return 'Manage farm locations, harvest logs, and client connections.';
                 return 'Log harvest and cooling events.';
            default:
                if (role === 'Admin') return 'Full system access.';
                return 'Standard access.';
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-900">Settings & Administration</h1>
                <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm font-medium border border-slate-200">
                    {company.type} Account
                </span>
            </div>
            
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden min-h-[600px] flex flex-col">
                {/* Tabs */}
                <div className="flex border-b border-slate-200 bg-slate-50/50">
                    <button 
                        onClick={() => setActiveTab('profile')}
                        className={`px-6 py-4 text-sm font-medium flex items-center gap-2 transition-colors ${activeTab === 'profile' ? 'text-emerald-600 border-b-2 border-emerald-600 bg-white' : 'text-slate-500 hover:text-slate-800'}`}
                    >
                        <Building size={18} /> Company Profile
                    </button>
                    <button 
                        onClick={() => setActiveTab('users')}
                        className={`px-6 py-4 text-sm font-medium flex items-center gap-2 transition-colors ${activeTab === 'users' ? 'text-emerald-600 border-b-2 border-emerald-600 bg-white' : 'text-slate-500 hover:text-slate-800'}`}
                    >
                        <Users size={18} /> Team & Roles
                    </button>
                    <button 
                         onClick={() => setActiveTab('roles')}
                         className={`px-6 py-4 text-sm font-medium flex items-center gap-2 transition-colors ${activeTab === 'roles' ? 'text-emerald-600 border-b-2 border-emerald-600 bg-white' : 'text-slate-500 hover:text-slate-800'}`}
                    >
                        <Lock size={18} /> Permissions Matrix
                    </button>
                </div>
                
                <div className="p-8 flex-1">
                    {activeTab === 'profile' && (
                        <div className="max-w-2xl space-y-6 animate-in fade-in slide-in-from-left-4">
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex gap-3 mb-6">
                                <div className="mt-1 text-blue-600"><Shield size={20}/></div>
                                <div>
                                    <h3 className="text-sm font-bold text-blue-900">Account Type: {company.type}</h3>
                                    <p className="text-sm text-blue-700 mt-1">
                                        Your features and compliance requirements are tailored to your role in the supply chain (FSMA 204).
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
                                    <input 
                                        type="text" 
                                        value={company.name}
                                        onChange={(e) => setCompany({...company, name: e.target.value})}
                                        className="w-full rounded-lg border-slate-300 focus:ring-emerald-500 focus:border-emerald-500" 
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Business Type</label>
                                    <select 
                                        value={company.type}
                                        onChange={(e) => setCompany({...company, type: e.target.value as CompanyType})}
                                        className="w-full rounded-lg border-slate-300 focus:ring-emerald-500 focus:border-emerald-500"
                                    >
                                        <option value="Importer">Importer (FSVP)</option>
                                        <option value="Exporter">Exporter / Consolidator</option>
                                        <option value="Transformer">Transformer / Processor</option>
                                        <option value="Raw Material Supplier">Raw Material Supplier (Farm)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">FDA Registration #</label>
                                    <input 
                                        type="text" 
                                        value={company.fdaReg}
                                        onChange={(e) => setCompany({...company, fdaReg: e.target.value})}
                                        className="w-full rounded-lg border-slate-300 focus:ring-emerald-500 focus:border-emerald-500 font-mono" 
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Tax ID / EIN</label>
                                    <input 
                                        type="text" 
                                        value={company.taxId}
                                        onChange={(e) => setCompany({...company, taxId: e.target.value})}
                                        className="w-full rounded-lg border-slate-300 focus:ring-emerald-500 focus:border-emerald-500" 
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Contact Email</label>
                                    <input 
                                        type="email" 
                                        value={company.contactEmail}
                                        onChange={(e) => setCompany({...company, contactEmail: e.target.value})}
                                        className="w-full rounded-lg border-slate-300 focus:ring-emerald-500 focus:border-emerald-500" 
                                    />
                                </div>

                                <div className="md:col-span-2">
                                     <label className="block text-sm font-medium text-slate-700 mb-1">Business Address</label>
                                     <input 
                                        type="text" 
                                        value={company.address}
                                        onChange={(e) => setCompany({...company, address: e.target.value})}
                                        className="w-full rounded-lg border-slate-300 focus:ring-emerald-500 focus:border-emerald-500" 
                                     />
                                </div>
                            </div>
                            
                            <div className="pt-6 border-t border-slate-100 flex justify-end">
                                <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium shadow-sm transition-colors">
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'users' && (
                        <div className="animate-in fade-in slide-in-from-right-4">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h2 className="text-lg font-bold text-slate-900">Team Members</h2>
                                    <p className="text-sm text-slate-500">Manage access to your {company.type} account.</p>
                                </div>
                                <button 
                                    onClick={() => setIsInviteModalOpen(true)}
                                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm"
                                >
                                    <Plus size={18} /> Invite User
                                </button>
                            </div>

                            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-50 text-slate-500 font-medium">
                                        <tr>
                                            <th className="px-6 py-4">User</th>
                                            <th className="px-6 py-4">Role</th>
                                            <th className="px-6 py-4">Status</th>
                                            <th className="px-6 py-4">Last Active</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {users.map(user => (
                                            <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-slate-900">{user.name}</div>
                                                    <div className="text-xs text-slate-500">{user.email}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                                                        ${user.role === 'Admin' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                                          user.role === 'Manager' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                          'bg-slate-100 text-slate-700 border-slate-200'
                                                        }
                                                    `}>
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-2 h-2 rounded-full ${user.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                                                        <span className="text-slate-700">{user.status}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-slate-500">{user.lastActive}</td>
                                                <td className="px-6 py-4 text-right">
                                                    <button 
                                                        onClick={() => removeUser(user.id)}
                                                        className="text-slate-400 hover:text-red-600 transition-colors"
                                                        title="Remove User"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'roles' && (
                        <div className="animate-in fade-in slide-in-from-right-4">
                            <h2 className="text-lg font-bold text-slate-900 mb-6">Role Permissions Matrix</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {['Admin', 'Manager', 'User', 'Viewer'].map(role => (
                                    <div key={role} className="border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="font-bold text-slate-900">{role}</h3>
                                            <span className={`text-xs px-2 py-1 rounded font-medium 
                                                ${role === 'Admin' ? 'bg-purple-100 text-purple-700' : 
                                                  role === 'Manager' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                                                {role.toUpperCase()}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-600 mb-4 h-10">
                                            {getRoleDescription(role)}
                                        </p>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm text-slate-700">
                                                <CheckCircle2 size={16} className={role === 'Viewer' ? 'text-slate-200' : 'text-emerald-500'} />
                                                <span className={role === 'Viewer' ? 'text-slate-400' : ''}>Edit Settings</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-slate-700">
                                                <CheckCircle2 size={16} className={role === 'User' || role === 'Viewer' ? 'text-slate-200' : 'text-emerald-500'} />
                                                <span className={role === 'User' || role === 'Viewer' ? 'text-slate-400' : ''}>Manage Users</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-slate-700">
                                                <CheckCircle2 size={16} className={role === 'Viewer' ? 'text-slate-200' : 'text-emerald-500'} />
                                                <span className={role === 'Viewer' ? 'text-slate-400' : ''}>Log CTEs / Receipts</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-slate-700">
                                                <CheckCircle2 size={16} className="text-emerald-500" />
                                                <span>View Reports</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Invite Modal */}
            {isInviteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-in zoom-in-95">
                        <h2 className="text-xl font-bold mb-4">Invite Team Member</h2>
                        <form onSubmit={handleInvite} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Full Name</label>
                                <input 
                                    required
                                    type="text" 
                                    className="w-full rounded-lg border-slate-300 focus:ring-emerald-500" 
                                    value={inviteData.name}
                                    onChange={e => setInviteData({...inviteData, name: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Email Address</label>
                                <input 
                                    required
                                    type="email" 
                                    className="w-full rounded-lg border-slate-300 focus:ring-emerald-500" 
                                    value={inviteData.email}
                                    onChange={e => setInviteData({...inviteData, email: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Role</label>
                                <select 
                                    className="w-full rounded-lg border-slate-300 focus:ring-emerald-500"
                                    value={inviteData.role}
                                    onChange={e => setInviteData({...inviteData, role: e.target.value as any})}
                                >
                                    <option value="Admin">Admin</option>
                                    <option value="Manager">Manager</option>
                                    <option value="User">User</option>
                                    <option value="Viewer">Viewer</option>
                                </select>
                                <p className="text-xs text-slate-500 mt-1">
                                    {getRoleDescription(inviteData.role)}
                                </p>
                            </div>
                            
                            <div className="flex justify-end gap-2 pt-4">
                                <button 
                                    type="button"
                                    onClick={() => setIsInviteModalOpen(false)} 
                                    className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 flex items-center gap-2"
                                >
                                    <Mail size={16} /> Send Invite
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
