import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import "./components/Status.css";

function Status() {

  const { table } = useParams();
  const tableNumber = parseInt(table);

  const [orders, setOrders] = useState([]);

  // 🔥 YOUR LAPTOP IP
  const API_URL = "http://10.240.117.245:8000";

  // ✅ FETCH ORDERS
  const fetchOrders = () => {

    axios.get(`${API_URL}/order-status/`)

      .then(res => {

        const filtered = res.data.filter(
          order => order.table_number === tableNumber
        );

        // ✅ SHOW ONLY LATEST ORDER
        if (filtered.length > 0) {

          setOrders([filtered[filtered.length - 1]]);

        } else {

          setOrders([]);

        }

      })

      .catch(err => console.log(err));
  };

  useEffect(() => {

    fetchOrders();

    const interval = setInterval(fetchOrders, 3000);

    return () => clearInterval(interval);

  }, []);

  // ✅ STATUS COLORS
  const getColor = (status) => {

    if (status === "Pending") return "orange";

    if (status === "Preparing") return "#00bfff";

    if (status === "Done") return "#00ff99";

    return "white";
  };

  // ✅ PROGRESS BAR
  const getProgress = (status) => {

    if (status === "Pending") return "33%";

    if (status === "Preparing") return "66%";

    if (status === "Done") return "100%";

    return "0%";
  };

  // ✅ READY ALERT
  useEffect(() => {

    orders.forEach(order => {

      if (order.status === "Done") {

        alert("🎉 Your Order is Ready!");

      }

    });

  }, [orders]);

  return (

    <div className="status-page">

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

          <Link to={`/menu/${table}`}>
            Back
          </Link>

        </div>

      </div>

      {/* TITLE */}
      <h1 className="status-title">
        📦 Order Status (Table {table})
      </h1>

      {/* EMPTY */}
      {orders.length === 0 && (

        <p style={{ textAlign: "center" }}>
          No orders yet
        </p>

      )}

      {/* ORDERS */}
      {orders.map(order => (

        <div key={order.id} className="status-card">

          <h2>
            🍽 Table {order.table_number}
          </h2>

          <p>
            {order.items}
          </p>

          {/* STATUS */}
          <h3 style={{
            color: getColor(order.status)
          }}>
            {order.status}
          </h3>

          {/* ETA */}
          <p>
            ⏱ Estimated Time:
            {" "}
            {order.estimated_time} mins
          </p>

          {/* PROGRESS BAR */}
          <div className="progress-bar">

            <div
              className="progress-fill"
              style={{
                width: getProgress(order.status),
                background: getColor(order.status)
              }}
            ></div>

          </div>

        </div>

      ))}

    </div>
  );
}

export default Status;