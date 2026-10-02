import React, { useState } from 'react';
import { Comment } from '../types/drama';
import { X, Heart, Send, MessageCircle } from 'lucide-react';

interface CommentsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  dramaTitle: string;
  episodeNumber: number;
  comments: Comment[];
  onAddComment: (commentText: string) => void;
}

export const CommentsDrawer: React.FC<CommentsDrawerProps> = ({
  isOpen,
  onClose,
  dramaTitle,
  episodeNumber,
  comments,
  onAddComment
}) => {
  const [inputText, setInputText] = useState('');
  const [localComments, setLocalComments] = useState<Comment[]>(comments);

  // Sync if prop comments update
  React.useEffect(() => {
    setLocalComments(comments);
  }, [comments]);

  if (!isOpen) return null;

  const handleToggleLike = (commentId: string) => {
    setLocalComments((prev) =>
      prev.map((c) => {
        if (c.id === commentId) {
          const isLiked = !c.isLiked;
          return {
            ...c,
            isLiked,
            likes: isLiked ? c.likes + 1 : c.likes - 1
          };
        }
        return c;
      })
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    onAddComment(inputText.trim());

    const newComment: Comment = {
      id: `c_${Date.now()}`,
      userName: 'You',
      userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
      text: inputText.trim(),
      likes: 0,
      timestamp: 'Just now'
    };

    setLocalComments((prev) => [newComment, ...prev]);
    setInputText('');
  };

  const handleQuickEmoji = (emoji: string) => {
    setInputText((prev) => prev + emoji);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer */}
      <div className="relative z-10 w-full sm:max-w-md bg-slate-900 border-t sm:border border-white/10 rounded-t-3xl sm:rounded-2xl h-[80vh] sm:h-[650px] flex flex-col shadow-2xl overflow-hidden animate-slide-up">
        {/* Mobile handle */}
        <div className="sm:hidden w-10 h-1 bg-white/20 rounded-full mx-auto my-2.5" />

        {/* Header */}
        <div className="px-5 py-3.5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-red-400" />
            <span className="text-sm font-semibold text-white">
              Comments ({localComments.length})
            </span>
            <span className="text-xs text-slate-400">· Ep. {episodeNumber}</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Comments Scrollable List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {localComments.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs">
              <MessageCircle className="w-8 h-8 mb-2 opacity-40" />
              <span>No comments yet. Be the first to share your thoughts!</span>
            </div>
          ) : (
            localComments.map((comment) => (
              <div key={comment.id} className="flex gap-3 text-xs sm:text-sm">
                <img
                  src={comment.userAvatar}
                  alt={comment.userName}
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-full object-cover shrink-0 border border-white/10 bg-slate-800"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-slate-300 text-xs truncate">
                      {comment.userName}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {comment.timestamp}
                    </span>
                  </div>
                  <p className="text-slate-200 text-xs sm:text-[13px] leading-relaxed break-words">
                    {comment.text}
                  </p>
                </div>
                <button
                  onClick={() => handleToggleLike(comment.id)}
                  className={`flex flex-col items-center justify-start pt-1 gap-1 text-[11px] transition-colors shrink-0 ${
                    comment.isLiked ? 'text-red-500' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <Heart
                    className={`w-3.5 h-3.5 ${comment.isLiked ? 'fill-current' : ''}`}
                  />
                  <span>{comment.likes}</span>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Quick Emoji Bar */}
        <div className="px-4 py-1.5 border-t border-white/5 bg-slate-950/40 flex items-center gap-3 text-lg">
          {['🔥', '❤️', '👏', '😭', '😱', '💅'].map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => handleQuickEmoji(emoji)}
              className="hover:scale-125 transition-transform"
            >
              {emoji}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form
          onSubmit={handleSubmit}
          className="p-3 bg-slate-950/90 border-t border-white/10 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Drop your reaction to this scene..."
            className="flex-1 px-4 py-2 text-xs sm:text-sm bg-white/5 border border-white/10 rounded-full text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition-colors"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="w-9 h-9 rounded-full bg-red-600 disabled:bg-white/10 text-white flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
