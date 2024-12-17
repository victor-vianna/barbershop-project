import React from "react";

interface TimeModal {
  date: Date;
  onConfirm: (time: string) => void;
  onClose: () => void;
}

function TimeModal() {
  return <div>TimeModal</div>;
}

export default TimeModal;
