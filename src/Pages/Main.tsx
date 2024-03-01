import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import ImageModal from "./components/ImageModal";

const Main: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState<any>({
    imageUrl: "",
    altDescription: "",
    downloads: 0,
    views: 0,
    likes: 0,
  });

  const bottomBoundaryRef = useRef<HTMLDivElement>(null);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        searchTerm
          ? "https://api.unsplash.com/search/photos"
          : "https://api.unsplash.com/photos",
        {
          params: searchTerm
            ? {
                query: searchTerm,
                per_page: 20,
                page,
                client_id: "xO3RENdr6FIzpTeDntF8gCRDWh0Eo6LPCz4Z8XKg_Xc",
              }
            : {
                order_by: "popular",
                per_page: 20,
                page,
                client_id: "xO3RENdr6FIzpTeDntF8gCRDWh0Eo6LPCz4Z8XKg_Xc",
              },
        }
      );
      const newImages =
        page === 1
          ? response.data.results || response.data
          : [...images, ...(response.data.results || response.data)];
      setImages(newImages);
      localStorage.setItem("cachedImages", JSON.stringify(newImages));
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const cachedImages = localStorage.getItem("cachedImages");
    if (cachedImages) {
      setImages(JSON.parse(cachedImages));
    } else {
      fetchImages();
    }
  }, [searchTerm, page]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      { threshold: 1 }
    );

    if (bottomBoundaryRef.current) {
      observer.observe(bottomBoundaryRef.current);
    }

    return () => {
      if (bottomBoundaryRef.current) {
        observer.unobserve(bottomBoundaryRef.current);
      }
    };
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(1);
  };

  const handleImageClick = (
    imageUrl: string,
    altDescription: string,
    downloads: number,
    views: number,
    likes: number
  ) => {
    setModalData({ imageUrl, altDescription, downloads, views, likes });
    setShowModal(true);
  };

  return (
    <div>
      <h1>Main Page</h1>
      <input
        type="text"
        placeholder="Search images..."
        value={searchTerm}
        onChange={handleSearchChange}
      />
      <div>
        {images.map((image, index) => (
          <img
            key={index}
            src={image.urls.regular}
            alt={image.alt_description}
            onClick={() =>
              handleImageClick(
                image.urls.regular,
                image.alt_description,
                image.downloads.total,
                image.views.total,
                image.likes.total
              )
            }
          />
        ))}
      </div>
      <div ref={bottomBoundaryRef}></div>
      {loading && <p>Loading...</p>}
      {showModal && (
        <ImageModal
          imageUrl={modalData.imageUrl}
          altDescription={modalData.altDescription}
          downloads={modalData.downloads}
          views={modalData.views}
          likes={modalData.likes}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default Main;
