import React from "react";

interface ImageModalProps {
  imageUrl: string;
  altDescription: string;
  downloads: number;
  views: number;
  likes: number;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({
  imageUrl,
  altDescription,
  downloads,
  views,
  likes,
  onClose,
}) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <img src={imageUrl} alt={altDescription} />
        <p>Downloads: {downloads}</p>
        <p>Views: {views}</p>
        <p>Likes: {likes}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default ImageModal;
