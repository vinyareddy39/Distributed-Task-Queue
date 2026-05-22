import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const registerHandler = async (e) => {
    e.preventDefault();
    setError("");

    try {

      await api.post("/auth/register", {
        name,
        email,
        password,
      });

      navigate("/");

    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        // Mongoose duplicate key errors typically come back here due to the current backend setup
        if (err.response.data.error.includes("E11000 duplicate key error")) {
          setError("Email already registered");
        } else {
          setError(err.response.data.error);
        }
      } else if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("An error occurred during registration");
      }
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">

      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">

        <h1 className="text-3xl font-bold mb-6 text-center">
          Register
        </h1>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={registerHandler}>

          <input
            type="text"
            placeholder="Name"
            className="w-full border p-3 rounded-lg mb-4"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full border p-3 rounded-lg mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border p-3 rounded-lg mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="w-full bg-green-500 text-white py-3 rounded-lg"
          >
            Register
          </button>

        </form>

        <p className="mt-5 text-center">
          Already have account?
          <Link to="/" className="text-blue-500 ml-1">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Register;