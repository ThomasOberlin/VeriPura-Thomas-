
import React, { useState } from 'react';
import { FileText, Download, Clock, ShieldAlert, Check, Search, Mail, Eye, ChevronDown, ChevronRight, X } from 'lucide-react';
import { useAppContext } from '../App';
import { Product, TraceabilityEvent } from '../types';

export default function Reports() {
    const { products } = useAppContext();
    const [isGenerating, setIsGenerating] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [lastReport, setLastReport] = useState<string | null>(null);

    // Helper to escape CSV fields
    const safeCSV = (str: string | number | undefined) => {
        if (str === undefined || str === null) return '';
        const stringValue = String(str);
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
            return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
    };

    const generateSpreadsheet = () => {
        setIsGenerating(true);
        
        // FSMA 204 Required Columns (simplified for demo)
        const headers = [
            "Traceability Lot Code",
            "Product Description",
            "Event Type (CTE)",
            "Date",
            "Time",
            "Location Description",
            "Location Contact",
            "Reference Document Type",
            "Reference Document Number",
            "Quantity",
            "Unit of Measure",
            "Related / Source TLC",
            "Data Completeness Status"
        ];

        const rows: string[] = [];

        // Flatten the data: Iterate Products -> Iterate Events
        products.forEach((product: Product) => {
            product.events.forEach((event: TraceabilityEvent) => {
                const row = [
                    safeCSV(event.kdeData?.tlcAssigned || product.tlc), // TLC
                    safeCSV(product.name), // Product
                    safeCSV(event.type), // CTE
                    safeCSV(event.date), // Date
                    safeCSV("12:00:00"), // Time (Mocked as standard generic time)
                    safeCSV(event.location), // Location Desc
                    safeCSV(event.performer), // Contact/Performer
                    safeCSV(event.kdeData?.referenceDocType || "Internal Log"), // Ref Doc Type
                    safeCSV(event.kdeData?.referenceDocNum || event.documents[0]?.id || "N/A"), // Ref Doc Num
                    safeCSV(product.quantity), // Qty (Snapshot of product qty)
                    safeCSV(product.uom), // UOM
                    safeCSV(event.kdeData?.tlcSource || "N/A"), // Source
                    safeCSV(event.status) // Status
                ];
                rows.push(row.join(','));
            });
        });

        const csvContent = [headers.join(','), ...rows].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const fileName = `FDA_Traceability_Report_${new Date().toISOString().split('T')[0]}.csv`;

        // Simulate processing time for UX, then trigger download
        setTimeout(() => {
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            setLastReport(fileName);
            setIsGenerating(false);
            setShowPreview(false);
        }, 1500);
    };

    return (
        <div className="space-y-6 relative">
            <h1 className="text-2xl font-bold text-slate-900">FDA Report Generator</h1>
            <p className="text-slate-500">Generate FSMA 204 compliant traceability spreadsheets for FDA requests.</p>

            {/* Critical Action Card */}
            <div id="card-24h-response" className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border border-red-200 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-red-100 rounded-full text-red-600">
                        <ShieldAlert size={24} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-red-900">Regulatory Request (24-Hour Response)</h2>
                        <p className="text-red-700 text-sm mt-1 max-w-xl">
                            Use this tool to generate the mandatory electronic sortable spreadsheet containing all relevant traceability information within 24 hours of an FDA request.
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button 
                        id="btn-preview"
                        onClick={() => setShowPreview(true)}
                        className="bg-white border border-red-200 text-red-700 hover:bg-red-50 px-4 py-3 rounded-lg font-bold shadow-sm flex items-center gap-2"
                    >
                        <Eye size={18} /> Preview
                    </button>
                    <button 
                        id="btn-24h-start"
                        onClick={generateSpreadsheet}
                        disabled={isGenerating}
                        className="whitespace-nowrap bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold shadow-sm flex items-center gap-2 disabled:opacity-75 disabled:cursor-wait transition-all"
                    >
                        {isGenerating ? "Processing..." : <><Clock size={18} /> Generate 24h Package</>}
                    </button>
                </div>
            </div>

            {/* Preview Section */}
            {showPreview && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in slide-in-from-top-4">
                    <div className="bg-slate-50 p-4 border-b border-slate-200 flex justify-between items-center">
                        <h3 className="font-bold text-slate-700">Preview: {products.length} Traceability Chains Found</h3>
                        <button onClick={() => setShowPreview(false)} className="text-slate-400 hover:text-slate-600"><X size={18}/></button>
                    </div>
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 text-slate-500 text-left">
                            <tr>
                                <th className="px-4 py-2">TLC</th>
                                <th className="px-4 py-2">Product</th>
                                <th className="px-4 py-2">Ref Document</th>
                                <th className="px-4 py-2">Completeness</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.slice(0, 3).map((p, i) => (
                                <tr key={p.id} className="border-b border-slate-100">
                                    <td className="px-4 py-3 font-mono text-xs">{p.tlc}</td>
                                    <td className="px-4 py-3">{p.name}</td>
                                    <td className="px-4 py-3 text-slate-500">{p.events[0]?.kdeData?.referenceDocNum || "N/A"}</td>
                                    <td className="px-4 py-3 text-emerald-600 font-bold">{p.completeness}%</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Standard Config */}
            <div id="report-filters" className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <h2 className="font-bold text-slate-800 mb-4">Search Criteria</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div>
                         <label className="block text-sm font-medium text-slate-700 mb-1">Product / TLC</label>
                         <div className="relative">
                            <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                            <input id="input-product-search" type="text" placeholder="e.g. Mangoes" className="w-full pl-9 rounded-lg border-slate-300" />
                         </div>
                    </div>
                    <div>
                         <label className="block text-sm font-medium text-slate-700 mb-1">Date Range</label>
                         <select id="input-date-range" className="w-full rounded-lg border-slate-300">
                             <option>Last 30 Days</option>
                             <option>Last 3 Months</option>
                             <option>Custom Range</option>
                         </select>
                    </div>
                    <div className="flex items-end">
                        <label className="flex items-center gap-2 mb-3 cursor-pointer">
                            <input id="check-include-docs" type="checkbox" className="rounded text-emerald-600 focus:ring-emerald-500" defaultChecked />
                            <span className="text-sm text-slate-700 font-medium">Include Linked Documents</span>
                        </label>
                    </div>
                </div>
            </div>

            {/* Recent Reports */}
            <div id="recent-reports-list" className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-200 bg-slate-50 font-medium text-sm text-slate-500">
                    Generated Reports
                </div>
                <div className="divide-y divide-slate-100">
                    {lastReport && (
                        <div className="p-4 flex items-center justify-between bg-emerald-50/50">
                             <div className="flex items-center gap-3">
                                <div className="bg-emerald-100 text-emerald-700 p-2 rounded">
                                    <Check size={18} />
                                </div>
                                <div>
                                    <p className="font-medium text-slate-900">{lastReport}</p>
                                    <p className="text-xs text-slate-500">Ready for download or email</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button 
                                    id="btn-email-fda"
                                    onClick={() => setShowEmailModal(true)}
                                    className="text-emerald-700 hover:text-emerald-900 font-medium text-sm flex items-center gap-1"
                                >
                                    <Mail size={16}/> Email to FDA
                                </button>
                                <button className="text-slate-500 hover:text-slate-700">
                                    <Download size={18} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Email Modal */}
            {showEmailModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-in zoom-in-95">
                        <h2 className="text-lg font-bold mb-4">Send to FDA Inspector</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Inspector Email</label>
                                <input type="email" className="w-full rounded-lg border-slate-300" placeholder="inspector@fda.hhs.gov" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Message</label>
                                <textarea className="w-full rounded-lg border-slate-300 h-24" defaultValue="Attached is the requested traceability package for Ref #FDA-2024-001." />
                            </div>
                            <div className="bg-slate-50 p-3 rounded text-xs text-slate-500">
                                Attachment: {lastReport} (1.2 MB)
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <button onClick={() => setShowEmailModal(false)} className="px-4 py-2 text-slate-600 font-medium">Cancel</button>
                                <button 
                                    id="btn-send-email"
                                    onClick={() => setShowEmailModal(false)}
                                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700"
                                >
                                    Send Securely
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
