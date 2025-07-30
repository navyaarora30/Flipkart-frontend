import { useState, useEffect } from "react";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = localStorage.getItem("userId") || "2";
  const BACKEND_URL = "https://flipkart-backend-74av.onrender.com";

  useEffect(() => {
    async function fetchCartAndProducts() {
      setLoading(true);
      setError(null);
      try {
        // Fetch /api/carts
        const cartRes = await fetch(`${BACKEND_URL}/api/carts`, {
          headers: { Accept: "application/json" },
        });
        const cartText = await cartRes.text();
        console.log("🛒 Raw /api/carts response:", cartRes.status, cartText);
        if (cartRes.status !== 200) {
          throw new Error(`Invalid carts response: ${cartRes.status}`);
        }
        const cartData = JSON.parse(cartText);
        if (!cartData.success || !Array.isArray(cartData.data)) {
          throw new Error("cartData missing or invalid");
        }

        // Process cart items
        const userCarts = cartData.data.filter((c) => c.userId === userId);
        let rawItems = userCarts.flatMap((c) => c.items || []);
        const grouped = Object.values(
          rawItems.reduce((acc, i) => {
            const key = i.productId;
            acc[key] = acc[key]
              ? { ...acc[key], quantity: acc[key].quantity + (i.quantity || 1) }
              : { ...i };
            return acc;
          }, {})
        );

        // Fetch /api/products
        const prodRes = await fetch(`${BACKEND_URL}/api/products`, {
          headers: { Accept: "application/json" },
        });
        const prodText = await prodRes.text();
        console.log("📦 Raw /api/products response:", prodRes.status, prodText);
        if (prodRes.status !== 200)
          throw new Error(`Invalid products status: ${prodRes.status}`);
        const productsResp = JSON.parse(prodText);
        if (!Array.isArray(productsResp.data))
          throw new Error("productsResp.data missing");

        // Merge
        const merged = grouped.map((item) => {
          const prod = productsResp.data.find(
            (p) => String(p._id) === String(item.productId)
          );
          return prod
            ? { ...prod, quantity: item.quantity }
            : {
                productId: item.productId,
                quantity: item.quantity,
                missing: true,
              };
        });

        setCartItems(merged);
      } catch (err) {
        console.error("❌ Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchCartAndProducts();
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;

  return (
    <div>
      <h2>Your Cart</h2>
      {cartItems.map((item) => (
        <div key={item.productId || item._id}>
          {item.title || "Unknown Product"} - Qty: {item.quantity}{" "}
          {item.missing && "(details missing)"}
        </div>
      ))}
    </div>
  );
}

export default Cart;
