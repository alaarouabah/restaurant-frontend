const DataTable = ({ columns, data, loading, emptyMessage = 'Aucune donn\u00e9e' }) => {
  if (loading) {
    return (
      <div className=\"bg-white rounded-xl shadow-md overflow-hidden\">
        <div className=\"animate-pulse\">
          <div className=\"h-12 bg-gray-200\"></div>
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className=\"h-16 bg-gray-100 border-t\"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className=\"bg-white rounded-xl shadow-md p-8 text-center\">
        <p className=\"text-gray-500\">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className=\"bg-white rounded-xl shadow-md overflow-hidden\">
      <div className=\"overflow-x-auto\">
        <table className=\"min-w-full divide-y divide-gray-200\">
          <thead className=\"bg-gray-50\">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className=\"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider\"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className=\"bg-white divide-y divide-gray-200\">
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className=\"hover:bg-gray-50 transition-colors\">
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className=\"px-6 py-4 whitespace-nowrap\">
                    {column.render ? column.render(row) : row[column.accessor]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
