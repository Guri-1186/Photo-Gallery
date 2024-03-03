import React, { useState, useEffect } from "react";
import axios from "axios";
import NavigationButton from "./components/NavigationButton";
import "./components/NavigationButton.css";

const fetchCachedSearchQueries = () => {
  const queries: any = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key: any = localStorage.key(i);
    if (key.includes("-")) {
      const searchTerm = key.split("-")[0];
      if (!queries.includes(searchTerm)) {
        queries.push(searchTerm);
      }
    }
  }
  return queries;
};

const History: React.FC = () => {
  const cachedQueries = fetchCachedSearchQueries();
  console.log("Cached queries:", cachedQueries);

  const [images, setImages] = useState([]);

  const handleClick = async (term: string) => {
    try {
      const response = await axios.get(
        "https://api.unsplash.com/search/photos",
        {
          params: {
            query: term,
            per_page: 20,
            client_id: "xO3RENdr6FIzpTeDntF8gCRDWh0Eo6LPCz4Z8XKg_Xc",
          },
        }
      );
      setImages(response.data.results);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };
  return (
    <div>
      <h1>History Page</h1>
      <NavigationButton to="/Main" className="navigationButton">
        Main
      </NavigationButton>
      {cachedQueries.map((term: string, index: number) => (
        <li key={index} onClick={() => handleClick(term)}>
          {term}
        </li>
      ))}
      {images.map((image: any) => (
        <img
          src={image.urls.small}
          alt={image.alt_description}
          key={image.id}
        />
      ))}
    </div>
  );
};

export default History;
