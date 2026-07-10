function Dashboard({ onNavigate }) {
  return (
    <div>
      <h1>Inventory Dashboard</h1>
      <button onClick={() => onNavigate("add")}>Add Product</button>
    </div>
  );
}

export default Dashboard;