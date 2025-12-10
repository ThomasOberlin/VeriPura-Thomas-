import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, Map, Phone, FileText, Edit2, Save, X, Plus, Trash2, MapPin, MousePointerClick } from 'lucide-react';
import { useAppContext } from '../App';
import { TraceabilityPlan } from '../types';

// Interactive Map Component
const FarmMapEditor = ({ 
    coordinates, 
    isEditing, 
    onChange 
}: { 
    coordinates: { lat: number; lng: number }[], 
    isEditing: boolean, 
    onChange: (coords: { lat: number; lng: number }[]) => void 
}) => {
    const mapRef = useRef<HTMLDivElement>(null);

    // Mock bounding box for demo visualization (Baja California region)
    const BOUNDS = {
        minLat: 32.4, maxLat: 32.6,
        minLng: -117.0, maxLng: -116.8
    };

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isEditing || !mapRef.current) return;
        
        const rect = mapRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Calculate lat/lng based on click position relative to container
        const lat = BOUNDS.maxLat - (y / rect.height) * (BOUNDS.maxLat - BOUNDS.minLat);
        const lng = BOUNDS.minLng + (x / rect.width) * (BOUNDS.maxLng - BOUNDS.minLng);
        
        onChange([...coordinates, { lat, lng }]);
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange([]);
    };

    const handleUndo = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange(coordinates.slice(0, -1));
    };

    return (
        <div 
            ref={mapRef}
            onClick={handleClick}
            className={`relative w-full h-56 bg-slate-100 rounded-lg overflow-hidden border border-slate-300 transition-all ${isEditing ? 'cursor-crosshair ring-4 ring-emerald-500/10 hover:ring-emerald-500/20' : ''}`}
        >
            {/* Background Map Image (Satellite Style Placeholder) */}
            <div className="absolute inset-0 bg-[url('https://mt0.google.com/vt/lyrs=s&x=20&y=49&z=7')] bg-cover bg-center opacity-80 grayscale-[20%]"></div>
            
            {/* Grid Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

            {/* Polygon Lines */}
            {coordinates.length > 1 && (
                <svg className="absolute inset-0 pointer-events-none w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                    <polygon 
                        points={coordinates.map(c => {
                             const y = ((BOUNDS.maxLat - c.lat) / (BOUNDS.maxLat - BOUNDS.minLat)) * 100;
                             const x = ((c.lng - BOUNDS.minLng) / (BOUNDS.maxLng - BOUNDS.minLng)) * 100;
                             return `${Math.min(Math.max(x, 0), 100)},${Math.min(Math.max(y, 0), 100)}` 
                        }).join(' ')}
                        fill="rgba(16, 185, 129, 0.3)"
                        stroke="#10b981"
                        strokeWidth="1"
                    />
                </svg>
            )}

            {/* Coordinate Points */}
            {coordinates.map((coord, i) => {
                const top = ((BOUNDS.maxLat - coord.lat) / (BOUNDS.maxLat - BOUNDS.minLat)) * 100;
                const left = ((coord.lng - BOUNDS.minLng) / (BOUNDS.maxLng - BOUNDS.minLng)) * 100;
                
                return (
                    <div 
                        key={i}
                        className="absolute w-3 h-3 bg-red-500 border-2 border-white rounded-full shadow-sm transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center group z-10 transition-transform hover:scale-150"
                        style={{ top: `${Math.min(Math.max(top, 0), 100)}%`, left: `${Math.min(Math.max(left, 0), 100)}%` }}
                    >
                        <div className="hidden group-hover:block absolute bottom-full mb-2 bg-slate-900/90 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-20 shadow-lg backdrop-blur-sm">
                            {coord.lat.toFixed(5)}, {coord.lng.toFixed(5)}
                        </div>
                    </div>
                );
            })}

            {isEditing && (
                <div className="absolute bottom-3 right-3 flex gap-2 z-20">
                     {coordinates.length > 0 && (
                        <>
                            <button 
                                onClick={handleUndo}
                                className="bg-white text-slate-700 text-xs px-3 py-1.5 rounded shadow-sm hover:bg-slate-50 border border-slate-200 font-medium"
                            >
                                Undo
                            </button>
                            <button 
                                onClick={handleClear}
                                className="bg-white text-red-600 text-xs px-3 py-1.5 rounded shadow-sm hover:bg-red-50 border border-slate-200 font-medium"
                            >
                                Clear All
                            </button>
                        </>
                     )}
                     <div className="bg-slate-900/80 backdrop-blur text-white text-xs px-3 py-1.5 rounded shadow-sm flex items-center gap-2">
                        <MousePointerClick size={12} /> Click map to add point
                    </div>
                </div>
            )}
            
            {!isEditing && coordinates.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/5">
                    <span className="bg-white/90 px-3 py-1 rounded text-xs text-slate-500 shadow-sm">No coordinates mapped</span>
                </div>
            )}
        </div>
    );
};

export default function TraceabilityPlanView() {
    const { traceabilityPlan, updateTraceabilityPlan } = useAppContext();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<TraceabilityPlan | null>(null);

    useEffect(() => {
        if (traceabilityPlan) {
            setFormData(JSON.parse(JSON.stringify(traceabilityPlan)));
        }
    }, [traceabilityPlan]);

    const handleSave = () => {
        if (formData) {
            updateTraceabilityPlan(formData);
            setIsEditing(false);
        }
    };

    const handleCancel = () => {
        if (traceabilityPlan) {
            setFormData(JSON.parse(JSON.stringify(traceabilityPlan)));
        }
        setIsEditing(false);
    };

    const handleChange = (field: keyof TraceabilityPlan, value: string) => {
        setFormData(prev => prev ? ({ ...prev, [field]: value }) : null);
    };

    const handleContactChange = (field: string, value: string) => {
        setFormData(prev => prev ? ({
            ...prev,
            pointOfContact: { ...prev.pointOfContact, [field]: value }
        }) : null);
    };

    const addMap = () => {
        setFormData(prev => prev ? ({
            ...prev,
            farmMaps: [
                ...prev.farmMaps, 
                { 
                    id: `MAP-${Date.now()}`, 
                    name: 'New Field', 
                    location: 'Enter Location', 
                    coordinates: [] 
                }
            ]
        }) : null);
    };

    const removeMap = (id: string) => {
        setFormData(prev => prev ? ({
            ...prev,
            farmMaps: prev.farmMaps.filter(m => m.id !== id)
        }) : null);
    };

    const updateMap = (id: string, field: string, value: any) => {
        setFormData(prev => prev ? ({
            ...prev,
            farmMaps: prev.farmMaps.map(m => m.id === id ? { ...m, [field]: value } : m)
        }) : null);
    };

    if (!formData) return <div>Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Traceability Plan</h1>
                    <p className="text-slate-500">Required under § 1.1315 of the Food Traceability Rule.</p>
                </div>
                {!isEditing ? (
                    <button 
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
                    >
                        <Edit2 size={16} /> Edit Plan
                    </button>
                ) : (
                    <div className="flex gap-2">
                        <button 
                            onClick={handleCancel}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                        >
                            <X size={16} /> Cancel
                        </button>
                        <button 
                            onClick={handleSave}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
                        >
                            <Save size={16} /> Save Changes
                        </button>
                    </div>
                )}
            </div>

            {/* Record Keeping Procedures (§ 1.1315(a)(1)) */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
                <div className="flex items-start gap-4 mb-4">
                    <div className="bg-blue-100 p-2 rounded-lg text-blue-600 shrink-0">
                        <FileText size={24} />
                    </div>
                    <div className="w-full">
                        <h2 className="text-lg font-bold text-slate-900 mb-2">Record Maintenance Procedures (§ 1.1315(a)(1))</h2>
                        <p className="text-xs text-slate-500 mb-4">Describe the procedures used to maintain the records required by the rule, including the format and location of the records.</p>
                        {isEditing ? (
                            <textarea
                                value={formData.procedureDescription}
                                onChange={(e) => handleChange('procedureDescription', e.target.value)}
                                className="w-full h-32 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                                placeholder="Describe your record maintenance procedures..."
                            />
                        ) : (
                            <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                                {formData.procedureDescription}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* FTL Identification & TLC Assignment */}
            <div className="grid grid-cols-1 gap-6">
                {/* FTL Identification (§ 1.1315(a)(2)) */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                        <BookOpen size={18} className="text-emerald-600" /> FTL Food Identification (§ 1.1315(a)(2))
                    </h3>
                    <p className="text-xs text-slate-500 mb-4">Describe the procedures used to identify foods on the Food Traceability List that you manufacture, process, pack, or hold.</p>
                    {isEditing ? (
                        <textarea
                            value={formData.ftlIdentificationProcedure}
                            onChange={(e) => handleChange('ftlIdentificationProcedure', e.target.value)}
                            className="w-full h-24 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                            placeholder="Describe how you identify FTL foods..."
                        />
                    ) : (
                        <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
                            {formData.ftlIdentificationProcedure}
                        </p>
                    )}
                </div>

                {/* TLC Assignment (§ 1.1315(a)(3)) */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                        <BookOpen size={18} className="text-purple-600" /> TLC Assignment (§ 1.1315(a)(3))
                    </h3>
                    <p className="text-xs text-slate-500 mb-4">Describe how you assign traceability lot codes to foods on the FTL, if applicable.</p>
                    {isEditing ? (
                        <textarea
                            value={formData.tlcAssignmentProcedure}
                            onChange={(e) => handleChange('tlcAssignmentProcedure', e.target.value)}
                            className="w-full h-24 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                            placeholder="Describe your TLC assignment process..."
                        />
                    ) : (
                        <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
                            {formData.tlcAssignmentProcedure}
                        </p>
                    )}
                </div>
            </div>

            {/* Farm Maps (§ 1.1315(a)(5)) */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <Map size={18} className="text-amber-600" /> Farm Maps (§ 1.1315(a)(5))
                    </h3>
                    {isEditing && (
                        <button onClick={addMap} className="text-xs flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded transition-colors">
                            <Plus size={14} /> Add Map
                        </button>
                    )}
                </div>
                <p className="text-xs text-slate-500 mb-4">
                    For farms growing/raising FTL foods (other than eggs): Identify areas where FTL foods are grown, including location names and geographic coordinates.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {formData.farmMaps.map(map => (
                        <div key={map.id} className="border border-slate-200 rounded-lg p-4 bg-slate-50 relative group">
                            {isEditing && (
                                <button 
                                    onClick={() => removeMap(map.id)}
                                    className="absolute top-2 right-2 text-slate-400 hover:text-red-500 p-1 bg-white rounded-full border border-slate-200 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                >
                                    <Trash2 size={14} />
                                </button>
                            )}
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Field Name / ID</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={map.name}
                                            onChange={(e) => updateMap(map.id, 'name', e.target.value)}
                                            className="w-full p-2 border border-slate-300 rounded text-sm"
                                        />
                                    ) : (
                                        <div className="font-bold text-slate-900 text-sm">{map.name}</div>
                                    )}
                                </div>
                                
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Location Description</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={map.location}
                                            onChange={(e) => updateMap(map.id, 'location', e.target.value)}
                                            className="w-full p-2 border border-slate-300 rounded text-sm"
                                        />
                                    ) : (
                                        <div className="text-xs text-slate-600">{map.location}</div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Coordinates / Polygon</label>
                                    <FarmMapEditor 
                                        coordinates={map.coordinates}
                                        isEditing={isEditing}
                                        onChange={(newCoords) => updateMap(map.id, 'coordinates', newCoords)}
                                    />
                                    <div className="mt-2 text-[10px] text-slate-400 font-mono">
                                        {map.coordinates.length > 0 ? (
                                            <>
                                                Center: {map.coordinates[0].lat.toFixed(4)}, {map.coordinates[0].lng.toFixed(4)} <span className="mx-1">•</span> Points: {map.coordinates.length}
                                            </>
                                        ) : 'No points set'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {formData.farmMaps.length === 0 && (
                        <div className="col-span-2 p-8 text-center text-slate-400 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                            No farm maps defined.
                        </div>
                    )}
                </div>
            </div>

            {/* Point of Contact (§ 1.1315(a)(4)) */}
            <div className="bg-slate-900 text-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                    <Phone size={20} className="text-emerald-400" />
                    <h3 className="font-bold text-white">Regulatory Point of Contact (§ 1.1315(a)(4))</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Name</label>
                        {isEditing ? (
                            <input
                                type="text"
                                value={formData.pointOfContact.name}
                                onChange={(e) => handleContactChange('name', e.target.value)}
                                className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white text-sm focus:border-emerald-500 outline-none"
                            />
                        ) : (
                            <div className="font-bold text-lg">{formData.pointOfContact.name}</div>
                        )}
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Email</label>
                        {isEditing ? (
                            <input
                                type="email"
                                value={formData.pointOfContact.email}
                                onChange={(e) => handleContactChange('email', e.target.value)}
                                className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white text-sm focus:border-emerald-500 outline-none"
                            />
                        ) : (
                            <div className="text-slate-300">{formData.pointOfContact.email}</div>
                        )}
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Phone</label>
                        {isEditing ? (
                            <input
                                type="text"
                                value={formData.pointOfContact.phone}
                                onChange={(e) => handleContactChange('phone', e.target.value)}
                                className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white text-sm focus:border-emerald-500 outline-none"
                            />
                        ) : (
                            <div className="text-slate-300">{formData.pointOfContact.phone}</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}