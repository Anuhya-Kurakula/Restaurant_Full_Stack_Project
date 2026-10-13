import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "./services/api";
import "./Kitchen.css";

function Kitchen() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  // ✅ FETCH ORDERS
  const fetchOrders = useCallback(() => {
    axios
      .get(`${API_BASE_URL.replace(/\/$/, "")}/orders/`, { timeout: 4000 })
      .then((res) => {
        if (Array.isArray(res.data)) {
          setOrders(res.data);
        }
      })
      .catch((err) => console.warn("Kitchen orders fetch warning:", err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 4000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

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

    axios
      .patch(`${API_BASE_URL.replace(/\/$/, "")}/orders/${id}/`, {
        status: newStatus,
      })
      .then(() => fetchOrders())
      .catch((err) => console.error("Error updating order status:", err));
  };

  // ✅ STATUS COLORS
  const getStatusColor = (status) => {
    if (status === "Pending") return "#ff9800";
    if (status === "Preparing") return "#03a9f4";
    if (status === "Done") return "#00c853";
    return "#ffffff";
  };

  const filteredOrders = orders.filter((o) => {
    if (filter === "All") return true;
    return o.status === filter;
  });

  return (
    <div className="kitchen-container">
      {/* KITCHEN NAVBAR */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "15px 25px",
          background: "rgba(30, 41, 59, 0.7)",
          borderRadius: "14px",
          marginBottom: "25px",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <h2 style={{ margin: 0, color: "#facc15" }}>🍳 Kitchen Live Dashboard</h2>
          <span
            style={{
              background: "rgba(0, 200, 83, 0.2)",
              color: "#00c853",
              padding: "4px 10px",
              borderRadius: "20px",
              fontSize: "12px",
              fontWeight: "bold",
            }}
          >
            ● Auto-Syncing (Every 4s)
          </span>
        </div>

        <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
          <Link
            to="/menu/1"
            style={{
              color: "white",
              textDecoration: "none",
              background: "#334155",
              padding: "8px 14px",
              borderRadius: "8px",
              fontSize: "14px",
            }}
          >
            🍽 Customer Menu
          </Link>
          <Link
            to="/status/1"
            style={{
              color: "white",
              textDecoration: "none",
              background: "#334155",
              padding: "8px 14px",
              borderRadius: "8px",
              fontSize: "14px",
            }}
          >
            📦 Order Status
          </Link>
          <button
            onClick={fetchOrders}
            style={{
              background: "#facc15",
              color: "#000",
              border: "none",
              padding: "8px 14px",
              borderRadius: "8px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* FILTER TABS */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          justifyContent: "center",
          marginBottom: "25px",
        }}
      >
        {["All", "Pending", "Preparing", "Done"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            style={{
              background: filter === s ? "#facc15" : "#1e293b",
              color: filter === s ? "#000" : "#fff",
              border: "1px solid #334155",
              padding: "8px 18px",
              borderRadius: "20px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            {s} ({s === "All" ? orders.length : orders.filter((o) => o.status === s).length})
          </button>
        ))}
      </div>

      {loading && (
        <p style={{ textAlign: "center", color: "#aaa" }}>
          ⏳ Fetching incoming kitchen orders...
        </p>
      )}

      {/* ORDERS GRID */}
      <div className="orders-grid">
        {!loading && filteredOrders.length === 0 && (
          <div
            style={{
              gridColumn: "1 / -1",
              textAlign: "center",
              padding: "60px 20px",
              background: "#1e293b",
              borderRadius: "16px",
            }}
          >
            <h2 style={{ color: "#aaa" }}>No orders matching "{filter}" filter</h2>
            <p style={{ color: "#64748b" }}>
              New customer orders from the menu will automatically appear here in real-time.
            </p>
          </div>
        )}

        {filteredOrders.map((order) => (
          <div
            key={order.id}
            className="order-card"
            style={{
              borderLeft: `5px solid ${getStatusColor(order.status)}`,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h2 style={{ margin: 0, fontSize: "20px" }}>
                🍽 Table {order.table_number}
              </h2>
              <span style={{ color: "#94a3b8", fontSize: "13px" }}>
                Order #{order.id}
              </span>
            </div>

            <p className="order-items" style={{ minHeight: "45px" }}>
              {order.items}
            </p>

            <h3 className="order-total" style={{ color: "#4ade80" }}>
              ₹ {order.total}
            </h3>

            {/* STATUS BADGE */}
            <div
              style={{
                margin: "12px 0",
                padding: "8px",
                borderRadius: "8px",
                background: "#0f172a",
                textAlign: "center",
                color: getStatusColor(order.status),
                fontWeight: "bold",
                border: `1px solid ${getStatusColor(order.status)}`,
              }}
            >
              {order.status === "Pending" && "⏳ PENDING"}
              {order.status === "Preparing" && "🍳 PREPARING"}
              {order.status === "Done" && "✅ COMPLETED"}
            </div>

            {/* ACTION BUTTON */}
            {order.status !== "Done" ? (
              <button
                className={`status-btn ${order.status.toLowerCase()}`}
                onClick={() => updateStatus(order.id, order.status)}
              >
                {order.status === "Pending" && "Start Preparing ➡️"}
                {order.status === "Preparing" && "Mark Done & Ready ✅"}
              </button>
            ) : (
              <div
                style={{
                  textAlign: "center",
                  color: "#00c853",
                  fontSize: "13px",
                  fontWeight: "bold",
                  padding: "8px",
                }}
              >
                ✓ Order Served
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Kitchen;