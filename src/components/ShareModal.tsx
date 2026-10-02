import React, { useState } from 'react';
import { Drama } from '../types/drama';
import { X, Copy, Check, MessageSquare, Send, Share2 } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  drama: Drama;
  episodeNumber: number;
  onToast: (msg: string) => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  drama,
  episodeNumber,
  onToast
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const shareUrl = `${window.location.origin}/#drama=${drama.id}&ep=${episodeNumber}`;

  const handleCopy = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
      }
      setCopied(true);
      onToast('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(true);
      onToast('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleSocialShare = (platform: string) => {
    const text = encodeURIComponent(`Watch "${drama.title}" Ep.${episodeNumber} on DramaBox! Highly recommended vertical drama.`);
    const url = encodeURIComponent(shareUrl);

    let link = '';
    if (platform === 'whatsapp') {
      link = `https://api.whatsapp.com/send?text=${text}%20${url}`;
    } else if (platform === 'twitter') {
      link = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
    } else if (platform === 'telegram') {
      link = `https://t.me/share/url?url=${url}&text=${text}`;
    }

    if (link) {
      window.open(link, '_blank', 'noopener,noreferrer');
    }
    onToast(`Shared via ${platform}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-sm bg-slate-900 border border-white/10 rounded-2xl p-5 shadow-2xl animate-fade-in text-white">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-red-400" />
            <span className="text-sm font-semibold">Share this Episode</span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Drama Preview Card */}
        <div className="mt-4 p-3 bg-white/5 rounded-xl flex items-center gap-3 border border-white/5">
          <img
            src={drama.coverImage}
            alt={drama.title}
            className="w-12 h-16 rounded-lg object-cover bg-slate-800"
          />
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-semibold text-white line-clamp-1">{drama.title}</h4>
            <p className="text-[11px] text-red-400 mt-0.5">Now Playing: Ep. {episodeNumber}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">{drama.views} Views · {drama.category}</p>
          </div>
        </div>

        {/* Share buttons */}
        <div className="mt-5 grid grid-cols-3 gap-2">
          <button
            onClick={() => handleSocialShare('whatsapp')}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 transition-colors"
          >
            <MessageSquare className="w-5 h-5 mb-1.5" />
            <span className="text-[11px] font-medium">WhatsApp</span>
          </button>
          <button
            onClick={() => handleSocialShare('twitter')}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-sky-600/10 hover:bg-sky-600/20 text-sky-400 border border-sky-500/20 transition-colors"
          >
            <Share2 className="w-5 h-5 mb-1.5" />
            <span className="text-[11px] font-medium">X (Twitter)</span>
          </button>
          <button
            onClick={() => handleSocialShare('telegram')}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/20 transition-colors"
          >
            <Send className="w-5 h-5 mb-1.5" />
            <span className="text-[11px] font-medium">Telegram</span>
          </button>
        </div>

        {/* Copy Link Input */}
        <div className="mt-4 flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={shareUrl}
            className="flex-1 px-3 py-2 text-xs bg-black/40 border border-white/10 rounded-lg text-slate-300 font-mono select-all truncate"
          />
          <button
            onClick={handleCopy}
            className="px-3 py-2 bg-red-600 hover:bg-red-500 active:scale-95 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
