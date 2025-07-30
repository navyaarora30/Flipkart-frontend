import { useState, useEffect, useRef } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { Container } from "@mui/material";

import Search from "./Search";
import Login from "./Login";
import Signup from "./Signup";
import Navbar from "./Navbar";
import Profile from "./Profile";
import Carousel from "./Carousal";
import Cart from "./Cart";

// Authentication Wrapper
function RequireAuth({ children }) {
  const location = useLocation();
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

function AppContent({ products }) {
  const location = useLocation();
  const chartRef = useRef(null);

  const featuredCategories = [
    { value: "smartphones", label: "Smartphones" },
    { value: "laptops", label: "Laptops" },
    { value: "fragrances", label: "Fragrances" },
    { value: "mens-shirts", label: "Mens Shirts" },
  ];

  const productsByCategory = {};
  featuredCategories.forEach((cat) => {
    productsByCategory[cat.value] = products
      .filter((item) => item.category === cat.value)
      .slice(0, 12);
  });

  return (
    <>
      {location.pathname !== "/login" && location.pathname !== "/signup" && (
        <Navbar />
      )}
      <Container sx={{ mt: 4 }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/profile"
            element={
              <RequireAuth>
                <Profile />
              </RequireAuth>
            }
          />
          <Route
            path="/search"
            element={
              <RequireAuth>
                <Search />
              </RequireAuth>
            }
          />
          <Route
            path="/cart"
            element={
              <RequireAuth>
                <Cart />
              </RequireAuth>
            }
          />
          <Route
            path="/"
            element={
              <RequireAuth>
                <div>
                  <Carousel />
                  {featuredCategories.map((cat) => (
                    <div key={cat.value} className="mb-12">
                      <h2 className="text-2xl font-bold mb-6 text-gray-800">
                        {cat.label}
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {productsByCategory[cat.value]?.map((product) => (
                          <div
                            key={product._id}
                            className="bg-white rounded-lg shadow p-4 flex flex-col items-start"
                          >
                            <img
                              src={product.thumbnail}
                              alt={product.title}
                              className="w-full h-40 object-contain mb-3 rounded"
                            />
                            <div className="font-semibold text-base mb-1 line-clamp-2 min-h-[48px]">
                              {product.title}
                            </div>
                            <div className="text-gray-600 text-sm mb-1 line-clamp-2 min-h-[32px]">
                              {product.description}
                            </div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-blue-600 font-bold text-lg">
                                ₹{product.price}
                              </span>
                              <span className="text-green-600 font-semibold text-xs">
                                {product.discountPercentage}% off
                              </span>
                            </div>
                            <div className="flex items-center mb-1">
                              <span className="bg-green-600 text-white text-xs font-semibold px-2 py-0.5 rounded mr-2">
                                {product.rating} ★
                              </span>
                              <span className="text-xs text-gray-500">
                                Stock: {product.stock}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500 mb-1">
                              Brand: {product.brand}
                            </div>
                            <div className="flex gap-2 mt-2 w-full">
                              <button
                                className="flex-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                                onClick={() => {
                                  const userId = localStorage.getItem("userId");
                                  fetch(
                                    `https://flipkart-backend-74av.onrender.com/api/cart/add`,
                                    {
                                      method: "POST",
                                      headers: {
                                        "Content-Type": "application/json",
                                      },
                                      body: JSON.stringify({
                                        productId: product._id,
                                        quantity: 1,
                                        user: userId,
                                      }),
                                    }
                                  )
                                    .then((res) => res.json())
                                    .then(() => alert("Added to cart!"))
                                    .catch(() =>
                                      alert("Failed to add to cart")
                                    );
                                }}
                              >
                                Add to Cart
                              </button>
                              <button
                                className="flex-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                                onClick={() => {
                                  const userId = localStorage.getItem("userId");
                                  fetch(
                                    `https://flipkart-backend-74av.onrender.com/api/cart/add`,
                                    {
                                      method: "POST",
                                      headers: {
                                        "Content-Type": "application/json",
                                      },
                                      body: JSON.stringify({
                                        productId: product._id,
                                        quantity: 1,
                                        user: userId,
                                      }),
                                    }
                                  )
                                    .then(() => {
                                      window.location.href = "/cart";
                                    })
                                    .catch(() =>
                                      alert("Failed to add to cart")
                                    );
                                }}
                              >
                                Buy Now
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </RequireAuth>
            }
          />
        </Routes>
      </Container>
    </>
  );
}

function App() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("https://flipkart-backend-74av.onrender.com/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.data)) {
          setProducts(data.data);
        } else {
          console.error("Products response not in expected format:", data);
        }
      })
      .catch((err) => console.error("Failed to load products:", err));
  }, []);

  return (
    <Router>
      <AppContent products={products} />
    </Router>
  );
}

export default App;
