
import React, { useState } from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  Truck, 
  Package, 
  Thermometer, 
  FileText, 
  Share2, 
  Printer, 
  Download,
  AlertTriangle,
  Anchor,
  Fish,
  Factory,
  CheckCircle2,
  Sprout,
  Milk,
  History,
  Lock
} from 'lucide-react';
import { useAppContext } from '../App';

export default function ProductDetail({ productId }: { productId: string }) {
    const { products, setView } = useAppContext();
    const product = products.find(p => p.id === productId);
    const [activeTab, setActiveTab] = useState<'timeline' | 'audit'>('timeline');

    if (!product) return <div>Product not found</div>;

    return (
        <div className="space-y-6">
            <button 
                onClick={() => setView('inventory')}
                className="flex items-center text-slate-500 hover:text-slate-800 transition-colors"
            >
                <ArrowLeft size={18} className="mr-1" /> Back to Inventory
            </button>

            {/* Header */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 relative overflow-hidden">
                {product.isFTL && (
                    <div className="absolute top-0 right-0 bg-red-100 text-red-700 px-4 py-1 text-xs font-bold rounded-bl-xl border-b border-l border-red-200 uppercase tracking-wide">
                        FTL Item: {product.ftlCategory}
                    </div>
                )}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-2">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center text-2xl border border-slate-200">
                            {product.category === 'Fresh Produce' ? '🥭' : 
                             product.category === 'Seafood' ? '🐟' : 
                             product.category === 'Cheeses' ? '🧀' : 
                             product.category === 'Ready-to-Eat Deli Salads' ? '🥗' : '📦'}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">{product.name}</h1>
                            <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                                <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-medium border border-slate-200">{product.tlc}</span>
                                <span>•</span>
                                <span>{product.supplierName}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-700 font-medium">
                            <Printer size={18} /> Print Map
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium shadow-sm">
                            <Share2 size={18} /> Share 24h Pkg
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-6">
                    
                    {/* Tabs */}
                    <div className="flex gap-4 border-b border-slate-200">
                        <button 
                            onClick={() => setActiveTab('timeline')}
                            className={`pb-2 px-2 text-sm font-medium transition-colors border-b-2 ${activeTab === 'timeline' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                        >
                            Traceability Events
                        </button>
                        <button 
                             onClick={() => setActiveTab('audit')}
                             className={`pb-2 px-2 text-sm font-medium transition-colors border-b-2 ${activeTab === 'audit' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                        >
                            <div className="flex items-center gap-2">
                                <History size={16} /> Data Integrity Log
                            </div>
                        </button>
                    </div>

                    {activeTab === 'timeline' && (
                        <>
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-bold text-slate-900">Critical Tracking Events (CTEs)</h2>
                                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">FSMA 204 Compliant</span>
                            </div>
                            
                            <div className="relative pl-8 space-y-10 before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                                {product.events.map((event, index) => {
                                    let Icon = MapPin;
                                    let colorClass = 'bg-blue-500';
                                    
                                    switch(event.type) {
                                        case 'Harvesting': Icon = Anchor; colorClass = 'bg-amber-500'; break;
                                        case 'Cooling': Icon = Thermometer; colorClass = 'bg-cyan-500'; break;
                                        case 'Initial Packing': Icon = Package; colorClass = 'bg-purple-600'; break;
                                        case 'First Land-Based Receiver': Icon = Fish; colorClass = 'bg-indigo-600'; break;
                                        case 'Transformation': Icon = Factory; colorClass = 'bg-pink-600'; break;
                                        case 'Shipping': Icon = Truck; colorClass = 'bg-slate-500'; break;
                                        case 'Receiving': Icon = CheckCircle2; colorClass = 'bg-emerald-600'; break;
                                    }

                                    const isTlcCreator = event.kdeData?.tlcAssigned;

                                    return (
                                        <div key={event.id} className="relative">
                                            {/* Node Icon */}
                                            <div className={`absolute -left-[41px] w-8 h-8 rounded-full border-4 border-white flex items-center justify-center text-white shadow-sm z-10 ${colorClass}`}>
                                                <Icon size={14} />
                                            </div>

                                            <div className={`bg-white rounded-lg p-5 border relative group transition-all hover:shadow-md
                                                ${isTlcCreator ? 'border-purple-200 bg-purple-50/30' : 'border-slate-200'}
                                            `}>
                                                {isTlcCreator && (
                                                    <div className="absolute -top-3 right-4 bg-purple-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                                                        TLC ASSIGNED
                                                    </div>
                                                )}

                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <h3 className={`font-bold ${isTlcCreator ? 'text-purple-900' : 'text-slate-900'}`}>{event.type}</h3>
                                                        <p className="text-sm text-slate-500">{event.location}</p>
                                                    </div>
                                                    <span className="text-xs font-mono text-slate-400 border border-slate-100 px-2 py-1 rounded">{event.date}</span>
                                                </div>
                                                
                                                <div className="text-sm text-slate-600 mb-4 italic">
                                                    {event.details}
                                                </div>

                                                {/* Key Data Elements (KDEs) Display */}
                                                {event.kdeData && (
                                                    <div className="bg-white rounded border border-slate-200 overflow-hidden">
                                                        <div className="bg-slate-50 px-3 py-1.5 border-b border-slate-200">
                                                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Key Data Elements (KDEs)</span>
                                                        </div>
                                                        <div className="p-3 grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6">
                                                            {Object.entries(event.kdeData).map(([key, value]) => {
                                                                if (key === 'Note') return null; // Skip internal notes
                                                                if (Array.isArray(value)) {
                                                                    return (
                                                                        <div key={key} className="col-span-2">
                                                                            <span className="block text-[10px] text-slate-400 uppercase">{key}</span>
                                                                            <div className="space-y-1 mt-1">
                                                                                {value.map((v, i) => (
                                                                                    <div key={i} className="text-xs bg-slate-100 p-1 rounded border border-slate-200">{v}</div>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                }
                                                                return (
                                                                    <div key={key} className={`${key.includes('Ingredient') ? 'col-span-2' : ''}`}>
                                                                        <span className="block text-[10px] text-slate-400 uppercase">{key}</span>
                                                                        <span className={`block text-sm font-medium ${key === 'tlcAssigned' ? 'text-purple-700 font-mono' : 'text-slate-800'}`}>
                                                                            {value}
                                                                        </span>
                                                                    </div>
                                                                )
                                                            })}
                                                        </div>
                                                        {event.kdeData.Note && (
                                                            <div className="bg-yellow-50 px-3 py-2 text-xs text-yellow-800 border-t border-yellow-100 flex items-start gap-2">
                                                                <AlertTriangle size={12} className="mt-0.5" />
                                                                {event.kdeData.Note}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                                
                                                <div className="mt-4 flex items-center justify-between text-sm">
                                                    <div className="text-slate-500">
                                                        Performed by <span className="font-medium text-slate-800">{event.performer}</span>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        {event.documents.map(doc => (
                                                            <button key={doc.id} className="flex items-center text-xs text-blue-600 hover:underline">
                                                                <FileText size={12} className="mr-1" /> {doc.name}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        
                        {/* Simulated Map Visual */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden h-80 relative bg-slate-100 flex items-center justify-center">
                            <div className="absolute inset-0 opacity-20 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-cover bg-center"></div>
                            <div className="relative z-10 text-center">
                                <div className="bg-white/80 backdrop-blur px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
                                    <p className="text-xs font-bold text-slate-500 uppercase mb-1">Origin Coordinates</p>
                                    <p className="font-mono text-emerald-700">
                                        {product.events[0]?.coordinates 
                                            ? `${product.events[0].coordinates.lat.toFixed(4)}° N, ${product.events[0].coordinates.lng.toFixed(4)}° E`
                                            : 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>
                        </>
                    )}

                    {activeTab === 'audit' && (
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 animate-in fade-in">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-slate-100 rounded-lg">
                                    <Lock size={20} className="text-slate-600" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-slate-900">Immutable Audit Trail</h2>
                                    <p className="text-sm text-slate-500">FSMA 204 requires original records be maintained for 2 years. Any changes are logged below.</p>
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="flex gap-4 p-4 bg-slate-50 rounded-lg border border-slate-100">
                                    <div className="mt-1">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">Receiving Record Created</p>
                                        <p className="text-xs text-slate-500">Performed by System via Supplier Portal</p>
                                        <p className="text-xs text-slate-400 mt-1">{product.receivedDate} 08:30:22 UTC</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 p-4 bg-slate-50 rounded-lg border border-slate-100">
                                    <div className="mt-1">
                                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">Document Uploaded: Bill of Lading</p>
                                        <p className="text-xs text-slate-500">Performed by Sarah Jenkins (Admin)</p>
                                        <p className="text-xs text-slate-400 mt-1">{product.receivedDate} 09:15:10 UTC</p>
                                    </div>
                                </div>
                                {product.status === 'Compliant' && (
                                     <div className="flex gap-4 p-4 bg-slate-50 rounded-lg border border-slate-100">
                                        <div className="mt-1">
                                            <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-900">Completeness Check Passed</p>
                                            <p className="text-xs text-slate-500">Automated System Check</p>
                                            <p className="text-xs text-slate-400 mt-1">{product.receivedDate} 09:15:12 UTC</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar Info - Right 1/3 */}
                <div className="space-y-6">
                    {/* Status Card */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Data Completeness</h3>
                        <div className="flex items-center justify-center mb-6 relative">
                            <div className="w-32 h-32 rounded-full border-8 border-slate-100 flex items-center justify-center relative">
                                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                                    <circle 
                                        cx="50" cy="50" r="46" 
                                        fill="none" 
                                        stroke={product.completeness >= 100 ? '#10b981' : product.completeness > 50 ? '#f59e0b' : '#ef4444'} 
                                        strokeWidth="8"
                                        strokeDasharray={`${product.completeness * 2.89} 289`}
                                    />
                                </svg>
                                <span className="text-3xl font-bold text-slate-800">{product.completeness}%</span>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Traceability Lot Code</span>
                                <span className="font-mono font-medium text-xs bg-slate-100 px-1 rounded">{product.tlc}</span>
                            </div>
                             <div className="flex justify-between text-sm">
                                <span className="text-slate-500">TLC Source</span>
                                <span className="font-medium text-right truncate w-32">{product.events.find(e => e.kdeData?.tlcAssigned)?.performer || 'Unknown'}</span>
                            </div>
                        </div>
                         <button className="w-full mt-6 py-2 border border-emerald-200 text-emerald-700 bg-emerald-50 rounded-lg text-sm font-medium hover:bg-emerald-100">
                            Verify TLC Source
                        </button>
                    </div>

                    {/* Document Library Mini */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                         <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Required Records</h3>
                         <div className="space-y-2">
                            {product.category === 'Cheeses' ? (
                                <>
                                    <div className="flex items-center justify-between p-2 rounded border border-slate-100">
                                        <div className="flex items-center gap-3">
                                            <Milk size={16} className="text-slate-400"/>
                                            <span className="text-sm text-slate-700">Pasteurization Log</span>
                                        </div>
                                        <CheckCircle2 size={16} className="text-emerald-500" />
                                    </div>
                                </>
                            ) : product.ftlCategory === 'Sprouts' ? (
                                <>
                                    <div className="flex items-center justify-between p-2 rounded border border-slate-100">
                                        <div className="flex items-center gap-3">
                                            <Sprout size={16} className="text-slate-400"/>
                                            <span className="text-sm text-slate-700">Seed Tag Info</span>
                                        </div>
                                        <CheckCircle2 size={16} className="text-emerald-500" />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="flex items-center justify-between p-2 rounded border border-slate-100">
                                        <div className="flex items-center gap-3">
                                            <FileText size={16} className="text-slate-400"/>
                                            <span className="text-sm text-slate-700">Harvest Log</span>
                                        </div>
                                        <CheckCircle2 size={16} className="text-emerald-500" />
                                    </div>
                                    <div className="flex items-center justify-between p-2 rounded border border-slate-100">
                                        <div className="flex items-center gap-3">
                                            <FileText size={16} className="text-slate-400"/>
                                            <span className="text-sm text-slate-700">Cooling Log</span>
                                        </div>
                                        <CheckCircle2 size={16} className="text-emerald-500" />
                                    </div>
                                </>
                            )}
                             <div className="flex items-center justify-between p-2 rounded border border-slate-100">
                                <div className="flex items-center gap-3">
                                    <FileText size={16} className="text-slate-400"/>
                                    <span className="text-sm text-slate-700">Bill of Lading</span>
                                </div>
                                <CheckCircle2 size={16} className="text-emerald-500" />
                            </div>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
