import React, { useState } from 'react';
import { useProject } from '../../context/ProjectContext';
import { Product, BusinessSettings, TileCategory, TileFinish, TileMaterial, PriceBasis, QuoteRequestSubmission } from '../../types';
import { formatINR } from '../../utils/calculator';
import { 
  Package, 
  TrendingUp, 
  Users, 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Check, 
  AlertCircle, 
  ArrowLeft,
  DollarSign,
  Phone,
  MessageCircle,
  FileSpreadsheet,
  Save
} from 'lucide-react';

interface AdminDashboardProps {
  onBackToStore: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToStore }) => {
  const {
    products,
    addOrUpdateProduct,
    deleteProduct,
    bulkUpdatePrices,
    quoteRequests,
    updateQuoteStatus,
    businessSettings,
    updateBusinessSettings,
  } = useProject();

  const [activeTab, setActiveTab] = useState<'catalogue' | 'pricing' | 'leads' | 'settings'>('catalogue');

  // Search in catalogue
  const [catalogueSearch, setCatalogueSearch] = useState('');
  
  // Product Edit Modal
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isNewProduct, setIsNewProduct] = useState(false);

  // Bulk Price Form
  const [bulkPercent, setBulkPercent] = useState<number>(5);
  const [bulkSuccessMsg, setBulkSuccessMsg] = useState('');

  // Business Settings Form
  const [settingsForm, setSettingsForm] = useState<BusinessSettings>(businessSettings);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Filter catalogue
  const filteredCatalogue = products.filter(p => {
    if (!catalogueSearch.trim()) return true;
    const q = catalogueSearch.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.category.includes(q);
  });

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    addOrUpdateProduct(editingProduct);
    setEditingProduct(null);
  };

  const handleBulkUpdate = () => {
    if (confirm(`Apply a ${bulkPercent > 0 ? '+' : ''}${bulkPercent}% price change to all catalogue products?`)) {
      bulkUpdatePrices(bulkPercent);
      setBulkSuccessMsg(`Successfully updated all prices by ${bulkPercent}%`);
      setTimeout(() => setBulkSuccessMsg(''), 3000);
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateBusinessSettings(settingsForm);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2500);
  };

  const createBlankProduct = (): Product => ({
    id: 'prod-' + Date.now(),
    name: 'New Architectural Tile',
    sku: 'KT-' + Math.floor(1000 + Math.random() * 9000),
    brand: 'Krishna Tiles',
    category: 'floor',
    material: 'vitrified',
    finish: 'polished',
    patternType: 'marble',
    dimensions: { widthMm: 600, heightMm: 600, thicknessMm: 9 },
    primaryImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
    priceBasis: 'sqft',
    pricePerUnit: 90,
    packCoverageSqFt: 15.5,
    piecesPerPack: 4,
    minOrderQty: 20,
    available: true,
    isSampleRecord: false,
    description: 'Modern premium vitrified tile with high abrasion resistance.',
    applications: ['living', 'bedroom'],
    color: 'Ivory White',
    colorHex: '#FAF9F6',
    accentColorHex: '#B89A63',
  });

  return (
    <div className="min-h-screen bg-[#F6F4EE] text-charcoal select-none flex flex-col font-sans">
      {/* Admin Top Navigation */}
      <header className="bg-charcoal text-ivory px-6 py-3.5 flex items-center justify-between border-b border-border/20 shadow-md">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBackToStore}
            className="flex items-center space-x-1.5 text-xs text-stone hover:text-ivory bg-charcoal-soft px-3 py-1.5 rounded-lg border border-charcoal-muted transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Live Store</span>
          </button>

          <div className="h-5 w-[1px] bg-charcoal-muted" />

          <div>
            <h1 className="text-sm font-serif font-bold tracking-wide">
              Krishna Tiles Admin Portal
            </h1>
            <p className="text-[10px] text-muted-light">
              Showroom Management & Inventory Engine • Kandanoor / Salem Region
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center space-x-1 bg-charcoal-soft p-1 rounded-xl border border-charcoal-muted/40 text-xs">
          {[
            { id: 'catalogue', label: 'Catalogue & Stock', icon: Package },
            { id: 'pricing', label: 'Pricing Admin', icon: DollarSign },
            { id: 'leads', label: `Quotes & Leads (${quoteRequests.length})`, icon: Users },
            { id: 'settings', label: 'Business Profile', icon: Settings },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                  isActive
                    ? 'bg-brass text-charcoal font-semibold shadow-sm'
                    : 'text-stone hover:text-ivory'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-8 max-w-7xl mx-auto w-full">
        
        {/* TAB 1: Catalogue & Stock Management */}
        {activeTab === 'catalogue' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-serif font-bold text-charcoal">
                  Showroom Tile Catalogue ({products.length} Products)
                </h2>
                <p className="text-xs text-muted mt-0.5">
                  Real-time updates directly impact product cards, live playground textures, and estimate calculations.
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                  <input
                    type="text"
                    value={catalogueSearch}
                    onChange={(e) => setCatalogueSearch(e.target.value)}
                    placeholder="Search SKU or name..."
                    className="pl-9 pr-4 py-2 bg-white border border-border rounded-xl text-xs text-charcoal focus:outline-none focus:ring-1 focus:ring-brass"
                  />
                </div>

                <button
                  onClick={() => {
                    setIsNewProduct(true);
                    setEditingProduct(createBlankProduct());
                  }}
                  className="flex items-center space-x-1.5 px-4 py-2 bg-brass hover:bg-brass-light text-charcoal font-semibold text-xs rounded-xl shadow-sm transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Product</span>
                </button>
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-subtle">
              <table className="w-full text-left text-xs">
                <thead className="bg-porcelain border-b border-border text-muted font-medium uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-3.5">Tile Product & SKU</th>
                    <th className="p-3.5">Dimensions</th>
                    <th className="p-3.5">Category & Finish</th>
                    <th className="p-3.5">Rate / Basis</th>
                    <th className="p-3.5">Pack Coverage</th>
                    <th className="p-3.5 text-center">Stock Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredCatalogue.map((prod) => (
                    <tr key={prod.id} className="hover:bg-ivory/30">
                      <td className="p-3.5 flex items-center space-x-3">
                        <div 
                          className="w-10 h-10 rounded-lg border border-border shadow-inner shrink-0"
                          style={{
                            backgroundColor: prod.colorHex,
                            backgroundImage: `radial-gradient(${prod.accentColorHex || '#000'} 1px, transparent 1px)`,
                            backgroundSize: '8px 8px',
                          }}
                        />
                        <div>
                          <div className="font-semibold text-charcoal">{prod.name}</div>
                          <div className="text-[10px] text-muted font-mono">{prod.sku} • {prod.brand}</div>
                          {prod.isSampleRecord && (
                            <span className="text-[9px] text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                              Sample Data (Awaiting Verification)
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="p-3.5 font-mono text-muted">
                        {prod.dimensions.widthMm} × {prod.dimensions.heightMm} mm
                        <span className="block text-[10px] text-muted">({prod.dimensions.thicknessMm || 9}mm thk)</span>
                      </td>

                      <td className="p-3.5">
                        <span className="capitalize font-medium text-charcoal">{prod.category}</span>
                        <span className="text-muted block capitalize">{prod.finish} • {prod.material}</span>
                      </td>

                      <td className="p-3.5 font-bold text-charcoal">
                        {prod.priceBasis === 'quote' ? (
                          <span className="text-amber-700 font-normal">Price on Request</span>
                        ) : (
                          <span>{formatINR(prod.pricePerUnit || 0)} <span className="text-[10px] font-normal text-muted">/{prod.priceBasis}</span></span>
                        )}
                      </td>

                      <td className="p-3.5 font-mono text-muted">
                        {prod.packCoverageSqFt ? `${prod.packCoverageSqFt} sq.ft/box` : '—'}
                      </td>

                      <td className="p-3.5 text-center">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          prod.available ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {prod.available ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </td>

                      <td className="p-3.5 text-right space-x-1">
                        <button
                          onClick={() => {
                            setIsNewProduct(false);
                            setEditingProduct({ ...prod });
                          }}
                          className="p-1.5 text-muted hover:text-charcoal hover:bg-stone-light/50 rounded-lg transition-colors"
                          title="Edit tile specifications"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Remove "${prod.name}" from catalogue?`)) {
                              deleteProduct(prod.id);
                            }
                          }}
                          className="p-1.5 text-muted hover:text-red-600 hover:bg-stone-light/50 rounded-lg transition-colors"
                          title="Delete tile"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: Pricing Administration */}
        {activeTab === 'pricing' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-serif font-bold text-charcoal">
                Pricing Engine Administration
              </h2>
              <p className="text-xs text-muted mt-0.5">
                Apply bulk adjustments, review unconfirmed lots, and audit pricing updates.
              </p>
            </div>

            {/* Bulk Update Card */}
            <div className="bg-white p-6 rounded-2xl border border-border shadow-subtle space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-charcoal uppercase tracking-wider">
                    Bulk Price Adjustment
                  </h3>
                  <p className="text-xs text-muted mt-0.5">
                    Adjust all active pricing records by a uniform percentage (e.g. for supplier rate changes or seasonal discounts).
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <input
                    type="number"
                    value={bulkPercent}
                    onChange={(e) => setBulkPercent(parseFloat(e.target.value) || 0)}
                    className="w-24 px-3 py-1.5 border border-border rounded-lg text-xs font-semibold text-charcoal text-center"
                  />
                  <span className="text-xs font-medium">%</span>
                  <button
                    onClick={handleBulkUpdate}
                    className="px-4 py-2 bg-charcoal hover:bg-charcoal-soft text-ivory font-semibold text-xs rounded-xl shadow-sm transition-colors"
                  >
                    Apply Bulk Change
                  </button>
                </div>
              </div>

              {bulkSuccessMsg && (
                <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs flex items-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>{bulkSuccessMsg}</span>
                </div>
              )}
            </div>

            {/* Products Requiring Pricing Review */}
            <div className="bg-white p-6 rounded-2xl border border-border shadow-subtle space-y-4">
              <h3 className="text-sm font-semibold text-charcoal uppercase tracking-wider flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>Tiles Requiring Showroom Price Confirmation (Price on Request)</span>
              </h3>

              <div className="divide-y divide-border/60">
                {products.filter(p => p.priceBasis === 'quote' || !p.pricePerUnit).map(p => (
                  <div key={p.id} className="py-3 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-xs text-charcoal">{p.name} ({p.sku})</span>
                      <span className="text-xs text-muted block">{p.brand} • {p.dimensions.widthMm} × {p.dimensions.heightMm} mm</span>
                    </div>

                    <button
                      onClick={() => {
                        setIsNewProduct(false);
                        setEditingProduct({ ...p, priceBasis: 'sqft', pricePerUnit: 120 });
                      }}
                      className="px-3 py-1.5 text-xs font-semibold bg-brass/20 text-brass-dark hover:bg-brass hover:text-charcoal rounded-lg transition-colors"
                    >
                      Assign Confirmed Price
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Leads & Quote Pipeline */}
        {activeTab === 'leads' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-serif font-bold text-charcoal">
                  Customer Quotation Enquiries ({quoteRequests.length})
                </h2>
                <p className="text-xs text-muted mt-0.5">
                  Leads generated from the Live Tile Playground awaiting showroom staff follow-up.
                </p>
              </div>
            </div>

            {quoteRequests.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-2xl border border-border text-muted">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-30 text-charcoal" />
                <p className="text-base font-serif">No quotes submitted yet.</p>
                <p className="text-xs mt-1">When customers submit quote requests from the Playground, they will appear here in the sales pipeline.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {quoteRequests.map((q) => (
                  <div key={q.id} className="bg-white p-6 rounded-2xl border border-border shadow-subtle space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border/60">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-mono font-semibold bg-ivory text-charcoal px-2 py-0.5 rounded">
                            {q.id}
                          </span>
                          <h3 className="text-base font-bold text-charcoal">{q.customerName}</h3>
                        </div>
                        <div className="text-xs text-muted mt-1 space-x-3">
                          <span>Phone: <strong>{q.customerPhone}</strong></span>
                          <span>•</span>
                          <span>Location: {q.locationCityOrPin}</span>
                          <span>•</span>
                          <span>Date: {new Date(q.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {/* Status Dropdown */}
                      <div className="flex items-center space-x-2">
                        <label className="text-xs text-muted font-medium">Status:</label>
                        <select
                          value={q.status}
                          onChange={(e) => updateQuoteStatus(q.id, e.target.value as any)}
                          className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-border bg-ivory focus:outline-none focus:ring-1 focus:ring-brass"
                        >
                          <option value="new">New Lead</option>
                          <option value="contacted">Contacted Customer</option>
                          <option value="quote_prepared">Quote Prepared</option>
                          <option value="awaiting_customer">Awaiting Customer</option>
                          <option value="confirmed">Confirmed & Ordered</option>
                          <option value="closed">Closed</option>
                        </select>
                      </div>
                    </div>

                    {/* Project Specifications */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs bg-porcelain p-4 rounded-xl border border-border/60">
                      <div>
                        <span className="text-[10px] uppercase font-semibold text-muted tracking-wider block">Project Name</span>
                        <span className="font-semibold text-charcoal text-sm">{q.projectTitle}</span>
                        <span className="text-muted block mt-0.5">{q.totalRoomsCount} Rooms • {q.totalSurfacesCount} Surfaces</span>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-semibold text-muted tracking-wider block">Scope & Area</span>
                        <span className="font-mono font-semibold text-charcoal">{q.totalAreaSqFt} sq.ft</span>
                        <span className="text-muted block mt-0.5">Contact via: <strong className="uppercase">{q.preferredContact}</strong></span>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] uppercase font-semibold text-muted tracking-wider block">Indicative Value</span>
                        <span className="text-lg font-serif font-bold text-charcoal font-mono">{formatINR(q.grandTotalINR)}</span>
                      </div>
                    </div>

                    {/* Customer Notes */}
                    {q.customerNotes && (
                      <div className="text-xs bg-ivory/60 p-3 rounded-lg border border-border text-charcoal">
                        <strong>Customer Note:</strong> {q.customerNotes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: Business Settings */}
        {activeTab === 'settings' && (
          <form onSubmit={handleSaveSettings} className="bg-white p-8 rounded-2xl border border-border shadow-subtle space-y-6 max-w-2xl">
            <div>
              <h2 className="text-2xl font-serif font-bold text-charcoal">
                Store & Business Profile Settings
              </h2>
              <p className="text-xs text-muted mt-0.5">
                Configures public showroom name, addresses, contact numbers, and default quotation terms.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-charcoal block mb-1">Public Business Name</label>
                <input
                  type="text"
                  value={settingsForm.businessName}
                  onChange={(e) => setSettingsForm({ ...settingsForm, businessName: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-xl bg-ivory-light text-charcoal focus:ring-1 focus:ring-brass"
                />
              </div>

              <div>
                <label className="font-semibold text-charcoal block mb-1">Tagline</label>
                <input
                  type="text"
                  value={settingsForm.tagline}
                  onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-xl bg-ivory-light text-charcoal"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-charcoal block mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={settingsForm.phone}
                    onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-xl bg-ivory-light text-charcoal"
                  />
                </div>

                <div>
                  <label className="font-semibold text-charcoal block mb-1">WhatsApp Number (e.g. 919443212345)</label>
                  <input
                    type="text"
                    value={settingsForm.whatsappNumber}
                    onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-xl bg-ivory-light text-charcoal"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-charcoal block mb-1">Salem / Kandanoor Showroom Address</label>
                <textarea
                  rows={2}
                  value={settingsForm.address}
                  onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-xl bg-ivory-light text-charcoal"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-charcoal block mb-1">GSTIN</label>
                  <input
                    type="text"
                    value={settingsForm.gstin}
                    onChange={(e) => setSettingsForm({ ...settingsForm, gstin: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-xl bg-ivory-light text-charcoal font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold text-charcoal block mb-1">Default Cutting Wastage %</label>
                  <input
                    type="number"
                    value={settingsForm.defaultWastagePercentage}
                    onChange={(e) => setSettingsForm({ ...settingsForm, defaultWastagePercentage: parseInt(e.target.value) || 10 })}
                    className="w-full px-3 py-2 border border-border rounded-xl bg-ivory-light text-charcoal font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border">
              {settingsSaved ? (
                <span className="text-xs text-emerald-700 font-semibold flex items-center">
                  <Check className="w-4 h-4 mr-1" /> Business settings saved successfully!
                </span>
              ) : <div />}

              <button
                type="submit"
                className="flex items-center space-x-1.5 px-6 py-2.5 bg-brass hover:bg-brass-light text-charcoal font-semibold text-xs rounded-xl shadow-md transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>
        )}

      </main>

      {/* Product Edit / Create Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSaveProduct} className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-modal border border-border space-y-4 max-h-[90vh] overflow-y-auto text-xs">
            <h3 className="text-xl font-serif font-bold text-charcoal">
              {isNewProduct ? 'Add New Product to Catalogue' : 'Edit Tile Record'}
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-charcoal block mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full px-3 py-1.5 border border-border rounded-lg bg-ivory-light"
                />
              </div>

              <div>
                <label className="font-semibold text-charcoal block mb-1">SKU *</label>
                <input
                  type="text"
                  required
                  value={editingProduct.sku}
                  onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                  className="w-full px-3 py-1.5 border border-border rounded-lg bg-ivory-light font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="font-semibold text-charcoal block mb-1">Category</label>
                <select
                  value={editingProduct.category}
                  onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value as any })}
                  className="w-full px-2 py-1.5 border border-border rounded-lg bg-ivory-light"
                >
                  <option value="floor">Floor</option>
                  <option value="wall">Wall</option>
                  <option value="elevation">Elevation</option>
                  <option value="outdoor">Outdoor</option>
                  <option value="mosaic">Mosaic</option>
                  <option value="border">Border</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-charcoal block mb-1">Material</label>
                <select
                  value={editingProduct.material}
                  onChange={(e) => setEditingProduct({ ...editingProduct, material: e.target.value as any })}
                  className="w-full px-2 py-1.5 border border-border rounded-lg bg-ivory-light"
                >
                  <option value="vitrified">Vitrified</option>
                  <option value="ceramic">Ceramic</option>
                  <option value="porcelain">Porcelain</option>
                  <option value="slate">Slate</option>
                  <option value="granite">Granite</option>
                  <option value="marble">Marble</option>
                  <option value="terracotta">Terracotta</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-charcoal block mb-1">Finish</label>
                <select
                  value={editingProduct.finish}
                  onChange={(e) => setEditingProduct({ ...editingProduct, finish: e.target.value as any })}
                  className="w-full px-2 py-1.5 border border-border rounded-lg bg-ivory-light"
                >
                  <option value="polished">Polished</option>
                  <option value="glossy">Glossy</option>
                  <option value="matte">Matte</option>
                  <option value="satin">Satin</option>
                  <option value="rustic">Rustic</option>
                  <option value="flamed">Flamed</option>
                  <option value="carving">Carving</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="font-semibold text-charcoal block mb-1">Width (mm)</label>
                <input
                  type="number"
                  value={editingProduct.dimensions.widthMm}
                  onChange={(e) => setEditingProduct({
                    ...editingProduct,
                    dimensions: { ...editingProduct.dimensions, widthMm: parseInt(e.target.value) || 600 }
                  })}
                  className="w-full px-3 py-1.5 border border-border rounded-lg bg-ivory-light"
                />
              </div>

              <div>
                <label className="font-semibold text-charcoal block mb-1">Height (mm)</label>
                <input
                  type="number"
                  value={editingProduct.dimensions.heightMm}
                  onChange={(e) => setEditingProduct({
                    ...editingProduct,
                    dimensions: { ...editingProduct.dimensions, heightMm: parseInt(e.target.value) || 600 }
                  })}
                  className="w-full px-3 py-1.5 border border-border rounded-lg bg-ivory-light"
                />
              </div>

              <div>
                <label className="font-semibold text-charcoal block mb-1">Price Basis</label>
                <select
                  value={editingProduct.priceBasis}
                  onChange={(e) => setEditingProduct({ ...editingProduct, priceBasis: e.target.value as any })}
                  className="w-full px-2 py-1.5 border border-border rounded-lg bg-ivory-light"
                >
                  <option value="sqft">Per Sq.Ft</option>
                  <option value="sqm">Per Sq.Metre</option>
                  <option value="pack">Per Box / Pack</option>
                  <option value="piece">Per Piece</option>
                  <option value="quote">Price on Request</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-charcoal block mb-1">Unit Rate (₹ INR)</label>
                <input
                  type="number"
                  value={editingProduct.pricePerUnit || ''}
                  onChange={(e) => setEditingProduct({
                    ...editingProduct,
                    pricePerUnit: parseFloat(e.target.value) || undefined
                  })}
                  disabled={editingProduct.priceBasis === 'quote'}
                  className="w-full px-3 py-1.5 border border-border rounded-lg bg-ivory-light font-mono"
                  placeholder={editingProduct.priceBasis === 'quote' ? 'Price on Request' : '110'}
                />
              </div>

              <div>
                <label className="font-semibold text-charcoal block mb-1">Pack Coverage (Sq.Ft)</label>
                <input
                  type="number"
                  step="0.1"
                  value={editingProduct.packCoverageSqFt || ''}
                  onChange={(e) => setEditingProduct({
                    ...editingProduct,
                    packCoverageSqFt: parseFloat(e.target.value) || undefined
                  })}
                  className="w-full px-3 py-1.5 border border-border rounded-lg bg-ivory-light font-mono"
                  placeholder="15.5"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4 border-t border-border">
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="px-4 py-2 border border-border rounded-xl text-muted hover:text-charcoal"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-brass hover:bg-brass-light text-charcoal font-semibold rounded-xl shadow-sm"
              >
                Save Product
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
