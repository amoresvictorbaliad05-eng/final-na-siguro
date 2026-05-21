import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      // store JWT token
      localStorage.setItem("auth_token", token);

      // optional cleanup
      window.history.replaceState({}, document.title, "/dashboard");

      // redirect user
      navigate("/dashboard");
    } else {
      // if no token → go back to login
      navigate("/login");
    }
  }, []);

  useEffect(() => {
  console.log("AuthSuccess loaded:", window.location.href);

  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");

  console.log("Token:", token);

  if (token) {
    localStorage.setItem("auth_token", token);
    navigate("/dashboard");
  } else {
    navigate("/login");
  }
}, []);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-gray-600">Logging you in...</p>
    </div>
  );
}