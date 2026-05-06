function ErrorMessage({ message = "Something went wrong." }) {
  return (
    <div className="status-card error-card" role="alert">
      <span className="status-card-title">문제가 발생했습니다</span>
      <p>{message}</p>
    </div>
  );
}

export default ErrorMessage;
