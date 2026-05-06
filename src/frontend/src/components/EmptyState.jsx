function EmptyState({
  title = "데이터가 없습니다",
  message = "표시할 항목이 아직 없습니다.",
}) {
  return (
    <div className="status-card empty-card">
      <span className="status-card-title">{title}</span>
      <p>{message}</p>
    </div>
  );
}

export default EmptyState;
