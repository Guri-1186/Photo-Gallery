import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import NavigationButton from "./components/NavigationButton";
import ImageModal from "./components/ImageModal";
import "./components/NavigationButton.css";

const Main: React.FC = () => {
  const myApiKey = "xO3RENdr6FIzpTeDntF8gCRDWh0Eo6LPCz4Z8XKg_Xc";
  const [searchTerm, setSearchTerm] = useState("");
  const [images, setImages] = useState<any[]>([]);
  const [page, setPage] = useState(1);

  const loaderRef = useRef<HTMLDivElement>(null);

  const [selectedImage, setSelectedImage] = useState<any>(null);

  const handleClick = async (id: string) => {
    try {
      const response = await axios.get(
        `https://api.unsplash.com/photos/${id}`,
        {
          params: {
            client_id: myApiKey,
          },
        }
      );

      setSelectedImage(response.data);
    } catch (error) {
      console.error("Error fetching image:", error);
    }
  };
  const closeModal = () => {
    setSelectedImage(null);
  };

  useEffect(() => {
    fetchImages();
  }, [page]);

  const fetchImages = async () => {
    const searchTerms = searchTerm || "popular";
    try {
      const cachedImages = localStorage.getItem(`${searchTerms}-${page}`);
      if (cachedImages) {
        setImages(JSON.parse(cachedImages));
      } else {
        const response = await axios.get(
          searchTerms !== "popular"
            ? "https://api.unsplash.com/search/photos"
            : "https://api.unsplash.com/photos",
          {
            params: {
              query: searchTerms !== "popular" ? searchTerms : undefined,
              order_by: "popular",
              per_page: 20,
              page,
              client_id: "xO3RENdr6FIzpTeDntF8gCRDWh0Eo6LPCz4Z8XKg_Xc",
            },
          }
        );
        const newImages = response.data.results || response.data;
        setImages((prevImages) => [...prevImages, ...newImages]);

        localStorage.setItem(
          `${searchTerms}-${page}`,
          JSON.stringify(newImages)
        );
      }
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      { threshold: 1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setImages([]);
    setPage(1);
  };

  return (
    <div>
      <h1 className="primary-heading">Main Page</h1>
      <div className="center-items">
        <NavigationButton to="/History" className="navigationButton">
          History
        </NavigationButton>
      </div>
      <div className="center-items">
        <input
          type="text"
          placeholder="Search images..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      <div className="img-conatiner">
        {images.map((image, index: number) => (
          <img
            src={image.urls.small}
            alt={image.alt_description}
            key={`${image.id}-${index}`}
            onClick={() => handleClick(image.id)}
            className="each-img"
          />
        ))}
        <div ref={loaderRef}>Loading...</div>
      </div>
      {selectedImage && (
        <ImageModal image={selectedImage} onClose={closeModal} />
      )}
    </div>
  );
};

export default Main;
