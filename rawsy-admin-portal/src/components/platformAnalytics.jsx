import React, { useState, useEffect } from "react";
import "./PlatformAnalytics.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

function PlatformAnalytics() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("authToken");

      const response = await fetch("http://localhost:4000/api/admin/analytics", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch analytics");
      }

      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="analytics-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-page">
      <div className="analytics-header">
        <h2>Platform Analytics</h2>
        <button onClick={fetchAnalytics} className="refresh-button">
          Refresh
        </button>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {!stats ? (
        <p className="no-data">No analytics data found</p>
      ) : (
        <>
          {/* Stats Summary */}
          <div className="analytics-stats-grid">
            <div className="analytics-card">
              <h4>Total Users</h4>
              <p>{stats.totalUsers}</p>
            </div>

            <div className="analytics-card">
              <h4>Active Users</h4>
              <p>{stats.activeUsers}</p>
            </div>

            <div className="analytics-card">
              <h4>Suspended Users</h4>
              <p>{stats.suspendedUsers}</p>
            </div>

            <div className="analytics-card">
              <h4>Pending Verification</h4>
              <p>{stats.pendingVerification}</p>
            </div>
          </div>

          {/* Monthly Registrations Chart */}
          <div className="chart-section">
            <h3>Monthly User Registrations</h3>
            <div className="chart-box">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.monthlyRegistrations}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#2563eb" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Traffic Chart */}
          <div className="chart-section">
            <h3>Daily Platform Traffic</h3>
            <div className="chart-box">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={stats.dailyTraffic}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="visits" stroke="#10b981" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default PlatformAnalytics;
