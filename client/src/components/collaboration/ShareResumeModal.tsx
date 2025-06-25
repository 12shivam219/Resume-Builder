import React, { useState } from "react";

interface ShareResumeModalProps {
  resumeId: string;
  onClose: () => void;
}

export const ShareResumeModal: React.FC<ShareResumeModalProps> = ({
  resumeId,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = `${window.location.origin}/share/${resumeId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Share Resume</h2>
        <input type="text" value={shareUrl} readOnly className="input" />
        <button onClick={handleCopy}>{copied ? "Copied!" : "Copy Link"}</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};
