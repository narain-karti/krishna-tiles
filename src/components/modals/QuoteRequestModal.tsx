import React, { useState } from 'react';
import { useProject } from '../../context/ProjectContext';
import { formatINR } from '../../utils/calculator';
import confetti from 'canvas-confetti';
import { 
  X, 
  Send, 
  MessageCircle, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Phone, 
  MapPin, 
  User, 
  Mail,
  ShieldCheck
} from 'lucide-react';

interface QuoteRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuoteRequestModal: React.FC<QuoteRequestModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { 
    project, 
    calculationResult, 
    submitQuoteRequest, 
    businessSettings 
  } = useProject();

  const [customerName, setCustomerName] = useState(project.customerName || '');
  const [customerPhone, setCustomerPhone] = useState(project.customerPhone || '');
  const [customerEmail, setCustomerEmail] = useState(project.customerEmail || '');
  const [locationCityOrPin, setLocationCityOrPin] = useState('Salem, Tamil Nadu');
  const [preferredContact, setPreferredContact] = useState<'whatsapp' | 'phone' | 'email'>('whatsapp');
  const [customerNotes, setCustomerNotes] = useState('');
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedQuoteId, setSubmittedQuoteId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      alert('Please provide your name and contact phone number.');
      return;
    }

    const roomsSnapshot = calculationResult.roomCalculations.flatMap(r => 
      r.surfacesCalculations.map(s => ({
        roomName: r.roomName,
        surfaceName: s.surfaceName,
        tileName: s.assignedProduct ? s.assignedProduct.name : 'Unassigned',
        areaSqFt: s.requiredAreaSqFt,
        dimensions: `${s.grossAreaSqFt} sq.ft gross`,
      }))
    );

    const materialsSnapshot = calculationResult.materialsSummary.map(m => ({
      sku: m.product.sku,
      name: m.product.name,
      areaSqFt: m.totalAreaSqFt,
      packsRequired: m.totalPacksRequired,
      unitPrice: m.product.pricePerUnit,
      subtotalINR: m.estimatedCostINR,
      isQuoteRequired: m.isQuoteRequired,
    }));

    const quote = submitQuoteRequest({
      projectId: project.id,
      projectTitle: project.title,
      customerName,
      customerPhone,
      customerEmail: customerEmail.trim() || undefined,
      locationCityOrPin,
      preferredContact,
      customerNotes,
      grandTotalINR: calculationResult.grandTotalINR,
      isCompleteEstimate: calculationResult.isComplete,
      totalAreaSqFt: calculationResult.totalAreaSqFt,
      totalRoomsCount: project.rooms.length,
      totalSurfacesCount: calculationResult.configuredSurfacesCount,
      materialsSnapshot,
      roomsSnapshot,
    });

    setSubmittedQuoteId(quote.id);
    setIsSubmitted(true);

    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {}
  };

  // Generate WhatsApp Direct URL
  const whatsappText = encodeURIComponent(
    `Hello Krishna Tiles, I have configured a tile plan on your Live Playground for "${project.title}".\n` +
    `Customer: ${customerName} (${customerPhone})\n` +
    `Location: ${locationCityOrPin}\n` +
    `Total Spaces: ${project.rooms.length} Rooms, ${calculationResult.configuredSurfacesCount} Surfaces (${calculationResult.totalAreaSqFt} sq.ft)\n` +
    `Estimated Material Total: ${formatINR(calculationResult.grandTotalINR)}\n` +
    `Please confirm current lot availability and prepare our official quote. Reference: ${submittedQuoteId || 'KT-WEB'}`
  );

  const whatsappUrl = `https://wa.me/${businessSettings.whatsappNumber}?text=${whatsappText}`;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-modal border border-border overflow-hidden relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 text-muted hover:text-charcoal rounded-full hover:bg-stone-light/50 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Header */}
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-brass block mb-1">
                Official Estimate Request
              </span>
              <h3 className="text-xl font-serif font-bold text-charcoal">
                Connect with Krishna Tiles Showroom
              </h3>
              <p className="text-xs text-muted mt-1">
                Our Salem & Kandanoor product specialists will verify tile lot availability, batch sizing, and prepare your formal proposal.
              </p>
            </div>

            {/* Project Summary Banner */}
            <div className="p-3.5 bg-ivory rounded-2xl border border-border flex items-center justify-between text-xs">
              <div>
                <span className="font-semibold text-charcoal block">{project.title}</span>
                <span className="text-muted">
                  {project.rooms.length} Rooms • {calculationResult.configuredSurfacesCount} Surfaces • {calculationResult.totalAreaSqFt} sq.ft
                </span>
              </div>
              <div className="text-right">
                <span className="text-muted block text-[10px] uppercase">Estimated Rupee Total</span>
                <span className="font-serif font-bold text-sm text-charcoal">
                  {formatINR(calculationResult.grandTotalINR)}
                </span>
              </div>
            </div>

            {/* Customer Inputs */}
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-charcoal block mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. S. Ramanathan"
                    className="w-full pl-9 pr-3 py-2 border border-border rounded-xl bg-ivory-light text-charcoal focus:outline-none focus:ring-1 focus:ring-brass"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-charcoal block mb-1">
                    Phone / Mobile Number *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="e.g. 9842109876"
                      className="w-full pl-9 pr-3 py-2 border border-border rounded-xl bg-ivory-light text-charcoal focus:outline-none focus:ring-1 focus:ring-brass"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-charcoal block mb-1">
                    Site Location / Delivery PIN
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                    <input
                      type="text"
                      value={locationCityOrPin}
                      onChange={(e) => setLocationCityOrPin(e.target.value)}
                      placeholder="e.g. Salem 636005"
                      className="w-full pl-9 pr-3 py-2 border border-border rounded-xl bg-ivory-light text-charcoal focus:outline-none focus:ring-1 focus:ring-brass"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="font-semibold text-charcoal block mb-1">
                  Email Address (Optional)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="name@gmail.com"
                    className="w-full pl-9 pr-3 py-2 border border-border rounded-xl bg-ivory-light text-charcoal focus:outline-none focus:ring-1 focus:ring-brass"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-charcoal block mb-1">
                  Preferred Contact Channel
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'whatsapp', label: 'WhatsApp' },
                    { id: 'phone', label: 'Direct Call' },
                    { id: 'email', label: 'Email' },
                  ].map((ch) => (
                    <button
                      key={ch.id}
                      type="button"
                      onClick={() => setPreferredContact(ch.id as any)}
                      className={`py-2 text-center rounded-xl border text-xs capitalize transition-colors ${
                        preferredContact === ch.id
                          ? 'bg-charcoal text-ivory border-charcoal font-semibold'
                          : 'bg-white text-muted hover:text-charcoal border-border'
                      }`}
                    >
                      {ch.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-semibold text-charcoal block mb-1">
                  Special Notes or Queries
                </label>
                <textarea
                  rows={2}
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  placeholder="e.g. Need delivery to site by next Thursday, interested in matching granite skirting..."
                  className="w-full px-3 py-2 border border-border rounded-xl bg-ivory-light text-charcoal focus:outline-none focus:ring-1 focus:ring-brass"
                />
              </div>
            </div>

            {/* Disclaimer */}
            <div className="flex items-start space-x-2 text-[11px] text-muted">
              <ShieldCheck className="w-4 h-4 text-brass shrink-0 mt-0.5" />
              <span>
                By submitting, your tile selections are shared directly with Krishna Tiles. Physical stock & shade variations will be confirmed prior to billing.
              </span>
            </div>

            {/* Submit Action */}
            <div className="flex items-center space-x-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-1/3 py-2.5 rounded-xl border border-border text-muted hover:text-charcoal text-xs font-medium"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-brass hover:bg-brass-light text-charcoal font-semibold text-xs shadow-md transition-all flex items-center justify-center space-x-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Quotation Request</span>
              </button>
            </div>
          </form>
        ) : (
          /* Submission Confirmation View */
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-muted">
                Reference ID: {submittedQuoteId}
              </span>
              <h3 className="text-2xl font-serif font-bold text-charcoal mt-1">
                Quotation Request Received!
              </h3>
              <p className="text-xs text-muted max-w-md mx-auto mt-2">
                Thank you, {customerName}. Your tile plan has been dispatched to Krishna Tiles & Granites (Salem / Kandanoor). Our showroom sales desk will reach out via {preferredContact}.
              </p>
            </div>

            {/* Instant WhatsApp Connect Button */}
            <div className="pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-2xl text-xs shadow-lg transition-transform hover:scale-105"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Connect via WhatsApp Now</span>
              </a>
              <span className="block text-[11px] text-muted mt-2">
                Opens pre-filled message with your project specifications
              </span>
            </div>

            <div className="pt-4">
              <button
                onClick={onClose}
                className="text-xs text-muted hover:text-charcoal underline"
              >
                Return to Tile Playground
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
