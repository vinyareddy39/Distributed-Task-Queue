import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch(e) {}
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav className="bg-black text-white px-6 py-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">
        Task Queue
      </h1>

      <div className="flex gap-5 items-center">
        <Link to="/dashboard" className="hover:text-zinc-300 transition">
          Dashboard
        </Link>

        {user && (
          <div className="text-sm border border-zinc-700 px-3 py-1 rounded-full flex items-center gap-2 bg-zinc-900">
            <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-300">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <span>{user.name}</span>
            <span className="text-zinc-500 text-xs hidden md:inline">({user.email})</span>
          </div>
        )}

        <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-700 transition px-4 py-2 rounded-lg text-sm font-medium shadow-sm"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;