import React, { useEffect, useState } from "react";
import axios from "axios";

const HomePage = () => {
  const [team, setTeam] = useState(null); // Store the user's IPL team details
  const [loading, setLoading] = useState(true); // Handle loading state
  const [products, setProducts] = useState([]); // Store fetched products
  const teamLogos = {
    CSK: "https://upload.wikimedia.org/wikipedia/commons/c/c7/Chennai_Super_Kings_Logo.svg", // Example CSK logo URL
    RCB: "https://www.royalchallengers.com/themes/custom/rcbbase/images/rcb-logo-new.png",
    MI: "https://upload.wikimedia.org/wikipedia/en/thumb/c/cd/Mumbai_Indians_Logo.svg/235px-Mumbai_Indians_Logo.svg.png",
    SRH: "https://upload.wikimedia.org/wikipedia/commons/3/3b/Sunrisers_Hyderabad_logo.png",
  };

  useEffect(() => {
    const fetchUserTeam = async () => {
      const token = localStorage.getItem("jwtToken");
      if (token) {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/user`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log("Fetched team data:", response.data.user.team);
          setTeam(response.data.user.team); // Assuming the backend sends the team details in this format
        } catch (error) {
          console.error("Error fetching user team:", error);
        }
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/products`
        );
        setProducts(response.data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserTeam();
    fetchProducts();
  }, []);

  // Handle loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle if the team is not set
  if (!team) {
    return <div className="text-center mt-10">Team details not found.</div>;
  }

  // Define team-specific styles
  const teamStyles = {
    CSK: { color: "#FFFF00", backgroundColor: "#284d27" }, // Example colors
    RCB: { color: "#D71920", backgroundColor: "#1C1C1C" },
    MI: { color: "#004BA0", backgroundColor: "#FFFFFF" },
    SRH: { color: "#FF6600", backgroundColor: "#1A1A1A" },
  };

  const teamName = team?.initials || team; // Use initials if team is an object
  const teamStyle = teamStyles[teamName] || {
    color: "#000",
    backgroundColor: "#FFF",
  };

  return (
    <div
      className="home-container flex flex-col ml-64 p-8"
      style={{ backgroundColor: teamStyle.backgroundColor }}
    >
      <h2
        className="text-2xl font-bold mb-6 flex items-center justify-center"
        style={{ color: teamStyle.color }}
      >
        <img
          src={teamLogos[teamName]}
          alt={`${teamName} logo`}
          className="w-8 h-8 mr-3"
        />
        Welcome to the {team?.full || team} Fan Store!
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="product bg-white shadow-lg rounded-lg p-4 border border-gray-200"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-40 object-cover rounded-t-lg"
            />
            <div className="details mt-4">
              <h3 className="font-semibold text-lg">{product.name}</h3>
              <p className="text-gray-600 text-sm">{product.desc}</p>
              <p className="text-blue-500 font-bold mt-2">${product.price}</p>
            </div>
            <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
              Add To Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
