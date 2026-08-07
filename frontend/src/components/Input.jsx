const Input = ({ title, value, onChange, placeholder }) => {
  return (
    <div>
      <label>
        {title}
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
      </label>
    </div>
  )
}

export default Input
