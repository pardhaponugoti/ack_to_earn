function Filters(props) {
  const { filterCategory, selectDataByCategory } = props;
  return (
    <div className="flex  pt-2">
      <p className="pl-2 pr-6">Filter:</p>
      <button
        label="All"
        className={
          filterCategory === "All"
            ? "inline-block px-4 py-1 bg-blue-600 text-white font-medium text-xs leading-tight capitalized rounded-full shadow-md"
            : "inline-block px-4 py-1 border-2 border-gray-300 text-gray-600 font-medium text-xs leading-tight capitalized rounded-full hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out"
        }
        onClick={() => selectDataByCategory("All")}
      >
        All
      </button>

      <button
        label="Active"
        className={
          filterCategory === "Active"
            ? "inline-block px-4 py-1 bg-blue-600 text-white font-medium text-xs leading-tight capitalized rounded-full shadow-md"
            : "inline-block px-4 py-1 border-2 border-gray-300 text-gray-600 font-medium text-xs leading-tight capitalized rounded-full hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out"
        }
        onClick={() => selectDataByCategory("Active")}
      >
        Active
      </button>

      <button
        label="Claimed"
        className={
          filterCategory === "Claimed"
            ? "inline-block px-4 py-1 bg-blue-600 text-white font-medium text-xs leading-tight capitalized rounded-full shadow-md"
            : "inline-block px-4 py-1 border-2 border-gray-300 text-gray-600 font-medium text-xs leading-tight capitalized rounded-full hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out"
        }
        onClick={() => selectDataByCategory("Claimed")}
      >
        Claimed
      </button>

      <button
        label="Expired"
        className={
          filterCategory === "Expired"
            ? "inline-block px-4 py-1 bg-blue-600 text-white font-medium text-xs leading-tight capitalized rounded-full shadow-md"
            : "inline-block px-4 py-1 border-2 border-gray-300 text-gray-600 font-medium text-xs leading-tight capitalized rounded-full hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out"
        }
        onClick={() => selectDataByCategory("Expired")}
      >
        Expired
      </button>
    </div>
  );
}

export default Filters;
