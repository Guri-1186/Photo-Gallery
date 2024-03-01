// History.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const History: React.FC = () => {
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  useEffect(() => {
    const storedHistory = localStorage.getItem("searchHistory");
    if (storedHistory) {
      setSearchHistory(JSON.parse(storedHistory));
    }
  }, []);

  const handleClick = async (term: string) => {
    try {
      await axios.get("https://api.unsplash.com/search/photos", {
        params: {
          query: term,
          per_page: 20,
          client_id: "xO3RENdr6FIzpTeDntF8gCRDWh0Eo6LPCz4Z8XKg_Xc", // Replace with your access key
        },
      });
      // Handle displaying images for clicked term
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  return (
    <div>
      <h1>Search History</h1>
      <ul>
        {searchHistory.map((term, index) => (
          <li key={index} onClick={() => handleClick(term)}>
            {term}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default History;
