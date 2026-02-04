import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Copy, Check } from 'lucide-react';

const SuccessPopup = ({ isOpen, message, onClose }) => {
  const [copied, setCopied] = useState(false);

  // Extract ID from message if it's there
  const ticketIdMatch = message.match(/Ticket ID is: ([^.]+)/);
  const ticketId = ticketIdMatch ? ticketIdMatch[1].trim() : null;

  const copyToClipboard = () => {
    if (ticketId) {
      navigator.clipboard.writeText(ticketId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50 bg-slate-900/40 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-[2.5rem] p-10 shadow-2xl flex flex-col items-center text-center max-w-md w-full mx-4 border border-slate-100"
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-primary-50 w-20 h-20 rounded-3xl flex items-center justify-center mb-6 text-primary-600 shadow-inner">
              <CheckCircle size={40} strokeWidth={2.5} />
            </div>

            <h3 className="text-3xl font-extrabold text-secondary-900 mb-3 font-outfit tracking-tight">Success!</h3>
            <p className="text-secondary-600 mb-8 font-medium leading-relaxed">
              {message.split(ticketId || "")[0]}
              {ticketId && <span className="text-primary-600 font-bold font-mono bg-primary-50 px-2 py-0.5 rounded-md mx-1">{ticketId}</span>}
              {message.split(ticketId || "")[1]}
            </p>

            {ticketId && (
              <button
                onClick={copyToClipboard}
                className={`w-full mb-4 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all group ${copied ? 'bg-green-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                {copied ? (
                  <><Check size={18} /> Copied to Clipboard</>
                ) : (
                  <><Copy size={18} className="group-hover:scale-110 transition-transform" /> Copy Ticket ID</>
                )}
              </button>
            )}

            <button
              onClick={onClose}
              className="w-full py-4 bg-secondary-900 text-white rounded-2xl font-bold hover:bg-secondary-800 transition-all shadow-lg hover:shadow-xl shadow-secondary-900/10 active:scale-[0.98]"
            >
              Done
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SuccessPopup;
