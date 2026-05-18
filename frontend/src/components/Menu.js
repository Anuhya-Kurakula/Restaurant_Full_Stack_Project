import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Menu.css";

function Menu() {

  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);

  const defaultImages = [
    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
    "https://images.unsplash.com/photo-1550547660-d9450f859349",
    "https://images.unsplash.com/photo-1600891964599-f61ba0e24092",
    "https://images.unsplash.com/photo-1525755662778-989d0524087e",
    "https://images.unsplash.com/photo-1601924582975-7e6c1a52f9f1"
  ];

  useEffect(() => {

    axios.get("http://127.0.0.1:8000/menu/")
      .then(res => {

        const itemsWithImages = res.data.map((item, index) => ({
          ...item,
          image: item.image || defaultImages[index % defaultImages.length]
        }));

        setMenuItems(itemsWithImages);

      })
      .catch(err => console.log(err));

  }, []);

  // ADD TO CART
  const addToCart = (item) => {
    setCart([...cart, item]);
  };

  // REMOVE FROM CART
  const removeFromCart = (index) => {
    const updated = [...cart];
    updated.splice(index, 1);
    setCart(updated);
  };

  return (

    <div className="menu-page">

      <h1 className="menu-title">BR Mission Restaurant Menu</h1>

      {/* CART ICON */}
      <div className="cart-box">
        🛒 Cart ({cart.length})
      </div>

      <div className="menu-container">

        {menuItems.map((item, index) => (

          <div
            key={item.id}
            className={`menu-item ${index % 2 === 0 ? "left" : "right"}`}
          >

            <img
              src={item.image}
              alt={item.name}
              className="food-image"
            />

            <div className="menu-text">

              <h2>{item.name}</h2>

              <p>{item.description}</p>

              <span className="cost">₹ {item.cost}</span>

              <button
                className="cart-btn"
                onClick={() => addToCart(item)}
              >
                Add to Cart
              </button>

            </div>

          </div>

        ))}

      </div>

      {/* CART SECTION */}

      <div className="cart-section">

        <h2>Your Order</h2>

        {cart.length === 0 && <p>No items added</p>}

        {cart.map((item, index) => (

          <div key={index} className="cart-item">

            <span>{item.name}</span>

            <span>₹ {item.cost}</span>

            <button
              onClick={() => removeFromCart(index)}
              className="remove-btn"
            >
              Remove
            </button>

          </div>

        ))}

      </div>

    </div>

  );

}

export default Menu;