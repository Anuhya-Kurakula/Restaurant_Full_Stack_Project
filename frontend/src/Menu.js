import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import { API_BASE_URL } from "./services/api";
import "./components/Menu.css";

// Reliable fallback items in case backend is offline
const FALLBACK_MENU = [
  {
    id: 1,
    name: "Margherita Pizza",
    description: "Classic mozzarella, fresh basil, and rich tomato sauce on hand-tossed dough",
    cost: 250,
    category: "Pizza",
    image: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=500&auto=format&fit=crop"
  },
  {
    id: 2,
    name: "Pepperoni Pizza",
    description: "Loaded with spiced pepperoni, melted mozzarella, and oregano",
    cost: 300,
    category: "Pizza",
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&auto=format&fit=crop"
  },
  {
    id: 3,
    name: "Veggie Burger",
    description: "Crispy herb potato patty topped with lettuce, tomatoes, and tangy mayo",
    cost: 160,
    category: "Burgers",
    image: "https://images.unsplash.com/photo-1520072959219-c595dc870360?w=500&auto=format&fit=crop"
  },
  {
    id: 4,
    name: "Cheeseburger",
    description: "Juicy gourmet patty with melted cheddar, pickles, and chef special sauce",
    cost: 180,
    category: "Burgers",
    image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=500&auto=format&fit=crop"
  },
  {
    id: 5,
    name: "Caesar Salad",
    description: "Crisp romaine lettuce, garlic croutons, parmesan, and creamy dressing",
    cost: 120,
    category: "Snacks",
    image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=500&auto=format&fit=crop"
  },
  {
    id: 6,
    name: "French Fries",
    description: "Golden crispy potato fries seasoned with peri-peri herbs and sea salt",
    cost: 100,
    category: "Snacks",
    image: "https://images.unsplash.com/photo-1576107232684-1279f3908594?w=500&auto=format&fit=crop"
  },
  {
    id: 7,
    name: "Garlic Bread",
    description: "Toasted baguette slices brushed with fragrant garlic herb butter",
    cost: 130,
    category: "Snacks",
    image: "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=500&auto=format&fit=crop"
  },
  {
    id: 8,
    name: "Pasta Alfredo",
    description: "Creamy white sauce penne pasta with garlic, herbs, and parmesan",
    cost: 220,
    category: "Main Course",
    image: "https://images.unsplash.com/photo-1621996346565-e3d5d6281729?w=500&auto=format&fit=crop"
  },
  {
    id: 9,
    name: "Chocolate Cake",
    description: "Decadent dark chocolate molten fudge cake with warm ganache",
    cost: 140,
    category: "Desserts",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&auto=format&fit=crop"
  },
  {
    id: 10,
    name: "Cappuccino",
    description: "Freshly brewed espresso topped with creamy steamed milk foam",
    cost: 120,
    category: "Beverages",
    image: "https://images.unsplash.com/photo-1572442388796-11668ba67e53?w=500&auto=format&fit=crop"
  },
  {
    id: 11,
    name: "Cold Coffee",
    description: "Rich chilled blended coffee with a scoop of vanilla ice cream",
    cost: 130,
    category: "Beverages",
    image: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=500&auto=format&fit=crop"
  },
  {
    id: 12,
    name: "Iced Tea",
    description: "Refreshing lemon and mint brewed black tea served over ice cubes",
    cost: 110,
    category: "Beverages",
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&auto=format&fit=crop"
  }
];

const DEFAULT_IMAGE_LIST = [
  "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500",
  "https://images.unsplash.com/photo-1550547660-d9450f859349?w=500",
  "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=500",
  "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=500",
  "https://images.unsplash.com/photo-1601924582975-7e6c1a52f9f1?w=500"
];

function Menu() {
  const { table } = useParams();
  const navigate = useNavigate();
  const currentTable = table || "1";

  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [backendStatus, setBackendStatus] = useState("checking"); // 'connected' | 'fallback'
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [orderSuccessModal, setOrderSuccessModal] = useState(null);
  const [submittingOrder, setSubmittingOrder] = useState(false);

  // Auto-categorize helper if backend items don't have category
  const inferCategory = (name) => {
    const lower = name.toLowerCase();
    if (lower.includes("pizza")) return "Pizza";
    if (lower.includes("burger")) return "Burgers";
    if (lower.includes("coffee") || lower.includes("tea") || lower.includes("lemonade")) return "Beverages";
    if (lower.includes("cake") || lower.includes("ice cream") || lower.includes("jamun") || lower.includes("sundae")) return "Desserts";
    if (lower.includes("fries") || lower.includes("wings") || lower.includes("salad") || lower.includes("bread") || lower.includes("sandwich")) return "Snacks";
    return "Main Course";
  };

  // ✅ FETCH MENU FROM BACKEND WITH FALLBACK
  useEffect(() => {
    setLoading(true);

    axios.get(`${API_BASE_URL.replace(/\/$/, "")}/menu/`, { timeout: 4000 })
      .then(res => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          const itemsWithDetails = res.data.map((item, index) => ({
            ...item,
            category: item.category || inferCategory(item.name),
            image: item.image || DEFAULT_IMAGE_LIST[index % DEFAULT_IMAGE_LIST.length]
          }));
          setMenuItems(itemsWithDetails);
          setBackendStatus("connected");
        } else {
          // If response is empty list, load fallback
          setMenuItems(FALLBACK_MENU);
          setBackendStatus("fallback");
        }
      })
      .catch(err => {
        console.warn("Backend /menu/ request failed or timed out:", err.message);
        console.info("Using rich offline fallback menu items.");
        setMenuItems(FALLBACK_MENU);
        setBackendStatus("fallback");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Filter items by category and search
  const filteredItems = useMemo(() => {
    return menuItems.filter(item => {
      const matchesCategory =
        selectedCategory === "All" ||
        item.category?.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [menuItems, selectedCategory, searchTerm]);

  // Categories list
  const categories = useMemo(() => {
    const set = new Set(["All"]);
    menuItems.forEach(i => {
      if (i.category) set.add(i.category);
    });
    return Array.from(set);
  }, [menuItems]);

  // ✅ ADD TO CART
  const addToCart = (item) => {
    const existing = cart.find(i => i.id === item.id);
    if (existing) {
      setCart(cart.map(i =>
        i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  // ✅ REMOVE FROM CART
  const removeFromCart = (item) => {
    const existing = cart.find(i => i.id === item.id);
    if (!existing) return;

    if (existing.quantity === 1) {
      setCart(cart.filter(i => i.id !== item.id));
    } else {
      setCart(cart.map(i =>
        i.id === item.id ? { ...i, quantity: i.quantity - 1 } : i
      ));
    }
  };

  // ✅ TOTAL CALCULATION
  const total = cart.reduce((sum, item) => sum + item.cost * item.quantity, 0);

  // ✅ PLACE ORDER
  const placeOrder = () => {
    if (cart.length === 0) {
      alert("🛒 Your cart is empty! Please add some tasty dishes first.");
      return;
    }

    setSubmittingOrder(true);

    const orderData = {
      table_number: Number(currentTable) || 1,
      items: cart.map(item => `${item.name} x${item.quantity}`).join(", "),
      total: total
    };

    axios.post(`${API_BASE_URL.replace(/\/$/, "")}/order/`, orderData, { timeout: 5000 })
      .then(res => {
        setOrderSuccessModal({
          table: currentTable,
          items: orderData.items,
          total: total,
          message: res.data?.message || "Order placed successfully!"
        });
        setCart([]);
      })
      .catch(err => {
        console.warn("Order post failed on server:", err);
        // Still provide feedback for demo/fallback mode
        setOrderSuccessModal({
          table: currentTable,
          items: orderData.items,
          total: total,
          message: "Order placed in Offline Demo Mode (Backend not reached)."
        });
        setCart([]);
      })
      .finally(() => {
        setSubmittingOrder(false);
      });
  };

  return (
    <div className="menu-page">
      {/* NAVBAR */}
      <div className="navbar">
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <h2 style={{ margin: 0 }}>🍴 Spice Garden</h2>
          {backendStatus === "connected" ? (
            <span style={{
              background: "rgba(0, 200, 83, 0.2)",
              color: "#00e676",
              border: "1px solid #00e676",
              padding: "4px 10px",
              borderRadius: "20px",
              fontSize: "12px",
              fontWeight: "bold"
            }}>
              ● Backend Live (Port 8000)
            </span>
          ) : (
            <span style={{
              background: "rgba(255, 152, 0, 0.2)",
              color: "#ffb74d",
              border: "1px solid #ff9800",
              padding: "4px 10px",
              borderRadius: "20px",
              fontSize: "12px",
              fontWeight: "bold"
            }}>
              ● Offline Demo Mode
            </span>
          )}
        </div>

        {/* TABLE SELECTOR */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "14px", color: "#aaa" }}>Table:</span>
          <select
            value={currentTable}
            onChange={(e) => navigate(`/menu/${e.target.value}`)}
            style={{
              background: "#222",
              color: "#ffb347",
              border: "1px solid #444",
              padding: "6px 12px",
              borderRadius: "8px",
              fontWeight: "bold",
              fontSize: "14px",
              cursor: "pointer"
            }}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(t => (
              <option key={t} value={t}>Table {t}</option>
            ))}
          </select>
        </div>

        {/* NAV LINKS */}
        <div className="nav-links">
          <Link to={`/menu/${currentTable}`}>🍽 Menu</Link>
          <Link to={`/status/${currentTable}`}>📦 My Orders</Link>
          <Link to="/kitchen" style={{ color: "#00e5ff" }}>🍳 Kitchen Staff</Link>
          <a
            href={`${API_BASE_URL.replace(/\/$/, "")}/qr/${currentTable}/`}
            target="_blank"
            rel="noreferrer"
            style={{ fontSize: "15px", color: "#e0e0e0" }}
          >
            📱 Table QR
          </a>
        </div>
      </div>

      {/* HEADER HERO */}
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <h1 className="menu-title" style={{ marginBottom: "8px" }}>
          🍽 Delicious Restaurant Menu
        </h1>
        <p style={{ color: "#aaa", fontSize: "16px", margin: "0 0 15px 0" }}>
          Currently ordering for <strong style={{ color: "#ffb347" }}>Table {currentTable}</strong>.
          Scan or browse delicious dishes below!
        </p>

        {/* SEARCH BAR */}
        <div style={{ maxWidth: "480px", margin: "0 auto 25px auto" }}>
          <input
            type="text"
            placeholder="🔍 Search dishes (e.g., Pizza, Burger, Coffee)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "12px 20px",
              borderRadius: "30px",
              border: "1px solid #444",
              background: "#1e1e1e",
              color: "white",
              fontSize: "16px",
              outline: "none"
            }}
          />
        </div>

        {/* CATEGORY TABS */}
        <div className="categories">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                background: selectedCategory === cat ? "#ff9800" : "#2a2a2a",
                color: "white",
                fontWeight: selectedCategory === cat ? "bold" : "normal"
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* LOADING STATE */}
      {loading && (
        <div style={{ textAlign: "center", padding: "50px", color: "#ffb347" }}>
          <h2>⏳ Loading delicious menu items...</h2>
        </div>
      )}

      {/* MENU CONTAINER */}
      {!loading && (
        <div className="menu-container">
          {filteredItems.length === 0 && (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "40px" }}>
              <h3>No dishes found matching "{searchTerm}"</h3>
              <button
                onClick={() => { setSearchTerm(""); setSelectedCategory("All"); }}
                style={{
                  background: "#ff9800",
                  color: "white",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  marginTop: "10px"
                }}
              >
                Reset Filters
              </button>
            </div>
          )}

          {filteredItems.map(item => {
            const inCart = cart.find(c => c.id === item.id);
            return (
              <div key={item.id} className="menu-item">
                <img
                  src={item.image}
                  alt={item.name}
                  className="food-image"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500";
                  }}
                />

                <div className="menu-text">
                  <h2>{item.name}</h2>
                  <p>{item.description || "Freshly prepared with authentic ingredients."}</p>
                  <span className="price">₹ {item.cost}</span>

                  {inCart ? (
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <button
                        onClick={() => removeFromCart(item)}
                        style={{
                          background: "#e53935",
                          padding: "10px",
                          flex: "1",
                          fontWeight: "bold",
                          fontSize: "18px"
                        }}
                      >
                        ➖
                      </button>
                      <span style={{
                        fontSize: "18px",
                        fontWeight: "bold",
                        minWidth: "32px",
                        textAlign: "center"
                      }}>
                        {inCart.quantity}
                      </span>
                      <button
                        onClick={() => addToCart(item)}
                        style={{
                          background: "#43a047",
                          padding: "10px",
                          flex: "1",
                          fontWeight: "bold",
                          fontSize: "18px"
                        }}
                      >
                        ➕
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => addToCart(item)}>
                      🛒 Add to Cart
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CART SECTION */}
      <div className="cart-section">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2>🛒 Your Order Cart (Table {currentTable})</h2>
          {cart.length > 0 && (
            <button
              onClick={() => setCart([])}
              style={{
                background: "transparent",
                color: "#ff5252",
                border: "1px solid #ff5252",
                padding: "6px 12px",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "13px"
              }}
            >
              Clear Cart
            </button>
          )}
        </div>

        {cart.length === 0 ? (
          <p style={{ color: "#888", fontStyle: "italic", margin: "15px 0" }}>
            Your cart is empty. Click "Add to Cart" on any delicious dish above!
          </p>
        ) : (
          <div>
            {cart.map(item => (
              <div key={item.id} className="cart-item">
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: "45px", height: "45px", borderRadius: "8px", objectFit: "cover" }}
                  />
                  <div>
                    <span style={{ fontWeight: "bold", display: "block" }}>{item.name}</span>
                    <span style={{ color: "#aaa", fontSize: "13px" }}>₹ {item.cost} each</span>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                  <span style={{ fontWeight: "bold", color: "#ffb347" }}>
                    ₹ {item.cost * item.quantity}
                  </span>
                  <div>
                    <button onClick={() => removeFromCart(item)}>➖</button>
                    <span style={{ margin: "0 8px", fontWeight: "bold" }}>{item.quantity}</span>
                    <button onClick={() => addToCart(item)}>➕</button>
                  </div>
                </div>
              </div>
            ))}

            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderTop: "1px solid #333",
              paddingTop: "15px",
              marginTop: "20px"
            }}>
              <h3 style={{ margin: 0 }}>Grand Total:</h3>
              <h3 style={{ margin: 0, color: "#00e676", fontSize: "28px" }}>
                ₹ {total}
              </h3>
            </div>

            <button
              onClick={placeOrder}
              disabled={submittingOrder}
              style={{
                background: submittingOrder ? "#666" : "linear-gradient(90deg, #ff9800, #f57c00)",
                color: "white",
                fontWeight: "bold",
                fontSize: "18px",
                padding: "16px",
                borderRadius: "12px",
                marginTop: "18px",
                cursor: submittingOrder ? "not-allowed" : "pointer"
              }}
            >
              {submittingOrder ? "⏳ Placing Order..." : `⚡ Confirm & Place Order (₹ ${total})`}
            </button>
          </div>
        )}
      </div>

      {/* ORDER SUCCESS MODAL */}
      {orderSuccessModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.8)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 9999,
          padding: "20px"
        }}>
          <div style={{
            background: "#1e1e1e",
            borderRadius: "20px",
            padding: "30px",
            maxWidth: "460px",
            width: "100%",
            textAlign: "center",
            boxShadow: "0 10px 40px rgba(0,0,0,0.8)",
            border: "1px solid #333"
          }}>
            <div style={{ fontSize: "55px", marginBottom: "15px" }}>🎉</div>
            <h2 style={{ color: "#00e676", margin: "0 0 10px 0" }}>Order Placed!</h2>
            <p style={{ color: "#ddd", margin: "0 0 15px 0" }}>{orderSuccessModal.message}</p>

            <div style={{
              background: "#292929",
              padding: "15px",
              borderRadius: "10px",
              marginBottom: "20px",
              textAlign: "left",
              fontSize: "14px"
            }}>
              <p style={{ margin: "4px 0" }}><strong>Table:</strong> Table {orderSuccessModal.table}</p>
              <p style={{ margin: "4px 0" }}><strong>Items:</strong> {orderSuccessModal.items}</p>
              <p style={{ margin: "4px 0", color: "#ffb347" }}><strong>Total:</strong> ₹ {orderSuccessModal.total}</p>
            </div>

            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
              <button
                onClick={() => navigate(`/status/${currentTable}`)}
                style={{
                  background: "#00e676",
                  color: "black",
                  fontWeight: "bold",
                  border: "none",
                  padding: "12px 20px",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontSize: "15px"
                }}
              >
                Track Order Status ➡️
              </button>
              <button
                onClick={() => setOrderSuccessModal(null)}
                style={{
                  background: "#444",
                  color: "white",
                  border: "none",
                  padding: "12px 20px",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontSize: "15px"
                }}
              >
                Continue Menu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <div className="contact-section" id="contact">
        <h2>📍 Spice Garden Restaurant</h2>
        <p>123 Food Street, Downtown • Phone: +91 98765 43210</p>
        <p style={{ color: "#aaa", fontSize: "14px" }}>
          Scan table QR codes to quickly order contactless directly to the kitchen!
        </p>
      </div>
    </div>
  );
}

export default Menu;