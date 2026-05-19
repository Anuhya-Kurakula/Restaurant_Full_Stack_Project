import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import "./components/Menu.css";

function Menu() {

  const { table } = useParams();

  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);

  const API_URL = "https://restaurant-qr-backend.onrender.com";

  // ✅ FETCH MENU
  useEffect(() => {

    const defaultImages = [
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300",
      "https://images.unsplash.com/photo-1550547660-d9450f859349?w=300",
      "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=300",
      "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=300",
      "https://images.unsplash.com/photo-1601924582975-7e6c1a52f9f1?w=300"
    ];

    axios.get(`${API_URL}/menu/`)
      .then(res => {

        const itemsWithImages = res.data.map((item, index) => ({
          ...item,
          image: item.image || defaultImages[index % defaultImages.length]
        }));

        setMenuItems(itemsWithImages);
      })
      .catch(err => {
        console.log("Menu fetch error:", err);
      });

  }, []);

  // ✅ ADD TO CART
  const addToCart = (item) => {

    const existing = cart.find(i => i.id === item.id);

    if (existing) {
      setCart(cart.map(i =>
        i.id === item.id
          ? { ...i, quantity: i.quantity + 1 }
          : i
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
        i.id === item.id
          ? { ...i, quantity: i.quantity - 1 }
          : i
      ));
    }
  };

  // ✅ TOTAL CALCULATION
  const total = cart.reduce(
    (sum, item) => sum + item.cost * item.quantity,
    0
  );

  // ✅ PLACE ORDER (🔥 IMPORTANT FIXED ENDPOINT)
  const placeOrder = () => {

  if (cart.length === 0) {
    alert("Cart is Empty!");
    return;
  }

  const orderData = {
    table_number: Number(table),

    // ✅ SAFE FORMAT (NO 400 ERROR)
    items: JSON.stringify(
      cart.map(item => `${item.name} x${item.quantity}`)
    ),

    total: total
  };

  axios.post(`${API_URL}/order/`, orderData)
    .then(() => {
      alert("🎉 Order Placed Successfully!");
      setCart([]);
    })
    .catch(err => {
      console.log(err.response?.data || err.message);
      alert("Order Failed");
    });
};

  return (
    <div className="menu-page">

      {/* NAVBAR */}
      <div className="navbar">
        <h2>🍴 Spice Garden</h2>

        <div className="nav-links">
          <Link to={`/menu/${table}`}>Menu</Link>
          <Link to={`/status/${table}`}>My Orders</Link>
          <a href="#contact">Contact</a>
        </div>
      </div>

      {/* TITLE */}
      <h1>🍽 Menu (Table {table})</h1>

      {/* MENU LIST */}
      <div className="menu-container">
        {menuItems.map(item => (
          <div key={item.id} className="menu-item">

            <img src={item.image} alt={item.name} />

            <h3>{item.name}</h3>
            <p>₹ {item.cost}</p>

            <button onClick={() => addToCart(item)}>
              Add to Cart
            </button>

          </div>
        ))}
      </div>

      {/* CART */}
      <div className="cart-section">

        <h2>🛒 Cart</h2>

        {cart.length === 0 && <p>No items in cart</p>}

        {cart.map(item => (
          <div key={item.id} className="cart-item">

            <span>
              {item.name} × {item.quantity}
            </span>

            <span>
              ₹ {item.cost * item.quantity}
            </span>

            <div>
              <button onClick={() => removeFromCart(item)}>➖</button>
              <button onClick={() => addToCart(item)}>➕</button>
            </div>

          </div>
        ))}

        <h3>Total: ₹ {total}</h3>

        <button onClick={placeOrder}>
          Place Order
        </button>

      </div>

    </div>
  );
}

export default Menu;