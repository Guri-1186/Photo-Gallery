import React from "react";
import "./ImageModal.css";

interface ImageModalProps {
  image: any;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ image, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>Image Details</h2>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          <img src={image.urls.full} alt={image.alt_description} />
          <div className="image-details">
            <p>Downloads: {image.downloads}</p>
            <p>Views: {image.views}</p>
            <p>Likes: {image.likes}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
