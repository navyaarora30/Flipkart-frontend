import { useState, useEffect } from "react";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = localStorage.getItem("userId") || "2";
  const BACKEND_URL = "https://flipkart-backend-74av.onrender.com";

  const deliveryAddress = {
    location: "Sample address",
  };

  useEffect(() => {
    async function fetchCartAndProducts() {
      setLoading(true);
      setError(null);
      try {
        // ✅ Fetch all carts
        const cartRes = await fetch(`${BACKEND_URL}/api/carts`);
        const cartData = await cartRes.json();
        if (!cartData.success) throw new Error("Failed to fetch carts");

        const userCarts = Array.isArray(cartData.data)
          ? cartData.data.filter((c) => c.userId === userId)
          : [];

        let cartItemsRaw = [];
        userCarts.forEach((cart) => {
          if (Array.isArray(cart.items)) {
            cart.items.forEach((item) => {
              cartItemsRaw.push(item);
            });
          }
        });

        const combinedItemsMap = {};
        cartItemsRaw.forEach((item) => {
          const key = String(item.productId);
          if (combinedItemsMap[key]) {
            combinedItemsMap[key].quantity += item.quantity || 1;
          } else {
            combinedItemsMap[key] = { ...item };
          }
        });
        const combinedCartItemsRaw = Object.values(combinedItemsMap);

        // ✅ Fetch all products
        const prodRes = await fetch(`${BACKEND_URL}/api/products`);
        const contentType = prodRes.headers.get("content-type");

        if (!contentType || !contentType.includes("application/json")) {
          const htmlText = await prodRes.text();
          console.error(
            "❌ Expected JSON, but got HTML:\n",
            htmlText.slice(0, 300)
          );
          throw new Error("Invalid JSON response from /api/products");
        }

        const productsResponse = await prodRes.json();

        // ✅ Handle different product response formats
        let allProducts = [];
        if (Array.isArray(productsResponse)) {
          allProducts = productsResponse;
        } else if (Array.isArray(productsResponse.data)) {
          allProducts = productsResponse.data;
        }

        // ✅ Merge cart items with product details
        const mergedCartItems = combinedCartItemsRaw.map((item) => {
          const product = allProducts.find(
            (p) => String(p.id) === String(item.productId)
          );
          return product
            ? {
                ...product,
                quantity: item.quantity || 1,
                productId: item.productId,
              }
            : {
                productId: item.productId,
                quantity: item.quantity || 1,
                missing: true,
              };
        });

        setCartItems(mergedCartItems);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchCartAndProducts();
  }, [userId]);

  const handleQuantity = (idx, delta) => {
    const items = [...cartItems];
    const currentQty = items[idx].quantity || 1;
    if (currentQty + delta > 0) {
      items[idx].quantity = currentQty + delta;
      setCartItems(items);
    }
  };

  const handleRemove = (idx) => {
    const items = [...cartItems];
    items.splice(idx, 1);
    setCartItems(items);
  };

  const price = cartItems.reduce(
    (sum, item) =>
      sum + (item.originalPrice || item.price || 0) * (item.quantity || 1),
    0
  );
  const discount = cartItems.reduce(
    (sum, item) =>
      sum +
      ((item.originalPrice || item.price || 0) - (item.price || 0)) *
        (item.quantity || 1),
    0
  );
  const platformFee = 4;
  const total = price - discount + platformFee;

  if (loading) return <div className="p-8 text-center">Loading cart...</div>;
  if (error)
    return <div className="p-8 text-center text-red-600">Error: {error}</div>;

  return (
    <div className="bg-white min-h-screen py-8">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <div className="bg-white rounded shadow p-4 mb-4 flex items-center justify-between">
            <span>
              Deliver to:{" "}
              <span className="font-bold text-blue-900">
                {deliveryAddress.location}
              </span>
            </span>
            <button className="border border-blue-500 text-blue-500 px-4 py-1 rounded hover:bg-blue-50">
              Change
            </button>
          </div>

          {cartItems.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              Your cart is empty.
            </div>
          ) : (
            cartItems.map((item, idx) => (
              <div
                key={item.productId || idx}
                className="bg-white rounded shadow p-4 mb-4 flex flex-col md:flex-row items-start md:items-center justify-between"
              >
                <div className="flex items-start gap-4 flex-1">
                  {item.thumbnail ? (
                    <img
                      src={item.thumbnail}
                      alt={item.title || "Product Image"}
                      className="w-24 h-28 object-cover rounded"
                    />
                  ) : (
                    <div className="w-24 h-28 bg-gray-200 flex items-center justify-center rounded text-gray-400">
                      No Image
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="font-semibold text-lg mb-1">
                      {item.title || "Unknown Product"}
                    </div>
                    <div className="text-gray-500 text-sm mb-1">
                      Size: {item.size || "--"}
                    </div>
                    <div className="text-gray-400 text-xs mb-1">
                      Seller: {item.seller || "SandSMarketing"}
                    </div>
                    <div className="text-gray-400 text-xs mb-1">
                      Delivery by Sat Jul 26
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      {item.originalPrice && (
                        <span className="line-through text-gray-400">
                          ₹{item.originalPrice}
                        </span>
                      )}
                      <span className="text-lg font-bold text-gray-800">
                        ₹{item.price || "--"}
                      </span>
                      {item.discountPercentage && (
                        <span className="text-green-600 font-semibold text-sm">
                          {item.discountPercentage}% Off
                        </span>
                      )}
                      <span className="text-green-700 text-xs">
                        4 offers available
                      </span>
                    </div>

                    <div className="text-xs text-gray-500 mt-1">
                      Or Pay ₹
                      {item.price ? Math.round(item.price * 0.95) : "--"} +{" "}
                      <span className="text-yellow-600 font-bold">28</span>
                    </div>

                    <div className="flex items-center gap-2 mt-3">
                      <button
                        onClick={() => handleQuantity(idx, -1)}
                        className="border px-2 py-1 rounded"
                      >
                        -
                      </button>
                      <span className="px-2">{item.quantity || 1}</span>
                      <button
                        onClick={() => handleQuantity(idx, 1)}
                        className="border px-2 py-1 rounded"
                      >
                        +
                      </button>
                    </div>

                    <div className="flex items-center gap-6 mt-3">
                      <button
                        onClick={() => handleRemove(idx)}
                        className="text-gray-600 font-semibold"
                      >
                        REMOVE
                      </button>
                    </div>

                    {item.missing && (
                      <div className="text-xs text-red-500 mt-2">
                        Product details not found.
                      </div>
                    )}
                  </div>
                </div>

                <button className="bg-orange-500 text-white px-8 py-2 rounded font-bold mt-4 md:mt-0 self-end md:self-center">
                  PLACE ORDER
                </button>
              </div>
            ))
          )}
        </div>

        {/* Right: Price Summary */}
        <div className="w-full md:w-80">
          <div className="bg-white rounded shadow p-4 mb-4">
            <div className="font-semibold text-lg mb-4">PRICE DETAILS</div>
            <div className="flex justify-between mb-2 text-sm">
              <span>
                Price ({cartItems.length} item
                {cartItems.length !== 1 ? "s" : ""})
              </span>
              <span>₹{price}</span>
            </div>
            <div className="flex justify-between mb-2 text-sm">
              <span>Discount</span>
              <span className="text-green-600">- ₹{discount}</span>
            </div>
            <div className="flex justify-between mb-2 text-sm">
              <span>Platform Fee</span>
              <span>₹{platformFee}</span>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between mb-2 font-bold text-base">
              <span>Total Amount</span>
              <span>₹{total}</span>
            </div>
            <div className="text-green-700 text-sm mt-2">
              You will save ₹{discount} on this order
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
