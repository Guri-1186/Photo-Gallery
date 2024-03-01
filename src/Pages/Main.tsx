// Main.tsx
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const Main: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [images, setImages] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const bottomBoundaryRef = useRef<HTMLDivElement>(null);

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
          loadMore();
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

  const fetchImages = async () => {
    try {
      setLoading(true);
      const response = await axios.get("https://api.unsplash.com/photos", {
        params: {
          order_by: "popular",
          per_page: 20,
          page,
          client_id: "xO3RENdr6FIzpTeDntF8gCRDWh0Eo6LPCz4Z8XKg_Xc",
        },
      });
      const newImages =
        page === 1 ? response.data : [...images, ...response.data];
      setImages(newImages);
      localStorage.setItem("cachedImages", JSON.stringify(newImages));
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const loadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handleImageClick = (
    imageUrl: string,
    altDescription: string,
    downloads: number,
    views: number,
    likes: number
  ) => {
   
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
            key={image.id}
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
    </div>
  );
};

export default Main;
