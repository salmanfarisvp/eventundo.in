"use client";

import { useState } from "react";
import { toast } from "sonner";

interface ShareButtonProps {
  title: string;
  eventId: string;
  compact?: boolean;
}

export default function ShareButton({ title, eventId, compact = false }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = `${window.location.origin}/events/${eventId}`;

    if (navigator.share) {
      try {
        await navigator.share({ title, url, text: `Check out this event: ${title}` });
        return;
      } catch {
        // User cancelled or share failed — fall through to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy link.");
    }
  };

  if (compact) {
    return (
      <button
        onClick={handleShare}
        title="Share event"
        className="shrink-0 p-1.5 rounded-lg transition-opacity hover:opacity-70 active:scale-95"
        style={{ color: copied ? "var(--accent)" : "var(--text-faint)" }}
      >
        {copied ? (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleShare}
      className="flex items-center justify-center gap-2 text-sm font-medium px-4 py-2.5 rounded-xl min-h-[44px] transition-colors border w-full"
      style={{
        background: copied ? "var(--accent-soft)" : "var(--bg-subtle)",
        color: copied ? "var(--accent-text)" : "var(--text-muted)",
        borderColor: copied ? "var(--accent)" : "var(--border)",
      }}
    >
      {copied ? (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
          Copied!
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Copy Link
        </>
      )}
    </button>
  );
}
