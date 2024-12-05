import React, { useEffect, useState } from "react";
import axios from "axios";

const HomePage = () => {
  const [team, setTeam] = useState(null); // Store the user's IPL team details
  const [userName, setUserName] = useState(null);
  const [loading, setLoading] = useState(true); // Handle loading state
  const [products, setProducts] = useState([]); // Store fetched products
  const teamLogos = {
    CSK: "https://upload.wikimedia.org/wikipedia/en/thumb/2/2b/Chennai_Super_Kings_Logo.svg/245px-Chennai_Super_Kings_Logo.svg.png", // Example CSK logo URL
    RCB: "https://www.royalchallengers.com/themes/custom/rcbbase/images/rcb-logo-new.png",
    MI: "https://upload.wikimedia.org/wikipedia/en/thumb/c/cd/Mumbai_Indians_Logo.svg/235px-Mumbai_Indians_Logo.svg.png",
    SRH: "https://upload.wikimedia.org/wikipedia/en/thumb/e/eb/Sunrisers_Hyderabad.png/260px-Sunrisers_Hyderabad.png",
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
          setUserName(response.data.user.name); // Assuming the backend sends the team details in this format
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
    CSK: {
      color: "#FFFF00",
      backgroundColor: "#284d27",
      card: {
        backgroundColor: "#FFFF00",
        color: "#284d27",
        borderColor: "#FFD700",
      },
    },
    RCB: {
      color: "#D71920",
      backgroundColor: "#1C1C1C",
      card: {
        backgroundColor: "#D71920",
        color: "#FFFFFF",
        borderColor: "#B22222",
      },
    },
    MI: {
      color: "#004BA0",
      backgroundColor: "#FFFFFF",
      card: {
        backgroundColor: "#004BA0",
        color: "#FFFFFF",
        borderColor: "#1E90FF",
      },
    },
    SRH: {
      color: "#FF6600",
      backgroundColor: "#1A1A1A",
      card: {
        backgroundColor: "#FF6600",
        color: "#FFFFFF",
        borderColor: "#FFA500",
      },
    },
  };

  const teamName = team?.initials || team; // Use initials if team is an object
  const teamStyle = teamStyles[teamName] || {
    color: "#000",
    backgroundColor: "#FFF",
    card: { backgroundColor: "#FFF", color: "#000", borderColor: "#CCC" },
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
          className=" h-20 mr-3"
        />
        {userName}, Welcome to the {team?.full || team} Fan Store!
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="product shadow-lg rounded-lg p-4 border"
            style={{
              backgroundColor: teamStyle.card.backgroundColor,
              color: teamStyle.card.color,
              borderColor: teamStyle.card.borderColor,
            }}
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-40 object-cover rounded-t-lg"
            />
            <div className="details mt-4">
              <h3 className="font-semibold text-lg">{product.name}</h3>
              <p className="text-sm">{product.desc}</p>
              <p className="font-bold mt-2">₹{product.price}</p>
            </div>
            <a href={`${product.link}`}>
              <button
                className="mt-4 py-2 px-4 rounded hover:opacity-90"
                style={{
                  backgroundColor: teamStyle.card.color,
                  color: teamStyle.card.backgroundColor,
                }}
              >
                Buy Now
              </button>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
