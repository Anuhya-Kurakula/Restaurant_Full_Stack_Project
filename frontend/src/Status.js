import React, { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import { API_BASE_URL } from "./services/api";
import "./components/Status.css";

function Status() {
  const { table } = useParams();
  const navigate = useNavigate();
  const currentTable = table || "1";
  const tableNumber = parseInt(currentTable, 10);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [readyNotice, setReadyNotice] = useState(null);
  const notifiedOrdersRef = useRef(new Set());

  // ✅ FETCH ORDERS
  const fetchOrders = useCallback(() => {
    axios
      .get(`${API_BASE_URL.replace(/\/$/, "")}/order-status/`, { timeout: 4000 })
      .then((res) => {
        if (Array.isArray(res.data)) {
          const filtered = res.data.filter(
            (order) => order.table_number === tableNumber
          );
          setOrders(filtered);

          // Check if any order newly completed
          filtered.forEach((order) => {
            if (order.status === "Done" && !notifiedOrdersRef.current.has(order.id)) {
              notifiedOrdersRef.current.add(order.id);
              setReadyNotice(`🎉 Order #${order.id} is Ready! Please enjoy your meal.`);
            }
          });
        }
      })
      .catch((err) => {
        console.warn("Status fetch warning:", err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [tableNumber]);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 3000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  // ✅ STATUS COLORS
  const getColor = (status) => {
    if (status === "Pending") return "#ff9800";
    if (status === "Preparing") return "#00bfff";
    if (status === "Done") return "#00e676";
    return "#ffffff";
  };

  // ✅ PROGRESS BAR
  const getProgress = (status) => {
    if (status === "Pending") return "33%";
    if (status === "Preparing") return "66%";
    if (status === "Done") return "100%";
    return "10%";
  };

  return (
    <div className="status-page">
      {/* NAVBAR */}
      <div className="navbar">
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <h2 style={{ margin: 0 }}>🍴 Spice Garden</h2>
          <span
            style={{
              background: "rgba(0, 191, 255, 0.2)",
              color: "#00bfff",
              padding: "4px 10px",
              borderRadius: "20px",
              fontSize: "12px",
              fontWeight: "bold",
            }}
          >
            Live Tracking
          </span>
        </div>

        {/* TABLE SELECTOR */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "14px", color: "#aaa" }}>Table:</span>
          <select
            value={currentTable}
            onChange={(e) => navigate(`/status/${e.target.value}`)}
            style={{
              background: "#222",
              color: "#ffb347",
              border: "1px solid #444",
              padding: "6px 12px",
              borderRadius: "8px",
              fontWeight: "bold",
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((t) => (
              <option key={t} value={t}>
                Table {t}
              </option>
            ))}
          </select>
        </div>

        <div className="nav-links">
          <Link to={`/menu/${currentTable}`}>🍽 Menu</Link>
          <Link to={`/status/${currentTable}`}>📦 My Orders</Link>
          <Link to="/kitchen" style={{ color: "#00e5ff" }}>🍳 Kitchen</Link>
        </div>
      </div>

      {/* NOTIFICATION BANNER */}
      {readyNotice && (
        <div
          style={{
            background: "linear-gradient(90deg, #00c853, #64dd17)",
            color: "#000",
            padding: "16px 20px",
            borderRadius: "14px",
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "18px",
            marginBottom: "25px",
            boxShadow: "0 6px 20px rgba(0, 200, 83, 0.4)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>{readyNotice}</span>
          <button
            onClick={() => setReadyNotice(null)}
            style={{
              background: "rgba(0,0,0,0.2)",
              border: "none",
              color: "#000",
              fontWeight: "bold",
              borderRadius: "50%",
              width: "28px",
              height: "28px",
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* TITLE */}
      <h1 className="status-title">📦 Order Status (Table {currentTable})</h1>

      {loading && (
        <p style={{ textAlign: "center", color: "#aaa" }}>
          ⏳ Fetching your latest orders...
        </p>
      )}

      {/* EMPTY STATE */}
      {!loading && orders.length === 0 && (
        <div
          style={{
            textAlign: "center",
            background: "#1e1e1e",
            padding: "50px 20px",
            borderRadius: "20px",
            maxWidth: "500px",
            margin: "0 auto",
          }}
        >
          <div style={{ fontSize: "50px", marginBottom: "10px" }}>🍽</div>
          <h2 style={{ color: "#ffb347" }}>No Orders Placed Yet</h2>
          <p style={{ color: "#aaa", marginBottom: "25px" }}>
            You haven't placed any orders for Table {currentTable} yet.
          </p>
          <Link
            to={`/menu/${currentTable}`}
            style={{
              background: "#ff9800",
              color: "white",
              padding: "12px 24px",
              borderRadius: "10px",
              textDecoration: "none",
              fontWeight: "bold",
              display: "inline-block",
            }}
          >
            Go to Menu & Order Now
          </Link>
        </div>
      )}

      {/* ORDERS LIST */}
      <div style={{ maxWidth: "700px", margin: "0 auto" }}>
        {orders.map((order) => (
          <div key={order.id} className="status-card">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid #333",
                paddingBottom: "10px",
                marginBottom: "15px",
              }}
            >
              <h2 style={{ margin: 0, fontSize: "22px" }}>
                Order #{order.id}
              </h2>
              <span
                style={{
                  background: "rgba(255,255,255,0.1)",
                  padding: "4px 10px",
                  borderRadius: "8px",
                  fontSize: "14px",
                  color: "#aaa",
                }}
              >
                Table {order.table_number}
              </span>
            </div>

            <p style={{ fontSize: "16px", color: "#ddd", margin: "12px 0" }}>
              <strong>Items:</strong> {order.items}
            </p>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                margin: "15px 0",
              }}
            >
              <div>
                <span style={{ color: "#888", fontSize: "14px" }}>Status: </span>
                <span
                  style={{
                    color: getColor(order.status),
                    fontWeight: "bold",
                    fontSize: "18px",
                  }}
                >
                  {order.status === "Pending" && "⏳ Pending"}
                  {order.status === "Preparing" && "🍳 Preparing in Kitchen"}
                  {order.status === "Done" && "✅ Done & Ready!"}
                </span>
              </div>

              <div style={{ textAlign: "right" }}>
                <span style={{ color: "#888", fontSize: "14px" }}>Total: </span>
                <span
                  style={{
                    color: "#00e676",
                    fontWeight: "bold",
                    fontSize: "20px",
                  }}
                >
                  ₹ {order.total}
                </span>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                color: "#bbb",
                fontSize: "14px",
                marginTop: "10px",
              }}
            >
              <span>
                ⏱ Estimated Time:{" "}
                <strong style={{ color: "white" }}>
                  {order.status === "Done" ? "Ready" : `${order.estimated_time || 15} mins`}
                </strong>
              </span>
              <span>{getProgress(order.status)} Completed</span>
            </div>

            {/* PROGRESS BAR */}
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: getProgress(order.status),
                  background: getColor(order.status),
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Status;