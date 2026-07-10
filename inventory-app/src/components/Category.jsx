function Category() {
  return (
    <div>
      <h1>Category Management</h1>

      <label>Category Name</label><br />
      <input type="text" placeholder="Enter Category" />
      <br /><br />

      <button>Add Category</button>

      <hr />

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Category Name</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>1</td>
            <td>Electronics</td>
          </tr>
          <tr>
            <td>2</td>
            <td>Grocery</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Category;