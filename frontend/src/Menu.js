import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import "./components/Menu.css";

function Menu() {

  const { table } = useParams();

  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);

  // 🔥 YOUR LAPTOP IP
const API_URL = "http://10.240.117.245:8000";

  const defaultImages = [
    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300",
    "https://images.unsplash.com/photo-1550547660-d9450f859349?w=300",
    "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=300",
    "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=300",
    "https://images.unsplash.com/photo-1601924582975-7e6c1a52f9f1?w=300"
  ];

  // ✅ FETCH MENU ITEMS
  useEffect(() => {

    axios.get(`${API_URL}/menu/`)
      .then(res => {

        const itemsWithImages = res.data.map((item, index) => ({
          ...item,
          image: item.image || defaultImages[index % defaultImages.length]
        }));

        setMenuItems(itemsWithImages);

      })
      .catch(err => console.log(err));

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

  // ✅ TOTAL
  const total = cart.reduce(
    (sum, item) => sum + item.cost * item.quantity,
    0
  );

  // ✅ PLACE ORDER
  const placeOrder = () => {

    if (cart.length === 0) {

      alert("Cart is Empty!");
      return;

    }

    const orderData = {

      table_number: parseInt(table),

      items: cart.map(item =>
        `${item.name} x${item.quantity}`
      ).join(", "),

      total: total

    };

    axios.post(`${API_URL}/order/`, orderData)

      .then(() => {

        alert("🎉 Order Successfully Placed!");

        setCart([]);

      })

      .catch(err => console.log(err));
  };

  return (

    <div className="menu-page">

      {/* NAVBAR */}
      <div className="navbar">

        <h2>🍴 Spice Garden</h2>

        <div className="nav-links">

          <Link to={`/menu/${table}`}>
            Menu
          </Link>

          <Link to={`/status/${table}`}>
            My Orders
          </Link>

          <a href="#contact">
            Contact
          </a>

        </div>

      </div>

      {/* TITLE */}
      <h1 className="menu-title">
        🍽 Restaurant Menu (Table {table})
      </h1>

      {/* MENU ITEMS */}
      <div className="menu-container">

        {menuItems.map((item) => (

          <div key={item.id} className="menu-item">

            <img
              src={item.image}
              alt={item.name}
              className="food-image"
            />

            <div className="menu-text">

              <h2>{item.name}</h2>

              <p>
                {item.description || "Delicious food"}
              </p>

              <span className="price">
                ₹ {item.cost}
              </span>

              <button onClick={() => addToCart(item)}>
                Add to Cart
              </button>

            </div>

          </div>

        ))}

      </div>

      {/* CART */}
      <div className="cart-section">

        <h2>🛒 Your Order</h2>

        {cart.length === 0 && (
          <p>No items added</p>
        )}

        {cart.map(item => (

          <div key={item.id} className="cart-item">

            <span>
              {item.name} × {item.quantity}
            </span>

            <span>
              ₹ {item.cost * item.quantity}
            </span>

            <div>

              <button onClick={() => removeFromCart(item)}>
                ➖
              </button>

              <button onClick={() => addToCart(item)}>
                ➕
              </button>

            </div>

          </div>

        ))}

        {cart.length > 0 && (

          <>

            <h3>Total: ₹ {total}</h3>

            <button onClick={placeOrder}>
              Place Order
            </button>

          </>

        )}

      </div>

      {/* CONTACT SECTION */}
      <div id="contact" className="contact-section">

        <h2>📞 Contact Us</h2>

        <p>🍴 Spice Garden Restaurant</p>

        <p>📍 Hyderabad, India</p>

        <p>📱 +91 9876543210</p>

        <p>✉ spicegarden@gmail.com</p>

        <p>🕒 Open: 10 AM - 11 PM</p>

      </div>

    </div>
  );
}

export default Menu;