import React from "react";

const SocialShare = ({ score, category, difficulty }) => {
  // Generate shareable text
  const shareText = `I scored ${score} in ${category} mode (${difficulty} level) on MathHeads! 🧮🚀 Challenge yourself at mathheads.com`;

  // Social share handlers
  const shareOnTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      shareText
    )}`;
    window.open(url, "_blank");
  };

  const shareOnFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      "https://mathheads.com"
    )}&quote=${encodeURIComponent(shareText)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="flex space-x-4">
      <button
        onClick={shareOnTwitter}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Share on Twitter
      </button>
      <button
        onClick={shareOnFacebook}
        className="bg-blue-800 text-white px-4 py-2 rounded"
      >
        Share on Facebook
      </button>
    </div>
  );
};

export default SocialShare;
