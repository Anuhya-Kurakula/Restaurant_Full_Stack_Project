import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Kitchen.css";

function Kitchen() {

  const [orders, setOrders] = useState([]);

  // ✅ BACKEND URL
  const API_URL = "https://restaurant-qr-backend.onrender.com";

  // ✅ FETCH ORDERS
  const fetchOrders = () => {

    axios.get(`${API_URL}/orders/`)
      .then(res => setOrders(res.data))
      .catch(err => console.log(err));

  };

  useEffect(() => {

    fetchOrders();

    // AUTO REFRESH
    const interval = setInterval(fetchOrders, 5000);

    return () => clearInterval(interval);

  }, []);

  // ✅ UPDATE STATUS
  const updateStatus = (id, currentStatus) => {

    let newStatus = "Pending";

    if (currentStatus === "Pending") {

      newStatus = "Preparing";

    } else if (currentStatus === "Preparing") {

      newStatus = "Done";

    } else {

      newStatus = "Done";

    }

    axios.patch(`${API_URL}/orders/${id}/`, {

      status: newStatus

    })

    .then(() => fetchOrders())

    .catch(err => console.log(err));
  };

  // ✅ STATUS COLORS
  const getStatusColor = (status) => {

    if (status === "Pending") return "#ff9800";

    if (status === "Preparing") return "#03a9f4";

    if (status === "Done") return "#00c853";

    return "#ffffff";
  };

  return (

    <div className="kitchen-container">

      <h1 className="kitchen-title">
        🍳 Kitchen Dashboard
      </h1>

      <div className="orders-grid">

        {orders.length === 0 && (

          <h2 style={{ color: "white" }}>
            No Orders Yet
          </h2>

        )}

        {orders.map(order => (

          <div key={order.id} className="order-card">

            <h2>
              🍽 Table {order.table_number}
            </h2>

            <p className="order-items">

              {order.items}

            </p>

            <h3 className="order-total">

              ₹ {order.total}

            </h3>

            {/* STATUS */}
            <div
              style={{
                margin: "15px 0",
                padding: "10px",
                borderRadius: "10px",
                background: "#1f1f1f",
                textAlign: "center",
                color: getStatusColor(order.status),
                fontWeight: "bold"
              }}
            >

              {order.status}

            </div>

            {/* BUTTON */}
            <button
              className={`status-btn ${order.status.toLowerCase()}`}
              onClick={() => updateStatus(order.id, order.status)}
            >

              Update Status

            </button>

          </div>

        ))}

      </div>

    </div>
  );
}

export default Kitchen;