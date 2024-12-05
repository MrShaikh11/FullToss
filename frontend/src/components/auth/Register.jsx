import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
  const [step, setStep] = useState(1);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    city: "",
    color: "",
  });
  const teams = {
    yellow: { initials: "CSK", full: "Chennai Super Kings" },
    red: { initials: "RCB", full: "Royal Challengers Bangalore" },
    blue: { initials: "MI", full: "Mumbai Indians" },
    orange: { initials: "SRH", full: "Sun Risers Hyderabad" },
  };
  const [error, setError] = useState("");

  const cities = ["Agra", "Ahmedabad", "Bangalore", "Delhi", "Mumbai", "Pune"];
  const colors = ["Yellow", "Red", "Blue", "Orange"];

  // Handle field value changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setError(""); // Clear error when user types
  };

  // Validate current step inputs
  const validateStep = () => {
    if (step === 1) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

      if (!formData.name) return "Name is required!";
      if (!formData.email) return "Email is required!";
      if (!emailRegex.test(formData.email)) {
        return "Please enter a valid email address."; // Return error message here
      }
    }

    if (step === 2) {
      if (!formData.password) return "Password is required!";
      if (!formData.confirmPassword) return "Confirm Password is required!";
      if (formData.password !== formData.confirmPassword) {
        return "Passwords do not match!";
      }

      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(formData.password)) {
        return "Password must be at least 8 characters and include an uppercase letter, number, and special character.";
      }
    }

    if (step === 3) {
      if (!formData.city) return "City selection is required!";
      if (!formData.color) return "Color selection is required!";
    }

    return ""; // No errors
  };

  // Go to the next step if validation passes
  const nextStep = () => {
    const validationError = validateStep();

    if (validationError) {
      setError(validationError); // Show error message if validation fails
      return; // Stop if there's an error
    }

    setError(""); // Clear any previous errors
    setStep(step + 1); // Move to the next step
  };

  // Go to the previous step
  const prevStep = () => setStep(step - 1);

  // Submit form (final step)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateStep();
    if (validationError) {
      setError(validationError);
      return; // Stop submission if there's an error
    }

    try {
      const col = formData.color.toLowerCase().trim();
      // console.log(col);
      const selected = teams[col] || {
        initials: "Unknown",
        full: "Unknown Team",
      };
      setSelectedTeam(selected);
      console.log(selectedTeam.full);
      if (formData.confirmPassword == formData.password) {
        const res = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/register`,
          {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            color: formData.color,
            city: formData.city,
            team: selectedTeam,
          }
        );
        if (res.data.includes("User with email")) {
          setError(res.data);
        }
        if (res.data.includes("created")) {
          setError(res.data);
          console.log("Form Data Submitted: ", formData);
          setStep(4); // Move to confirmation step
        }

        console.log(res);
      } else setError("Both Passwords don't match");
    } catch (error) {
      // setError(res);
      console.log("Error: ", error.message);
    }
  };

  // Restart the form

  return (
    <div className="relative min-h-screen flex dark:bg-gray-900">
      <div className="container max-w-screen-xl mx-auto my-auto relative flex flex-col w-4/5">
        <div className="text-6xl font-bold text-white text-center tracking-tighter">
          FullToss
        </div>
        <form
          className="mt-12 md:w-4/5 mx-auto rounded-3xl"
          style={{ backgroundColor: "#ebe9d8" }}
          onSubmit={handleSubmit}
        >
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="md:w-3/5 mx-auto py-12"
              >
                <div className="text-base font-light text-center">Step 1/3</div>
                <div
                  className="mt-4 w-full h-2"
                  style={{ backgroundColor: "#e0cfc8" }}
                >
                  <div className="h-full bg-black rounded-3xl w-1/3"></div>
                </div>
                <div className="mt-12 text-4xl  font-bold text-center">
                  Account Details
                </div>

                <div className="mt-4">
                  <label className="block mb-2 text-sm font-medium">
                    Your Name
                  </label>
                  <input
                    type="text"
                    placeholder="Name"
                    name="name"
                    className="w-full border border-gray-300 rounded p-2 focus:outline-none"
                    style={{ backgroundColor: "#e0cfc8" }}
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="mt-4">
                  <label className="block mb-2 text-sm font-medium">
                    Your Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="name@company.com"
                    className="w-full border border-gray-300 rounded p-2 focus:outline-none"
                    style={{ backgroundColor: "#e0cfc8" }}
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                {error && <p className="text-red-600 mt-4">{error}</p>}

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={nextStep}
                    className="mt-4 bg-black text-white font-bold py-2 px-4 rounded"
                  >
                    Next
                  </button>
                </div>
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                  >
                    Login here
                  </Link>
                </p>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="md:w-3/5 mx-auto py-12"
              >
                <div className="text-base font-light text-center">Step 2/3</div>
                <div
                  className="mt-4 w-full h-2"
                  style={{ backgroundColor: "#e0cfc8" }}
                >
                  <div className="h-full bg-black rounded-3xl w-2/3"></div>
                </div>
                <div className="mt-12 text-3xl text-center">
                  Create a Strong Password
                </div>
                <div className="mt-4">
                  <label className="block mb-2 text-sm font-medium">
                    Enter Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    className="w-full border border-gray-300 rounded p-2 focus:outline-none"
                    style={{ backgroundColor: "#e0cfc8" }}
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>

                <div className="mt-4">
                  <label className="block mb-2 text-sm font-medium">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="••••••••"
                    className="w-full border border-gray-300 rounded p-2 focus:outline-none"
                    style={{ backgroundColor: "#e0cfc8" }}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>

                {error && <p className="text-red-600 mt-4">{error}</p>}

                <div className="flex justify-center mt-12">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="mr-4 bg-black text-white font-bold py-2 px-4 rounded"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="bg-black text-white font-bold py-2 px-4 rounded"
                  >
                    Next
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="md:w-3/5 mx-auto py-12"
              >
                <div className="text-base font-light text-center">Step 3/3</div>
                <div
                  className="mt-4 w-full h-2"
                  style={{ backgroundColor: "#e0cfc8" }}
                >
                  <div className="h-full bg-black rounded-3xl w-full"></div>
                </div>
                <div className="mt-12 text-3xl text-center">
                  Additional Information
                </div>

                <div className="mt-4">
                  <label className="block mb-2 text-sm font-medium">City</label>
                  <select
                    name="city"
                    className="w-full border border-gray-300 rounded p-2 focus:outline-none"
                    style={{ backgroundColor: "#e0cfc8" }}
                    value={formData.city}
                    onChange={handleChange}
                  >
                    <option value="" disabled>
                      -- Select a City --
                    </option>
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mt-4">
                  <label className="block mb-2 text-sm font-medium">
                    Favorite Color
                  </label>
                  <select
                    name="color"
                    className="w-full border border-gray-300 rounded p-2 focus:outline-none"
                    style={{ backgroundColor: "#e0cfc8" }}
                    value={formData.color}
                    onChange={handleChange}
                  >
                    <option value="" disabled>
                      -- Select a Color --
                    </option>
                    {colors.map((color) => (
                      <option key={color} value={color}>
                        {color}
                      </option>
                    ))}
                  </select>
                </div>

                {error && <p className="text-red-600 mt-4">{error}</p>}

                <div className="flex justify-center mt-12">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="mr-4 bg-black text-white font-bold py-2 px-4 rounded"
                  >
                    Previous
                  </button>
                  <button
                    type="submit"
                    className="bg-black text-white font-bold py-2 px-4 rounded"
                  >
                    Submit
                  </button>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="text-center py-20 rounded-3xl"
                style={{
                  backgroundColor: formData.color.toLowerCase(), // Dynamically set background color
                  // color:
                  //   formData.color.toLowerCase() === "yellow"
                  //     ? "black"
                  //     : "white", // Ensure text is visible for light colors
                }}
              >
                <h1 className="text-4xl font-bold">Congratulations!</h1>
                <p className="mt-4 text-lg">
                  You are now a member from{" "}
                  <strong>
                    {selectedTeam?.initials} - {selectedTeam?.full}
                  </strong>
                  !
                </p>
                <Link
                  to="/login"
                  className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  <button className="mt-8 bg-black text-white font-bold py-2 px-4 rounded">
                    Login
                  </button>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>
    </div>
  );
}

export default Register;
