function Filters(props) {
  const { filterCategory, setFilterCategory } = props

  function Filter(props) {
    return (
      <button
        label={props.title}
        className={`px-3 py-1 rounded border transition
            ${
              filterCategory === props.title
                ? `bg-gray-200 border-gray-300`
                : `border-transparent hover:bg-gray-200`
            }
          `}
        onClick={() => setFilterCategory(props.title)}
      >
        {props.title}
      </button>
    )
  }

  return (
    <div className="bg-gray-100 flex items-center rounded text-sm">
      <Filter title="All" />
      <Filter title="Active" />
      <Filter title="Claimed" />
      <Filter title="Expired" />
    </div>
  )
}

export default Filters
