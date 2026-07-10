import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Inventory Dashboard</h1>
      <button onClick={() => navigate("/add")}>Add Product</button>
    </div>
  );
}

export default Dashboard;