import { useEffect, useState } from "react";
import API from "../services/api";
import Sidebar from "../components/Sidebar";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

function Dashboard() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { dark, toggleTheme } = useTheme();

  useEffect(() => {
    fetchDocs();
  }, []);

  const fetchDocs = async () => {
    try {
      setLoading(true);
      const res = await API.get("/documents");
      setDocs(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // 📊 CATEGORY COUNT
  const categoryMap = {};
  docs.forEach((doc) => {
    categoryMap[doc.category] = (categoryMap[doc.category] || 0) + 1;
  });

  const chartData = Object.keys(categoryMap).map((key) => ({
    name: key,
    value: categoryMap[key],
  }));

  // 📈 STATS
  const totalDocs = docs.length;
  const totalCategories = Object.keys(categoryMap).length;

  const recentDocs = [...docs]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  // 📉 TREND DATA
  const trendData = docs.map((doc, index) => ({
    name: index + 1,
    value: index + 1,
  }));

  const COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444"];

  return (
    <div className="app-layout">
      <Sidebar />

      <div className="main-content">
        <section className="dashboard-hero">
          <div>
            <span className="page-badge">Overview</span>
            <h2>Dashboard</h2>
            <p className="dashboard-desc">
              Track your document activity, usage trends, and recent uploads
              from a cleaner workspace.
            </p>
          </div>

          <div className="hero-card card">
            <div className="hero-card-top">
              <div>
                <p className="hero-card-title">Welcome back!</p>
                <p className="hero-card-text">
                  Your latest document insights are ready. Use the sidebar to
                  manage files, search content, or upload in one click.
                </p>
              </div>

              <button className="theme-toggle-btn" onClick={toggleTheme}>
                {dark ? "☀️ Light" : "🌙 Dark"}
              </button>
            </div>
          </div>
        </section>

        {loading ? (
          <div className="skeleton-grid">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card skeleton"></div>
            ))}
          </div>
        ) : (
          <>
            <div className="stats-grid">
              <StatCard title="Documents" value={totalDocs} />
              <StatCard title="Categories" value={totalCategories} />
              <StatCard title="Recent" value={recentDocs.length} />
            </div>

            <div className="dashboard-charts">
              <div className="card chart-card">
                <div className="card-header">
                  <h5>Documents by Category</h5>
                </div>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={chartData} dataKey="value" outerRadius={90}>
                      {chartData.map((entry, index) => (
                        <Cell
                          key={index}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="card chart-card">
                <div className="card-header">
                  <h5>Category Distribution</h5>
                </div>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#6366f1" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="card trend-card">
              <div className="card-header">
                <h5>Upload Trend</h5>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="4 4" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#22c55e"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <section className="recent-section">
              <div className="section-header">
                <div>
                  <h5>Recent Documents</h5>
                  <p className="section-subtitle">Latest uploads at a glance</p>
                </div>
                <span className="badge">Top 5</span>
              </div>

              <div className="recent-grid">
                {recentDocs.map((doc) => (
                  <div key={doc._id} className="card recent-card">
                    <h6>{doc.title}</h6>
                    <p>{doc.category}</p>
                    <small>
                      {new Date(doc.createdAt).toLocaleDateString()}
                    </small>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}

// 🔥 STAT CARD COMPONENT
const StatCard = ({ title, value }) => (
  <motion.div
    className="card stat-card"
    whileHover={{ scale: 1.05 }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <h5>{title}</h5>
    <h2>{value}</h2>
  </motion.div>
);

export default Dashboard;
