function Loading({ message = "Loading..." }) {
  return (
    <div className="status-card loading-card" role="status">
      <span className="loading-spinner" aria-hidden="true" />
      <p>{message}</p>
    </div>
  );
}

export default Loading;
